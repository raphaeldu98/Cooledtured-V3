import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';
import {FaArrowLeft} from 'react-icons/fa';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // @ts-ignore
  return [{title: `cooledtured | ${data?.policy.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return json({policy});
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto flex align-top my-4 justify-center min-h-screen">
      <div className="policy bg-slate-200 bg-opacity-60 p-8 rounded-2xl w-full sm:max-w-[100ch]">
        <div className="mb-4 relative">
          <Link
            to="/policies"
            className="flex items-center text-white absolute p-2"
          >
            <div className="transition-all duration-150 ease-in-out bg-blue-900 hover:bg-gray-600 border-2 border-transparent hover:border-black  rounded-full p-2 hover:scale-105 active:scale-95">
              <FaArrowLeft />
            </div>
            <p className="ml-2 text-blue-950 hover:underline hover:scale-105">
              Back to policies
            </p>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-4 mt-8 text-center">
          {policy.title}
        </h1>
        <div
          className="text-gray-800 mx-auto max-w-[90ch] prose prose-sm"
          dangerouslySetInnerHTML={{__html: policy.body}}
        />
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
