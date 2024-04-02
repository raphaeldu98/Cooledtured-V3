import {
  Link,
  Form,
  useParams,
  useFetcher,
  useFetchers,
  type FormProps,
  useSearchParams,
} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect, useMemo} from 'react';
import {Signal, useSignal} from '@preact/signals-react';
import {useNavigate} from '@remix-run/react';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';

// Importing types for Predictive Search
import type {
  PredictiveProductFragment,
  PredictiveCollectionFragment,
  PredictiveArticleFragment,
  SearchQuery,
} from 'storefrontapi.generated';
import {ProductForm} from '~/routes/($locale).products.$handle';
import TagOverlay from './TagOverlay';
import {typeList} from './SearchFilter';

// Define types for image and price to be used in Predictive Search
type PredicticeSearchResultItemImage =
  | PredictiveCollectionFragment['image']
  | PredictiveArticleFragment['image']
  | PredictiveProductFragment['variants']['nodes'][0]['image'];

type PredictiveSearchResultItemPrice =
  | PredictiveProductFragment['variants']['nodes'][0]['price'];

// Define a normalized type for Predictive Search Result Items
export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  image?: PredicticeSearchResultItemImage;
  price?: PredictiveSearchResultItemPrice;
  styledTitle?: string;
  title: string;
  url: string;
};

// Define a normalized type for an array of Predictive Search Result Items
export type NormalizedPredictiveSearchResults = Array<
  | {type: 'queries'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'products'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'collections'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'pages'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'articles'; items: Array<NormalizedPredictiveSearchResultItem>}
>;

// Define a normalized type for Predictive Search including the results and total count
export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
  totalProducts: number;
};

// Define return type for the fetch search results function
type FetchSearchResultsReturn = {
  searchResults: {
    results: SearchQuery | null;
    totalProducts: number;
  };
  searchTerm: string;
  sortOption: Signal<string>;
};

// Define a constant for no predictive search results
export const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  {type: 'queries', items: []},
  {type: 'products', items: []},
  {type: 'collections', items: []},
  {type: 'pages', items: []},
  {type: 'articles', items: []},
];

// Define the prop types for SearchForm
type SearchFormProps = {
  searchTerm: string;
  showSearchButton?: boolean;
  value1: number;
  value2: number;
  searchResults: SearchQuery | null; // Add this line
  sortOption: Signal<string>;
  typeFilters: Signal<string[]>;
  availabilityFilters: Signal<string>;
  vendorFilters: Signal<string[]>;
};

