import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Link,
  type MetaFunction,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {Money, getPaginationVariables, Pagination} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import {ProductForm} from './($locale).products.$handle';
import TagOverlay from '~/components/TagOverlay';
import {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {useEffect} from 'react';
import {useSignal} from '@preact/signals-react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // @ts-ignore
  return [{title: `cooledtured | ${data?.collection.title ?? ''} Collection`}];
};

type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  tags: string[];
  vendor: string;
  featuredImage: {
    id: string;
    altText: string;
    url: string;
    width: number;
    height: number;
  };
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  variants: {
    nodes: Variant[];
  };
};

type Variant = {
  id: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

type ProductGridProps = {
  products: Product[];
};

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor?: string;
  startCursor?: string;
};

type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: {
    edges: {
      node: Product;
      cursor: string;
    }[];
    pageInfo: PageInfo;
  };
};

type Filter = {available: boolean} | {productVendor: string} | {tag: string};

export const loader = async ({
  params,
  context,
  request,
}: LoaderFunctionArgs) => {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);

  // Extracting URL parameters for pagination and filtering
  const sortKey = url.searchParams.get('sortKey') || 'COLLECTION_DEFAULT';
  const reverse = url.searchParams.get('reverse') === 'true';
  const productVendor = url.searchParams.get('vendor');
  const tag = url.searchParams.get('tag');

  // Define the number of results per page
  const variables = getPaginationVariables(request, {
    pageBy: 120, // or your desired page size
  });

  const combinedFilters: Filter[] = [{available: true}];
  if (productVendor) combinedFilters.push({productVendor});
  if (tag) combinedFilters.push({tag});

  const response = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      sortKey,
      reverse,
      filters: combinedFilters,
      ...variables,
    },
  });

  if (!response || !response.collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  return json({
    collection: response.collection,
    pageInfo: response.collection.products.pageInfo,
  });
};

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSortKey = useSignal(
    searchParams.get('sortKey') || 'COLLECTION_DEFAULT',
  );
  const reverseSort = useSignal(searchParams.get('reverse') === 'true');
  const selectedTag = useSignal(searchParams.get('tag') || null);
  const selectedVendor = useSignal(searchParams.get('vendor') || null);
  // Use Maps for tag and vendor counts, where the key is the tag/vendor name, and the value is a set of product IDs
  const allTags = useSignal(new Map<string, Set<string>>());
  const allVendors = useSignal(new Map<string, Set<string>>());

  // const currentPage = useSignal(0);
  // const productsPerPage = 20; // Adjust as necessary
  // const initialProducts = collection.products.edges;
  // const cumulativeProductsLoaded = useSignal([...initialProducts]);
  // // Calculate totalPages based on cumulativeProductsLoaded
  // const totalPages = useSignal(
  //   Math.ceil(cumulativeProductsLoaded.value.length / productsPerPage),
  // );

  // // Calculate the products to display for the current page
  // const displayedProducts = cumulativeProductsLoaded.value.slice(
  //   currentPage.value * productsPerPage,
  //   (currentPage.value + 1) * productsPerPage,
  // );

  // // Handler to change page
  // const setPage = (page: number) => {
  //   currentPage.value = Math.max(0, Math.min(page, totalPages.value - 1)); // Clamp between 0 and totalPages - 1
  //   // Optionally, update URL or perform other actions here
  // };

  // // Function to simulate loading more products
  // const loadMoreProducts = () => {
  //   // Simulate loading more products (e.g., by fetching more data and appending it to your dataset)
  //   // increase the cumulativeProductsLoaded by the initial load amount
  //   cumulativeProductsLoaded.value = [
  //     ...cumulativeProductsLoaded.value,
  //     ...initialProducts,
  //   ];
  //   // Recalculate totalPages based on new cumulativeProductsLoaded
  //   totalPages.value = Math.ceil(
  //     cumulativeProductsLoaded.value.length / productsPerPage,
  //   );
  // };

  // Update URL with current filters, sort, and pagination
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (selectedSortKey.value)
      newSearchParams.set('sortKey', selectedSortKey.value);
    if (reverseSort.value)
      newSearchParams.set('reverse', reverseSort.value.toString());
    if (selectedTag.value) newSearchParams.set('tag', selectedTag.value);
    if (selectedVendor.value)
      newSearchParams.set('vendor', selectedVendor.value);

    // Push the updated search params to history
    const currentURL = new URL(window.location.href);
    const newURL = `${currentURL.pathname}?${newSearchParams.toString()}`;
    navigate(newURL, {replace: true});
  }, [
    selectedSortKey.value,
    reverseSort.value,
    selectedTag.value,
    selectedVendor.value,
    navigate,
  ]);

  // Dropdown options for sorting
  const sortOptions = [
    {value: 'COLLECTION_DEFAULT,false', label: 'Featured'},
    {value: 'CREATED,true', label: 'Newest First'},
    {value: 'CREATED,false', label: 'Oldest First'},
    {value: 'BEST_SELLING,false', label: 'Best Selling'},
    {value: 'PRICE,false', label: 'Price Low to High'},
    {value: 'PRICE,true', label: 'Price High to Low'},
    {value: 'TITLE,false', label: 'Title A-Z'},
    {value: 'TITLE,true', label: 'Title Z-A'},
  ];

  // Handle changes in dropdowns
  const handleSortChange = (e: any) => {
    const [newSortKey, newReverse] = e.target.value.split(',');
    selectedSortKey.value = newSortKey;
    reverseSort.value = newReverse === 'true';
  };

  const handleTagChange = (newTag: string) => {
    selectedTag.value = newTag;
  };

  const handleVendorChange = (newVendor: string) => {
    selectedVendor.value = newVendor;
  };

  // Function to update tag and vendor counts
  const updateCounts = (products: Product[]) => {
    const newTagCounts = new Map(allTags.value);
    const newVendorCounts = new Map(allVendors.value);

    products.forEach((product) => {
      product.tags.forEach((tag) => {
        if (!newTagCounts.has(tag)) {
          newTagCounts.set(tag, new Set<string>());
        }
        newTagCounts.get(tag)?.add(product.id);
      });

      if (!newVendorCounts.has(product.vendor)) {
        newVendorCounts.set(product.vendor, new Set<string>());
      }
      newVendorCounts.get(product.vendor)?.add(product.id);
    });

    // Update the signals
    allTags.value = newTagCounts;
    allVendors.value = newVendorCounts;
  };

  // Initially call updateCounts with all products on load
  useEffect(() => {
    updateCounts(
      collection.products.edges.map((edge: {node: any}) => edge.node),
    );
  }, [collection.products.edges]);

  // Prepare dropdown options for tags and vendors with counts
  const tagOptions = Array.from(allTags.value.entries()).map(
    ([tag, productIds]) => (
      <option key={tag} value={tag}>
        {tag} ({productIds.size})
      </option>
    ),
  );
  const vendorOptions = Array.from(allVendors.value.entries()).map(
    ([vendor, productIds]) => (
      <option key={vendor} value={vendor}>
        {vendor} ({productIds.size})
      </option>
    ),
  );

  useEffect(() => {
    // If the handle has changed, clear the sets of tags and vendors
    allTags.value.clear();
    allVendors.value.clear();
    selectedSortKey.value = 'COLLECTION_DEFAULT';
    reverseSort.value = true;
    selectedTag.value = null;
    selectedVendor.value = null;
    // initialProducts.value = collection.products.edges;
    // cumulativeProductsLoaded.value = initialProducts;
    // currentPage.value = 0;
    // totalPages.value = Math.ceil(initialProducts.length / productsPerPage);
    // Dependency on collection.handle to trigger this effect
  }, [collection.handle]);

  return (
    <div className="collection mb-4">
      <div className="mt-2 mx-2">
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-medium pt-4 w-full bg-blue-950 text-slate-100 border-2 border-gray-900 rounded-t-2xl text-center pb-6 font-redhands">
          {collection.title}
        </h1>
        <div className="mb-4 flex w-full justify-center bg-slate-300 rounded-b-xl border-4 border-gray-900">
          <p className="text-left justify-center p-4 font-medium text-base md:text-lg max-w-[65ch] xl:max-w-[90ch] mx-4">
            {collection.description}
          </p>
        </div>
      </div>
      <h4 className="text-gray-400 xs:ml-4">
        ** Filters, sorting, and totals apply to loaded products
      </h4>
      <div className="bg-gray-100 shadow-md shadow-gray-400 max-w-[82rem] mx-auto rounded-md pb-4 border-2 border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-start mx-auto mb-2 bg-gray-400 border-b-2 border-b-blue-950 max-w-[82rem] rounded-md">
          {/* Reset Button */}
          <div className="my-2 sm:mb-0 sm:mt-0">
            <button
              onClick={() => {
                // Reset signals to their default values
                selectedSortKey.value = 'COLLECTION_DEFAULT';
                reverseSort.value = false;
                selectedTag.value = null;
                selectedVendor.value = null;
                // Optionally, update search params
                const newSearchParams = new URLSearchParams();
                setSearchParams(newSearchParams, {replace: true});
              }}
              className="bg-gray-700 hover:bg-red-700 text-white py-2 px-4 rounded text-nowrap sm:max-w-40 w-full"
            >
              Reset Options
            </button>
          </div>
          {/* <!-- Sort Dropdown --> */}
          <div className="flex-grow sm:flex-grow-0 mb-2 sm:mb-0 sm:max-w-40 w-full">
            <select
              value={`${selectedSortKey.value},${reverseSort.value}`}
              onChange={handleSortChange}
              className="form-select block w-full"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* <!-- Dropdown for tags --> */}
          <div className="flex-grow sm:flex-grow-0 mb-2 sm:mb-0 sm:max-w-40 w-full">
            <select
              value={selectedTag.value || ''}
              onChange={(e) => handleTagChange(e.target.value)}
              className="form-select block w-full"
            >
              <option value="">All Types</option>
              {tagOptions}
            </select>
          </div>

          {/* <!-- Dropdown for vendors --> */}
          <div className="flex-grow sm:flex-grow-0 mb-2 sm:mb-0 w-full sm:max-w-40">
            <select
              value={selectedVendor.value || ''}
              onChange={(e) => handleVendorChange(e.target.value)}
              className="form-select block w-full"
            >
              <option value="">All Vendors</option>
              {vendorOptions}
            </select>
          </div>
        </div>
        {/* Pagination and Product Grid */}
        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              {/* pagination controls */}

              <div className="w-full bg-gray-200 shadow-md shadow-gray-300 mt-4 mb-6 content-between justify-center flex font-Montserrat font-medium">
                <PreviousLink
                  // onClick={loadMoreProducts}
                  className="px-4 py-2 bg-amber-500 border-blue-950 rounded-md"
                >
                  {isLoading ? 'Loading...' : 'Load Previous Page'}
                </PreviousLink>
                <NextLink
                  // onClick={loadMoreProducts}
                  className="px-4 py-2 bg-amber-500 border-2 border-blue-950 rounded-md hover:scale-105 active:scale-95"
                >
                  {isLoading ? 'Loading...' : 'Load More Products'}
                </NextLink>
              </div>
              <ProductsGrid products={nodes as Product[]} />
              {/* For when Attempting manual pagination */}
              {/* <ProductsGrid
                products={displayedProducts.map(
                  (edge: {node: any}) => edge.node,
                )}
              /> */}
              {/* pagination controls */}
              <div className="pagination-controls w-full bg-gray-200 shadow-md shadow-gray-300 flex justify-center font-Montserrat font-medium">
                <PreviousLink
                  // onClick={loadMoreProducts}
                  className="px-4 py-2 bg-amber-500 border-blue-950 rounded-md"
                >
                  {isLoading ? 'Loading...' : 'Load Previous Page'}
                </PreviousLink>
                <NextLink
                  // onClick={loadMoreProducts}
                  className="px-4 py-2 bg-amber-500 border-2 border-blue-950 rounded-md hover:scale-105 active:scale-95"
                >
                  {isLoading ? 'Loading...' : 'Load More Products'}
                </NextLink>
              </div>
            </>
          )}
        </Pagination>
        {/* <ManualPagination
          currentPage={currentPage.value}
          totalPages={totalPages.value}
          onPageChange={setPage}
        /> */}
      </div>
    </div>
  );
}

