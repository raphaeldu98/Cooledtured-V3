import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import FAQPage from '~/components/FAQPage';
import {FaArrowLeft} from 'react-icons/fa';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // @ts-ignore
  return [{title: `cooledtured | ${data?.page.title ?? ''}`}];
};

export async function loader({params, context, request}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  // Get the Referer header from the request
  const referer = request.headers.get('Referer');

  // Check if the referer URL is the policies page
  const cameFromPolicies = referer && new URL(referer).pathname === '/policies';

  return json({page, cameFromPolicies});
}

export default function Page() {
  const {page, cameFromPolicies} = useLoaderData<typeof loader>();

  const isFAQPage = page && page.title === 'FAQs';

  return (
    <div className="container mx-auto flex align-top my-4 justify-center min-h-screen">
      <div className="bg-slate-200 bg-opacity-60 p-8 rounded-2xl w-full sm:max-w-[110ch]">
        <header>
          {cameFromPolicies && (
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
          )}
        </header>
        <h1 className="text-3xl font-bold text-center mb-8 mt-16">
          {page.title === 'FAQs' ? 'Frequently Asked Questions' : page.title}
        </h1>
        {isFAQPage ? (
          <FAQPage />
        ) : (
          <div
            className="text-gray-800 mx-auto max-w-[90ch] prose prose-sm"
            dangerouslySetInnerHTML={{__html: page.body}}
          />
        )}
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
