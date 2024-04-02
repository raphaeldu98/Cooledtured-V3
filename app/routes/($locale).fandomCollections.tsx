import {useLoaderData, Link} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import type {PredictiveCollectionFragment} from 'storefrontapi.generated';
import {fandomCollectionHandles} from '../CollectionConfigs/fandomCollectionsConfig';

// Loader function to fetch specific collections
export async function loader({context}: LoaderFunctionArgs) {
  const FANDOM_COLLECTIONS_QUERY = generateFandomCollectionsQuery();
  const response = await context.storefront.query(FANDOM_COLLECTIONS_QUERY);
  const collections = fandomCollectionHandles
    .map((handle) => response[handle.replace(/-/g, '')])
    .filter(Boolean);
  return json({collections});
}

// React component to display specific collections
export default function FandomCollections() {
  const {collections} = useLoaderData<typeof loader>();
  return (
    <div className="collections mx-8 mb-8">
      <h1 className="text-6xl my-6 pt-4 w-full bg-blue-950 text-slate-100 border-4 border-slate-900 rounded-2xl text-center pb-6">
        Fandom Collections
      </h1>
      <div className="grid mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-screen-3xl gap-10">
        {collections.map((collection: PredictiveCollectionFragment) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="rounded-3xl p-2 bg-slate-900 overflow-clip col-md-4 text-center mb-3 hover:opacity-80 hover:shadow-lg hover:bg-white-500 transform hover:scale-105 transition-all duration-300"
            prefetch="intent"
          >
            {collection.image && (
              <Image
                alt={collection.image.altText || collection.title}
                aspectRatio="1/1"
                data={collection.image}
                className="rounded-2xl"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Dynamically generate GraphQL query
const generateFandomCollectionsQuery = () => {
  return `#graphql
    fragment Collection on Collection {
      id
      title
      handle
      image {
        id
        url(transform: {crop: CENTER, maxWidth: 300, maxHeight: 300, scale: 2})
        altText
      }
    }
    query FandomCollections {
      ${fandomCollectionHandles
        .map(
          (handle) => `
        ${handle.replace(
          /-/g,
          '',
        )}: collectionByHandle(handle: "fandom-${handle}") {
          ...Collection
        }
      `,
        )
        .join('')}
    }
  `;
};