// Component to render the search form
export function SearchForm({
  searchTerm,
  showSearchButton,
  value1,
  value2,
  searchResults,
  sortOption,
  typeFilters,
  availabilityFilters,
  vendorFilters,
}: SearchFormProps) {
  // Use useRef for accessing the input DOM element
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Hook for navigation
  const navigate = useNavigate();

  // Effect hook to handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Focus the input on 'Cmd + K'
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // Blur the input on 'Escape'
      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Function to handle changes in filters
  const handleFilterChange = (
    filterName: string,
    value: string,
    isChecked: boolean,
    filters: string[],
  ) => {
    let updatedFilters: string[] = [];
    if (isChecked) {
      updatedFilters = [...filters, value];
    } else {
      updatedFilters = filters.filter((filter) => filter !== value);
    }
    // Dynamically determine which filter signal to update based on filterName
    // Update the appropriate filter state based on the filter type
    if (filterName === 'vendor') {
      vendorFilters.value = updatedFilters;
    } else if (filterName === 'type') {
      typeFilters.value = updatedFilters;
    }

    switch (filterName) {
      case 'vendor':
        vendorFilters.value = updatedFilters;
        break;
      case 'type':
        typeFilters.value = updatedFilters;
        break;
      default:
        break;
    }

    // Constructing query parameters for URL
    const queryParams = new URLSearchParams(window.location.search);

    // Update or delete the filter parameter based on its new state
    if (updatedFilters.length > 0) {
      queryParams.set(filterName, updatedFilters.join('|'));
    } else {
      queryParams.delete(filterName);
    }

    // Ensure the search term is always included
    if (!queryParams.has('q') && searchTerm) {
      queryParams.set('q', searchTerm);
    }

    // Navigate to the updated URL
    navigate(`/search?${queryParams.toString()}`, {replace: true});
  };

  // Handling the form submission
  const handleSubmit = () => {
    const queryParams = new URLSearchParams(window.location.search);
    // Set the search term in the query parameters
    if (searchTerm) {
      queryParams.set('q', searchTerm);
    }
    // Convert the query parameters to a string and navigate to the updated search URL
    const newSearchParams = queryParams.toString();
    navigate(`/search?${newSearchParams}`, {
      replace: true, // Replaces the current entry in the history stack
    });
  };

  // The render function for the SearchForm component
  return (
    <div className="flex flex-col items-start gap-2 sm:gap-8 mx-auto max-w-full">
      <div className="">
        <Form
          className="flex items-center max-w-full"
          action="/search"
          method="get"
        >
          <input
            id="search"
            defaultValue={searchTerm}
            name="q"
            placeholder="Type your search here..." // Adjust the placeholder text
            ref={inputRef}
            type="search"
            className=" p-[0.3rem] w-52 xs:w-full border-2 border-t-gray-300 border-l-gray-300 border-r-gray-500 border-b-gray-400 bg-transparent text-3xl font-bold text-gray-800 mr-2"
            onSubmit={handleSubmit}
          />
          {showSearchButton && (
            <button
              className="bg-gray-900 text-slate-50 py-2 px-4 cursor-pointer rounded-md"
              type="submit"
              onClick={handleSubmit}
            >
              Search
            </button>
          )}
        </Form>
      </div>

      <div className="flex flex-col gap-5 my-4 ml-5">
        <div>
          <div className=" text-xl font-bold underline">
            <p>PRODUCTS ({value1})</p>
          </div>
        </div>
        <div>
          <div className=" text-xl font-bold underline">
            <p>({value2}) Most Recent Articles</p>
          </div>
        </div>
      </div>

      {/* ************** Filters and Filter Aside ************ */}
      <div className=" -ml-6 xxs:-ml-5 xs: xs:mx-auto -mb-2 rounded-md min-w-[21rem] w-full xxs:w-[100vw] mxs:w-[98%] sm:max-w-[39rem] msm:w-[46.61rem] md:min-w-[98%] mmd:w-[53rem] lg:w-61rem lg:max-w-[61rem] mlg:w-[69rem] mlg:max-w-[71rem] xl:w-[77rem] xl:max-w-[90rem] mxl:w-[85rem] 2xl:w-[90.6rem] 2xl:max-w-[91rem] 2xl:min-w-[80rem] ">
        <SearchFilter
          searchResults={searchResults}
          handleFilterChange={handleFilterChange}
          searchTerm={searchTerm}
          sortOption={sortOption}
          typeFilters={typeFilters}
          availabilityFilters={availabilityFilters}
        />
      </div>
    </div>
  );
}

// Component for rendering search results
export function SearchResults({
  results,
  sortOption,
  typeFilters,
  availabilityFilters,
  vendorFilters,
}: Pick<FetchSearchResultsReturn['searchResults'], 'results'> & {
  sortOption: Signal<string>;
  typeFilters: Signal<string[]>;
  availabilityFilters: Signal<string>;
  vendorFilters: Signal<string[]>;
}) {
  // If there are no results, return null to render nothing
  if (!results) {
    return null;
  }

  // Get the keys of the results object (e.g., types of search results like 'pages', 'products')
  const keys = Object.keys(results) as Array<keyof typeof results>;

  // Map over each type of search result and render the appropriate component
  return (
    <div className="mb-8">
      {results &&
        keys.map((type) => {
          const resourceResults = results[type];

          // Check the type of each search result and render the appropriate component
          // if (resourceResults.nodes[0]?.__typename === 'Page') {
          //   const pageResults = resourceResults as SearchQuery['pages'];
          //   // Only render if there are nodes (results) available
          //   return resourceResults.nodes.length ? (
          //     <SearchResultPageGrid key="pages" pages={pageResults} />
          //   ) : null;
          // }

          if (resourceResults.nodes[0]?.__typename === 'Product') {
            const productResults = resourceResults as SearchQuery['products'];
            return resourceResults.nodes.length ? (
              <SearchResultsProductsGrid
                key="products"
                products={productResults}
                sortOption={sortOption}
                typeFilters={typeFilters}
                availabilityFilters={availabilityFilters}
                vendorFilters={vendorFilters}
              />
            ) : null;
          }

          if (resourceResults.nodes[0]?.__typename === 'Article') {
            const articleResults = resourceResults as SearchQuery['articles'];
            return resourceResults.nodes.length ? (
              <SearchResultArticleGrid
                key="articles"
                articles={articleResults}
              />
            ) : null;
          }

          // Return null if the type is not recognized
          return null;
        })}
    </div>
  );
}