// const ManualPagination = ({currentPage, totalPages, onPageChange}) => {
//   const currentPageSignal = useSignal(currentPage);

//   // Update page and propagate changes
//   const setPage = (page: number) => {
//     currentPageSignal.value = page;
//     onPageChange(page);
//   };

//   return (
//     <div className="flex justify-center space-x-2 my-4">
//       <button
//         disabled={currentPageSignal.value === 0}
//         onClick={() => setPage(currentPageSignal.value - 1)}
//       >
//         Previous
//       </button>
//       {Array.from({length: totalPages}, (_, i) => (
//         <button
//           key={i}
//           className={currentPage === i ? 'font-bold' : ''}
//           onClick={() => setPage(i)}
//         >
//           {i + 1}
//         </button>
//       ))}
//       <button
//         disabled={currentPageSignal.value === totalPages - 1}
//         onClick={() => setPage(currentPageSignal.value + 1)}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

function ProductsGrid({products}: ProductGridProps) {
  return (
    <div className="product-carousel-grid-container">
      {products.map((product: Product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <div className="product-card">
      {product.featuredImage && (
        <Link key={product.id} prefetch="intent" to={variantUrl}>
          <div className="product-image-container">
            <img
              alt={product.featuredImage.altText || product.title}
              // Assuming the aspectRatio can be handled via CSS if needed
              src={product.featuredImage.url}
              loading={loading}
              // The sizes attribute remains the same, ensuring responsive image loading
              className="max-w-full max-h-full object-contain rounded-xl"
            />
            {/* Tags Overlay */}
            <TagOverlay tags={product.tags} />
          </div>
        </Link>
      )}

      <div className="product-details">
        <Link
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="hover:no-underline"
        >
          {/* Product Title */}
          <h4 className="product-title">{product.title}</h4>
        </Link>
        {/* Product Price */}
        <Link
          to={`/products/${product.handle}`}
          className="hover:no-underline h-full"
        >
          <div className="product-price">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
        </Link>

        {/* Add to Cart Button */}
        <ProductForm
          // @ts-ignore
          product={product}
          // @ts-ignore
          selectedVariant={product.variants.nodes[0]}
          // @ts-ignore
          variants={product.variants.nodes}
          buttonClassName="add-to-cart-button" // pass tailwindcss to productForm for style the add to cart button via @apply in app.css
        />
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    availableForSale
    title
    tags
    vendor
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        product {
          title
          handle
          tags
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first, 
        last: $last, 
        before: $startCursor, 
        after: $endCursor 
        sortKey: $sortKey, 
        filters: $filters
        reverse: $reverse) {
          edges {
            node {
              ...ProductItem
            }
            cursor
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            endCursor
            startCursor
          }
        }
    }
  }
` as const;
