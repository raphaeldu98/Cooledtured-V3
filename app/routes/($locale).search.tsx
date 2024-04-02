// Improvement Notes:
// Changing the product query in the below graphQL function from a 'search' query to a 'product' query will enable sorting options to be enabled through the url, as the vendor filters currently are. All sorting options ideally should be run this way, but due to having to rely on Tags for many filters, passing a Signal from this file to its children is the way that was utilized to fetch these filters applied after search results were obtained - thus they are not affecting the query at all.
// Collections would be easily accessible by pulling these through the query with the commented code on the product fragment, which can then be displayed in the searchFilter component. Implementing a collections dropdown that would redirect to the collection rather than filtering the existing query by collection would be ideal.
// Ideally I would place the searchFilter component at the top of the productsGrid component time was not available to refactor.
//Pagination showing the next 2 pages instead of 1 would be ideal.
// Implement suggested searches and make use of the predictiveSearch

import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';

import {SearchForm, SearchResults, NoSearchResults} from '~/components/Search';
import {useSignal} from '@preact/signals-react';

// Function to define metadata for the current route, setting the page title.
export const meta: MetaFunction = () => {
  return [{title: `cooledtured | Search`}];
};

// Loader function to fetch data asynchronously based on the current request, such as search parameters.
export async function loader({request, context}: LoaderFunctionArgs) {
  // Parsing the request URL to access search parameters.
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Handling pagination by extracting variables from the request.
  const variables = getPaginationVariables(request, {pageBy: 250});

  // Extracting search term and filters from the URL parameters.
  const searchTerm = String(searchParams.get('q') || '');
  const vendorFilter = String(searchParams.get('vendor') || '');
  const ExclusiveFilter = String(searchParams.get('Exclusive') || '');
  const CollectionFilter = String(searchParams.get('Collection') || '');
  const typeFilter = String(searchParams.get('type') || '');

  // Early return if no search term is provided to avoid unnecessary processing.
  if (!searchTerm) {
    return {
      searchResults: {results: null, totalProducts: 0},
      searchTerm,
    };
  }

  // Constructing dynamic filters based on the search parameters.
  const combinedFilters: {
    productVendor?: string;
    productType?: string;
    productExclusive?: string;
    Collection?: string;
  }[] = [];

  if (vendorFilter) {
    const vendors = vendorFilter.split('|');
    vendors.forEach((vendor) => {
      combinedFilters.push({productVendor: vendor});
    });
  }

  if (typeFilter) {
    const types = typeFilter.split('|');
    types.forEach((type) => {
      combinedFilters.push({productType: type});
    });
  }

  if (ExclusiveFilter) {
    const Exclusives = ExclusiveFilter.split('|');
    Exclusives.forEach((Exclusive) => {
      combinedFilters.push({productExclusive: Exclusive});
    });
  }

  if (CollectionFilter) {
    const Collections = CollectionFilter.split('|');
    Collections.forEach((Collectionz) => {
      combinedFilters.push({Collection: Collectionz});
    });
  }

  // Executing the search query with constructed filters against the Shopify backend.
  const data = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query: searchTerm,
      productFilters: combinedFilters.length > 0 ? combinedFilters : null,
      ...variables,
    },
  });

  // Throwing an error if no data is returned to handle failed queries gracefully.
  if (!data) {
    throw new Error('No search data returned from Shopify API');
  }

  const totalResults = Object.values(data).reduce((total, value: any) => {
    return total + value.nodes.length;
  }, 0);

  const searchResults = {
    results: data,
    totalResults,
  };

  return defer({searchTerm, searchResults});
}

// Default function for the SearchPage component, utilizing loaded data to render the search page.
export default function SearchPage() {
  // Accessing loaded data using the `useLoaderData` hook.
  // @ts-ignore
  const {searchTerm, searchResults} = useLoaderData<typeof loader>();

  // Initialize the sortOption signal
  const sortOption = useSignal('RELEVANCE');
  // Initialize the TypeFilters signal
  const typeFilters = useSignal<string[]>([]);
  const availabilityFilters = useSignal<string>('');
  // Signals for vendorFilters
  const vendorFilters = useSignal<string[]>([]);

  const totalProducts = searchResults.results?.products?.nodes.length || 0;
  const totalArticles = searchResults.results?.articles?.nodes.length || 0;

  // Returning the JSX structure for the search page, including the search form and results or a message for no results.
  return (
    <div
      className="gap-5 w-full min-h-screen bg-repeat bg-cover bg-fixed"
      style={{backgroundImage: 'url("/images/cooledtured-bg-site.webp")'}}
    >
      <div className="p-5 bg-gray-300 rounded-lg">
        <h1 className="text-2xl mb-5">Search</h1>
        <SearchForm
          searchTerm={searchTerm}
          showSearchButton={true}
          searchResults={searchResults.results}
          value1={totalProducts}
          value2={totalArticles}
          sortOption={sortOption} // Pass sortOption as a prop
          typeFilters={typeFilters}
          availabilityFilters={availabilityFilters}
          vendorFilters={vendorFilters}
        />
      </div>
      {/* Search Results Container */}
      <div className="flex justify-center">
        {searchTerm || searchResults.totalResults === true ? (
          <SearchResults
            results={searchResults.results}
            sortOption={sortOption}
            typeFilters={typeFilters}
            availabilityFilters={availabilityFilters}
            vendorFilters={vendorFilters}
          />
        ) : (
          <NoSearchResults />
        )}
      </div>
    </div>
  );
}

// GraphQL query string for searching products, pages, and articles based on filters
const SEARCH_QUERY = `#graphql
# GraphQL fragments for different search result types
  fragment SearchProduct on Product {
    __typename
    handle
    tags
    id
    publishedAt
    title
    trackingParameters
    vendor
############ pull collection data for each product    
    collections(first: 5) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
    }
  }
################### Commented out Page search due to lack of specified need
#  fragment SearchPage on Page {
#     __typename
#     handle
#    id
#    title
#    trackingParameters
#  }
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
    author: authorV2 {
      name
    }
    contentHtml
    image {
      id
      altText
      url
    }
    publishedAt
    title
    blog {
      handle
    }
  }
  # Main search query, parameterized to filter by product, page, or article
  query search(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $query: String!
    $startCursor: String
    $productFilters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: RELEVANCE,
      last: $last,
      before: $startCursor,
      after: $endCursor
      productFilters: $productFilters
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    #pages: search(
    #  query: $query,
    #  types: [PAGE],
    #  first: 10
    #) {
    #  nodes {
    #    ...on Page {
    #      ...SearchPage
    #    }
    #  }
    #}
    articles: articles(
      query: $query,
      sortKey: PUBLISHED_AT,
      reverse: true,
      first: 5
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
  }
` as const;