function SearchResultsProductsGrid({
  products,
  sortOption,
  typeFilters,
  availabilityFilters,
  vendorFilters,
}: Pick<SearchQuery, 'products'> & {
  sortOption: Signal<string>;
  typeFilters: Signal<string[]>;
  availabilityFilters: Signal<string>;
  vendorFilters: Signal<string[]>;
}) {
  // Replace useSignal with useSearchParams to read the current page from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1; // URLs are 1-indexed for users
  const productsPerPage = useSignal(0); // Default value

  // Signal for sorted products
  // const sortedProducts = useSignal([...products.nodes]);

  const filteredAndSortedProducts = useSignal([...products.nodes]);

  // useEffect(() => {
  //   console.log('Sort option updated:', sortOption.value);
  // }, [sortOption.value]);

  // Sort products based on the sortOption
  useEffect(() => {
    let sorted = [...products.nodes];
    switch (sortOption.value) {
      case 'NAME_ASC':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'NAME_DESC':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'NEWEST_FIRST':
        // Correctly subtracting date timestamps
        sorted.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        );
        break;
      case 'OLDEST_FIRST':
        sorted.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime(),
        );
        break;
      case 'PRICE_LOW_TO_HIGH':
        // Correctly parsing string amounts to numbers before subtraction
        sorted.sort(
          (a, b) =>
            parseFloat(a.variants.nodes[0].price.amount) -
            parseFloat(b.variants.nodes[0].price.amount),
        );
        break;
      case 'PRICE_HIGH_TO_LOW':
        sorted.sort(
          (a, b) =>
            parseFloat(b.variants.nodes[0].price.amount) -
            parseFloat(a.variants.nodes[0].price.amount),
        );
        break;
      // Include other sorting cases as needed
      default:
        // Optionally, handle a default case
        break;
    }
    // Then, filter sorted products based on selected type filters
    let filtered;

    // Define an array of all tags associated with the filters except "Figures / Toys",
    // "Exclusive", and "Limited Edition"
    const baseExcludeTags = typeList
      .filter(
        (type) =>
          type.value !== '' &&
          type.label !== 'Figures / Toys' &&
          type.label !== 'EXCLUSIVES' &&
          type.label !== 'Limited Edition',
      )
      .map((type) => type.value);

    // Additional handling when "Figures / Toys" is selected
    const isFiguresToysSelected = typeFilters.value.includes('FIGURES_TOYS'); // Adjust 'FIGURES_TOYS' to the actual value you use for Figures / Toys

    if (typeFilters.value.includes('') || typeFilters.value.length === 0) {
      // If "All" is selected or no filter is selected, don't filter the products
      filtered = sorted;
    } else if (isFiguresToysSelected) {
      // When "Figures / Toys" is selected, adjust which tags to exclude
      // Here, we're keeping "Exclusive" and "Limited Edition" products in the mix
      filtered = sorted.filter(
        (product) =>
          !product.tags.some((tag) => baseExcludeTags.includes(tag)) ||
          product.tags.some((tag) => typeFilters.value.includes(tag)),
      );
    } else {
      // Filter products based on selected type filters, including handling for "Exclusive" and "Limited Edition"
      filtered = sorted.filter((product) =>
        product.tags.some((tag) => typeFilters.value.includes(tag)),
      );
    }

    // Apply availability filter based on the availabilityFilters signal
    if (availabilityFilters.value === 'In Stock') {
      filtered = filtered.filter(
        (product) => product.tags.includes('In Stock'), // Assuming 'In Stock' is the tag used for in-stock products
      );
    } else if (availabilityFilters.value === 'Pre-Order') {
      filtered = filtered.filter(
        (product) => product.tags.includes('Pre-Order'), // Assuming 'Pre-Order' is the tag used for pre-order products
      );
    }

    filteredAndSortedProducts.value = filtered;
  }, [
    products.nodes,
    sortOption.value,
    typeFilters.value,
    availabilityFilters.value,
  ]);

  const sortOptionRef = useRef(sortOption.value);
  const typeFiltersRef = useRef(typeFilters.value.join(','));
  const availabilityFiltersRef = useRef(availabilityFilters.value);
  const vendorFiltersRef = useRef(vendorFilters.value.join(','));

  // Function to reset page number
  const resetPage = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams, {replace: true});
  };

  // Effect to reset page when sortOption changes
  useEffect(() => {
    if (sortOption.value !== sortOptionRef.current) {
      resetPage();
    }
    sortOptionRef.current = sortOption.value;
  }, [sortOption.value, setSearchParams, searchParams]);

  // Effect to reset page when typeFilters change
  useEffect(() => {
    const currentTypeFilters = typeFilters.value.join(',');
    if (currentTypeFilters !== typeFiltersRef.current) {
      resetPage();
    }
    typeFiltersRef.current = currentTypeFilters;
  }, [typeFilters.value, setSearchParams, searchParams]);

  // Effect to reset page when availabilityFilters change
  useEffect(() => {
    if (availabilityFilters.value !== availabilityFiltersRef.current) {
      resetPage();
    }
    availabilityFiltersRef.current = availabilityFilters.value;
  }, [availabilityFilters.value, setSearchParams, searchParams]);

  // Effect to reset page when selectedVendor changes
  useEffect(() => {
    const currentVendorFilters = vendorFilters.value.join(',');
    if (currentVendorFilters !== vendorFiltersRef.current) {
      resetPage();
    }
    vendorFiltersRef.current = currentVendorFilters;
  }, [vendorFilters.value, setSearchParams, searchParams]);

  useEffect(() => {
    // Function to determine the number of products per page based on window width
    function updateProductLayout() {
      const width = window.innerWidth;
      if (width >= 1280) {
        // xl screens
        productsPerPage.value = 20;
      } else if (width >= 1024) {
        // large screens
        productsPerPage.value = 16;
      } else if (width >= 768) {
        // medium screens
        productsPerPage.value = 12;
      } else {
        // smaller than small screens
        productsPerPage.value = 8;
      }
    }

    // Set the initial value based on the current window size
    updateProductLayout();

    // Add event listener to update value on window resize
    window.addEventListener('resize', updateProductLayout);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', updateProductLayout);
  }, [productsPerPage]);

  // Calculate the total number of pages
  const totalPages = useMemo(
    () =>
      Math.ceil(filteredAndSortedProducts.value.length / productsPerPage.value),
    [filteredAndSortedProducts.value, productsPerPage.value],
  ); // React to changes in sortedProducts.value and productsPerPage.value
  // Function to handle "Next" and "Previous" button clicks

  useEffect(() => {
    // Ensure currentPage in the URL matches the page the user is actually on
    if (currentPage !== parseInt(searchParams.get('page') || '1', 10) - 1) {
      setSearchParams({page: (currentPage + 1).toString()});
    }
    // Scroll to the top of the page on currentPage change
    document.body.scrollTo({
      top: 0, // Scroll to top of page
      behavior: 'smooth', // Smooth scrolling *auto for instant scroll*
    });
  }, [currentPage, searchParams, setSearchParams]);

  // Determine the products to display on the current page
  const currentProducts = useMemo(() => {
    const start = currentPage * productsPerPage.value;
    const end = start + productsPerPage.value;
    return filteredAndSortedProducts.value.slice(start, end);
  }, [filteredAndSortedProducts.value, currentPage, productsPerPage.value]);

  const itemsMarkup = currentProducts.map((product) => (
    <div
      key={product.id}
      className="text-slate-50  mx-auto h-[18rem] xxs:h-[19rem] xs:h-[23rem] sm:h-[25rem] md:h-[28rem] lg:h-[27rem] shadow-md border-2 border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:scale-105 transition-all duration-150 ease-in-out"
    >
      <Link prefetch="intent" to={`/products/${product.handle}`} className="">
        <div className="relative h-36 xs:h-48 bg-white sm:h-52 md:h-60 w-full overflow-hidden flex items-center justify-center">
          {product.variants.nodes[0].image && (
            <img
              src={product.variants.nodes[0].image.url}
              alt={product.variants.nodes[0].image.altText || 'Product Image'}
              className="w-full h-full object-contain"
            />
          )}
          {/* @ts-ignore */}
          <TagOverlay tags={product.tags} />
        </div>
      </Link>
      <div className="product-details">
        <Link
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="hover:no-underline"
        >
          {/* Product Title */}
          <h4 className="hover:cursor-pointer hover:text-amber-500 max-w-full hover:scale-105 text-sm md:-mb-4 sm:text-base xl:text-lg font-semibold line-clamp-3">
            {product.title}
          </h4>
        </Link>
        {/* Product Price */}
        <Link
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="hover:no-underline h-full"
        >
          <div className="product-price">
            <Money data={product.variants.nodes[0].price} />
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
  ));

  return (
    // Product Results Container
    <div className="flex flex-col items-center rounded-xl outline bg-gray-500 bg-opacity-85 ring-8 ring-gray-500 mx-auto max-w-full">
      {/* <h2 className="font-bold text-4xl mx-2">Products</h2>
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigatePage(currentPage - 1)}
          disabled={currentPage === 0}
          className="cursor-pointer min-w-28 text-lg my-4 px-3 font-semibold py-1 bg-gray-800 rounded-xl text-blue-400 hover:bg-blue-950 hover:text-amber-500 hover:scale-105 active:scale-95 outline outline-2 transition-all duration-100 ease-in-out"
        >
          ← Previous
        </button>
        <button
          onClick={() => navigatePage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="cursor-pointer min-w-28 text-lg my-4 px-3 font-semibold py-1 bg-gray-800 rounded-xl text-blue-400 hover:bg-blue-950 hover:text-amber-500 hover:scale-105 active:scale-95 outline outline-2 transition-all duration-100 ease-in-out"
        >
          Next →
        </button>
      </div> */}
      {/* Product Cards Grid */}
      <div className="px-4 py-6 sm:px-6 grid grid-cols-2 mmd:grid-cols-3 mlg:grid-cols-4 mxl:grid-cols-5 justify-self-center bg-slate-900 rounded-xl bg-opacity-85 gap-x-1 xs:gap-x-3 sm:gap-x-6 gap-y-4 sm:gap-y-8 mt-4 mb-4 min-w-[21rem] w-[21rem] xxs:w-[80%] sm:max-w-[38rem] md:max-w-[47rem] mmd:max-w-[52rem] lg:w-60rem lg:max-w-[60rem] mlg:w-[68rem] mlg:max-w-[70rem] xl:w-[77rem] xl:max-w-[90rem] mxl:w-[85rem] 2xl:w-[100rem]  outline-gray-700">
        {itemsMarkup}
      </div>
      <div>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

// function SearchResultPageGrid({pages}: Pick<SearchQuery, 'pages'>) {
//   // Renders a grid of page search results.
//   return (
//     <div className="">
//       <h2>Pages</h2>
//       <div>
//         {pages?.nodes?.map((page) => (
//           <div className="" key={page.id}>
//             <Link prefetch="intent" to={`/pages/${page.handle}`}>
//               {page.title}
//             </Link>
//           </div>
//         ))}
//       </div>
//       <br />
//     </div>
//   );
// }

function SearchResultArticleGrid({articles}: Pick<SearchQuery, 'articles'>) {
  // Function to clean HTML content
  const cleanHtmlContentIframe = (htmlContent: string) => {
    // Regular expression to match and remove iframe tags
    let iframeRegex = /<iframe.*?<\/iframe>/gs;
    return htmlContent.replace(iframeRegex, '');
  };
  return (
    <div className=" p-2 mx-2 mb-4 mt-20 rounded-xl">
      <h2 className="font-bold text-4xl py-2 px-8 bg-slate-200 rounded-t-xl w-fit">
        Articles
      </h2>
      <div className="space-y-4">
        {articles?.nodes?.map((article) => {
          // Clean the article content HTML to remove iframes
          const cleanedContent = cleanHtmlContentIframe(article.contentHtml);

          return (
            <div
              key={article.id}
              className="border bg-slate-200 outline outline-2 outline-gray-700 p-4 rounded-lg flex flex-col md:flex-row gap-4"
            >
              {article.image && (
                <img
                  src={article.image.url}
                  alt={article.image.altText || 'Article Image'}
                  className="w-full md:w-1/3 max-h-52 object-cover rounded"
                />
              )}
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">{article.title}</h3>
                <p>{article.author?.name && `By ${article.author.name}`}</p>
                <div
                  className="mt-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: cleanedContent.substring(0, 200) + '...',
                  }}
                />
                <div className="flex place-items-end h-full">
                  <Link
                    prefetch="intent"
                    to={`/blogs/news/${article.handle}`}
                    className="text-blue-600 hover:underline mt-2"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function NoSearchResults() {
  // Renders a message when no search results are found.
  return (
    <p className="bg-gray-950 text-gray-100 text-xl font-medium p-4">
      No results, try a different search.
    </p>
  );
}

type ChildrenRenderProps = {
  // Defines the props passed to children in the PredictiveSearchForm.
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetcher: ReturnType<typeof useFetcher<NormalizedPredictiveSearchResults>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

type SearchFromProps = {
  // Defines the props for the PredictiveSearchForm component.
  action?: FormProps['action'];
  method?: FormProps['method'];
  className?: string;
  children: (passedProps: ChildrenRenderProps) => React.ReactNode;
  [key: string]: unknown;
};

/**
 *  Search form component that posts search requests to the `/search` route
 **/
export function PredictiveSearchForm({
  action,
  children,
  className = 'predictive-search-form',
  method = 'POST',
  ...props
}: SearchFromProps) {
  const params = useParams(); // Hook to access route parameters.
  const fetcher = useFetcher<NormalizedPredictiveSearchResults>(); // Fetcher to handle dynamic data retrieval.
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref to track the search input DOM element.

  // Function triggered on input change to fetch search results.
  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    const searchAction = action ?? '/api/predictive-search'; // Default action if none is provided.
    // Adding locale to the action URL if available.
    const localizedAction = params.locale
      ? `/${params.locale}${searchAction}`
      : searchAction;
    const newSearchTerm = event.target.value || ''; // Current value of the search input.
    // Submitting the search term to the fetcher with a limit of 6 results.
    fetcher.submit(
      {q: newSearchTerm, limit: '6'},
      {method, action: localizedAction},
    );
  }

  // Select the element based on the input
  // Setting the input type attribute to 'search' on component mount.
  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  // Render function for the form component.
  return (
    <fetcher.Form
      {...props}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        // Do nothing if the input is empty.
        if (!inputRef?.current || inputRef.current.value === '') {
          return;
        }
        inputRef.current.blur(); // Remove focus from the input after submission.
      }}
    >
      {children({fetchResults, inputRef, fetcher})}{' '}
      {/*Rendering children withprovided props.*/}
    </fetcher.Form>
  );
}

export function PredictiveSearchResults() {
  // Destructuring properties from the usePredictiveSearch hook.
  const {results, totalProducts, searchInputRef, searchTerm} =
    usePredictiveSearch();

  // Function to handle clicking on a search result.
  function goToSearchResult(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!searchInputRef.current) return;
    searchInputRef.current.blur(); // Remove focus from the search input.
    searchInputRef.current.value = ''; // Clear the search input.
    // close the aside
    // Navigate to the clicked search result's URL
    window.location.href = event.currentTarget.href;
  }

  // Render null if there are no total results.
  if (!totalProducts) {
    return <NoPredictiveSearchResults searchTerm={searchTerm} />;
  }

  // Render the search results.
  return (
    <div className="predictive-search-results">
      <div>
        {/* Mapping over each result type (e.g., products, articles) and rendering them. */}
        {results.map(({type, items}) => (
          <PredictiveSearchResult
            goToSearchResult={goToSearchResult}
            items={items}
            key={type}
            searchTerm={searchTerm}
            type={type}
          />
        ))}
      </div>
      {/* Link to view all search results for the given term. */}
      {searchTerm.current && (
        <Link onClick={goToSearchResult} to={`/search?q=${searchTerm.current}`}>
          <p>
            View all results for <q>{searchTerm.current}</q>
            &nbsp; →
          </p>
        </Link>
      )}
    </div>
  );
}

function NoPredictiveSearchResults({
  // Mutable ref object containing the current search term.
  searchTerm,
}: {
  searchTerm: React.MutableRefObject<string>;
}) {
  // Render null if there is no current search term.
  if (!searchTerm.current) {
    return null;
  }
  // Render a message indicating no results were found for the given search term.
  return (
    <p>
      No results found for <q>{searchTerm.current}</q>
    </p>
  );
}

type SearchResultTypeProps = {
  goToSearchResult: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  items: NormalizedPredictiveSearchResultItem[];
  searchTerm: UseSearchReturn['searchTerm'];
  type: NormalizedPredictiveSearchResults[number]['type'];
};

function PredictiveSearchResult({
  goToSearchResult,
  items,
  searchTerm,
  type,
}: SearchResultTypeProps) {
  // Determines if the search result type is 'queries' for showing suggestions
  const isSuggestions = type === 'queries';
  // Constructs a URL for the category based on the search term and type
  const categoryUrl = `/search?q=${
    searchTerm.current
  }&type=${pluralToSingularSearchType(type)}`;

  return (
    <div className="predictive-search-result" key={type}>
      {/* Link to the category page */}
      <Link prefetch="intent" to={categoryUrl} onClick={goToSearchResult}>
        {/* Displays 'Suggestions' for query type, otherwise the type itself */}
        <h5>{isSuggestions ? 'Suggestions' : type}</h5>
      </Link>
      <ul>
        {/* List of items */}
        {items.map((item: NormalizedPredictiveSearchResultItem) => (
          <SearchResultItem
            goToSearchResult={goToSearchResult}
            item={item}
            key={item.id}
          />
        ))}
      </ul>
    </div>
  );
}

type SearchResultItemProps = Pick<SearchResultTypeProps, 'goToSearchResult'> & {
  item: NormalizedPredictiveSearchResultItem;
};

function SearchResultItem({goToSearchResult, item}: SearchResultItemProps) {
  // Renders individual search result items
  return (
    <li className="" key={item.id}>
      {/* Link to the item's URL */}
      <Link onClick={goToSearchResult} to={item.url}>
        {/* If the item has an image, it's displayed */}
        {item.image?.url && (
          <Image alt={item.image.altText ?? ''} src={item.image.url} />
        )}
        <div>
          {/* If the item has a styledTitle, it's displayed using dangerouslySetInnerHTML */}
          {item.styledTitle ? (
            <div
              dangerouslySetInnerHTML={{
                __html: item.styledTitle,
              }}
            />
          ) : (
            // Otherwise, the item's title is displayed
            <span>{item.title}</span>
          )}
          {/* If the item has a price, it's displayed using the Money component */}
          {item?.price && (
            <small>
              <Money data={item.price} />
            </small>
          )}
        </div>
      </Link>
    </li>
  );
}

type UseSearchReturn = NormalizedPredictiveSearch & {
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: React.MutableRefObject<string>;
};

function usePredictiveSearch(): UseSearchReturn {
  const fetchers = useFetchers(); // Retrieves an array of fetcher objects managed by the application.
  const searchTerm = useRef<string>(''); // A ref to store the current search term.
  const searchInputRef = useRef<HTMLInputElement | null>(null); // A ref to the search input
  // Finding the specific fetcher that handles search results.
  const searchFetcher = fetchers.find((fetcher) => fetcher.data?.searchResults);

  // If the search fetcher is in a loading state, update the searchTerm ref.
  if (searchFetcher?.state === 'loading') {
    searchTerm.current = (searchFetcher.formData?.get('q') || '') as string;
  }

  // Defining the search data structure, with a fallback to defaults if no data is found.
  const search = (searchFetcher?.data?.searchResults || {
    results: NO_PREDICTIVE_SEARCH_RESULTS,
    totalProducts: 0,
  }) as NormalizedPredictiveSearch;

  // useEffect hook to capture the search input element as a ref.
  useEffect(() => {
    if (searchInputRef.current) return; // Exit if the ref is already set.
    // Setting the search input ref to the first search input element found in the document.
    searchInputRef.current = document.querySelector('input[type="search"]');
  }, []);

  // Returning the search data along with the refs.
  return {...search, searchInputRef, searchTerm};
}

/**
 * Converts a plural search type to a singular search type
 *
 * @example
 * ```js
 * pluralToSingularSearchType('articles'); // => 'ARTICLE'
 * pluralToSingularSearchType(['articles', 'products']); // => 'ARTICLE,PRODUCT'
 * ```
 */
function pluralToSingularSearchType(
  type:
    | NormalizedPredictiveSearchResults[number]['type']
    | Array<NormalizedPredictiveSearchResults[number]['type']>,
) {
  const plural = {
    articles: 'ARTICLE',
    collections: 'COLLECTION',
    pages: 'PAGE',
    products: 'PRODUCT',
    queries: 'QUERY',
  };

  // Convert a singular type or an array of types to their singular counterparts.
  if (typeof type === 'string') {
    return plural[type]; // For a single type string, return its singular form.
  }

  return type.map((t) => plural[t]).join(','); // For an array of types, map each to its singular form and join with commas.
}
