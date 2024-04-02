import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {lazy, Suspense, useEffect} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import Carousel from '~/components/Carousel';
import BestSellersCarousel from '~/components/BestSellersCarousel';
import {CurrencyCode} from '@shopify/hydrogen-react/storefront-api-types';
import {useSignal} from '@preact/signals-react';
import {ProductForm} from './($locale).products.$handle';
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa';

const HomepageIcons = lazy(() => import('../components/iconsHomepage'));
const TagOverlay = lazy(() => import('../components/TagOverlay'));
const DiscordBanner = lazy(() => import('../components/DiscordBanner'));
const FeaturedCards = lazy(() => import('../components/FeaturedCards'));
const FeaturedCards2 = lazy(() => import('../components/FeaturedCards2'));
const PreOrderDisplay = lazy(() => import('../components/PreOrderDisplay'));

export const meta: MetaFunction = () => {
  return [{title: 'cooledtured | Home'}];
};

// Loader function to fetch data for the page
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const apiToken = context.env.PUBLIC_STOREFRONT_API_TOKEN;
  // Fetching pre-order collection data
  const newestPreOrderProducts = await storefront.query(
    FETCH_PREORDERS_PRODUCTS_QUERY,
    {
      variables: {handle: 'pre-orders', first: 50},
    },
  );

  // Fetching recommended products data
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  // Fetching best-selling products data
  const bestSellingProducts = await storefront.query(
    FETCH_BESTSELLING_PRODUCTS_QUERY,
    {
      variables: {handle: 'fandom-demon-slayer', first: 150},
    },
  );

  // Returning the fetched data
  return defer({
    apiToken,
    newestPreOrderProducts,
    recommendedProducts,
    bestSellingProducts,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  // @ts-ignore
  const {apiToken} = data;

  //// ********** BestSellerCarousel signals ******** ////
  // Initialize state variable for brandHandle
  const brandHandle = useSignal<string | null>(null); // signal for bestSellerCarousel brand Handle
  const isLoading = useSignal(false); // Signal to manage loading state - bestSellersCarousel
  const prefetchedData = useSignal(null); // Signal for storing prefetched data

  // Initialize state variable for best selling products
  const bestSellingProducts = useSignal(null);

  ///////////// *********** PreOrderDisplay Signals
  const poBrandHandle = useSignal<string | null>(null); // Signal for pre-order brand handle
  const poIsLoading = useSignal(false); // Signal to manage loading state
  const poPrefetchedData = useSignal(null); // Signal for storing prefetched data
  const newestPreOrderProducts = useSignal(null); //// Initialize state variable for newest preorder products

  // ************ Prefetch & useEffect for BestSellers ************
  // Function for prefetching bestSeller products based on brand handle
  const prefetchBestSellerBrandProducts = async (brandHandle: string) => {
    // console.log(`Prefetching products for brand: ${brandHandle}`);
    const query = FETCH_BESTSELLING_PRODUCTS_QUERY;
    const variables = {handle: brandHandle, first: 150};

    try {
      const response = await fetch(
        'https://cooledtured.myshopify.com/api/2024-01/graphql.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': apiToken,
          },
          body: JSON.stringify({query, variables}),
        },
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const {data}: any = await response.json();
      prefetchedData.value = data.collection; // Update signal with prefetched data
    } catch (error) {
      console.error('Error prefetching products:', error);
    }
  };

  // Effect to run FETCH_BESTSELLING_PRODUCTS_QUERY to send updated info to bestSellersCarousel based on brandHandle signal update in child component.
  useEffect(() => {
    const fetchUpdatedProducts = async () => {
      if (!brandHandle.value) return; // Guard clause in case brandHandle is null

      isLoading.value = true; // Start loading before fetching

      const query = FETCH_BESTSELLING_PRODUCTS_QUERY;
      const variables = {handle: brandHandle.value, first: 150};

      try {
        const response = await fetch(
          'https://cooledtured.myshopify.com/api/2024-01/graphql.json',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': apiToken,
            },
            body: JSON.stringify({query, variables}),
          },
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const {data}: any = await response.json();
        bestSellingProducts.value = data.collection; // Directly update the signal
        isLoading.value = false; // End loading
      } catch (error) {
        console.error('Error fetching updated best-selling products:', error);
        isLoading.value = false; // Ensure loading state is reset on error
      }
    };

    fetchUpdatedProducts();
  }, [brandHandle.value]); // Dependency array includes brandHandle to re-run the effect when it changes

  // *****************Prefetch & UseEffect for Pre-orders *******************
  // Function for prefetching preOrder products based on preOrder brand handle
  const prefetchPreOrderBrandProducts = async (poBrandHandle: string) => {
    // console.log(`Prefetching products for brand: ${brandHandle}`);
    const query = FETCH_PREORDERS_PRODUCTS_QUERY;
    const variables = {handle: poBrandHandle, first: 100};

    try {
      const response = await fetch(
        'https://cooledtured.myshopify.com/api/2024-01/graphql.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': apiToken,
          },
          body: JSON.stringify({query, variables}),
        },
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const {data}: any = await response.json();
      poPrefetchedData.value = data.collection; // Update signal with prefetched data
    } catch (error) {
      console.error('Error prefetching products:', error);
    }
  };

  useEffect(() => {
    const fetchUpdatedPoProducts = async () => {
      if (!poBrandHandle.value) return; // Guard clause in case brandHandle is null

      poIsLoading.value = true; // Start loading before fetching

      const query = FETCH_PREORDERS_PRODUCTS_QUERY;
      const variables = {handle: poBrandHandle.value, first: 100};

      try {
        const response = await fetch(
          'https://cooledtured.myshopify.com/api/2024-01/graphql.json',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': apiToken,
            },
            body: JSON.stringify({query, variables}),
          },
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const {data}: any = await response.json();
        newestPreOrderProducts.value = data.collection; // Directly update the signal
        poIsLoading.value = false; // End loading
      } catch (error) {
        console.error('Error fetching updated best-selling products:', error);
        isLoading.value = false; // Ensure loading state is reset on error
      }
    };

    fetchUpdatedPoProducts();
  }, [poBrandHandle.value]); // Dependency array includes brandHandle to re-run the effect when it changes

  // Log the state to the console
  // console.log('handle state - parent:', brandHandle.value);

  return (
    <div className="flex flex-col gap-4">
      <Carousel />
      <BestSellersCarousel
        isLoading={isLoading}
        bestSellingProducts={
          // @ts-ignore
          bestSellingProducts.value || data.bestSellingProducts.collection
        }
        brandHandle={brandHandle} // Pass brandHandle signal itself
        prefetchBestSellerBrandProducts={prefetchBestSellerBrandProducts}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <DiscordBanner />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <PreOrderDisplay
          poIsLoading={poIsLoading}
          newestPreOrderProducts={
            newestPreOrderProducts.value ||
            // @ts-ignore
            data.newestPreOrderProducts.collection
          }
          poBrandHandle={poBrandHandle}
          prefetchPreOrderBrandProducts={prefetchPreOrderBrandProducts}
        />
      </Suspense>
      <div className="grid justify-items-center mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <FeaturedCards />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <FeaturedCards2 />
        </Suspense>
      </div>
      <div className="flex mx-auto max-w-full w-fit sm:p-4 bg-transparent">
        <Link
          to={`/pages/collaboration`}
          prefetch="intent"
          className="w-max h-max"
        >
          <img
            className=" object-cover"
            src="/images/HomePage/OpenToCollab.svg"
            alt="Join our Discord!"
          />
        </Link>
      </div>
      {/* @ts-ignore */}
      <RecommendedProducts products={data.recommendedProducts} />
      <Suspense fallback={<div>Loading...</div>}>
        <HomepageIcons />
      </Suspense>
    </div>
  );
}

//******************************* BestSellers *******************************

// GraphQL query for fetching bestselling products
const FETCH_BESTSELLING_PRODUCTS_QUERY = `#graphql
# This GraphQL query fetches data for products in a specific collection.
query FetchCollectionByHandleBS($handle: String!, $first: Int!) {
  # Retrieve the collection by its handle
  collection(handle: $handle) {
    # Fetch the first 'n' products in the collection
    products(first: $first, sortKey:BEST_SELLING reverse:true) {
      edges {
        node {
          id # The unique identifier of the product
          title # The title of the product
          handle # The handle (URL-friendly identifier) of the product
          tags # The tags for the product

          # Retrieve the first image associated with the product
          images(first: 1) {
            edges {
              node {
                transformedSrc:url # The URL of the product's image
                altText # Alternative text for the image
              }
            }
          }

          # Fetch the price range information for the product
          priceRange {
            minVariantPrice {
              amount # The price amount
              currencyCode # The currency code (e.g., USD)
            }
          }
          # Fetch the first few variants for each product
          variants(first: 250) { # per Product - fetches Up to 250
            nodes {
              id
              title
              availableForSale
              priceV2 {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
                width
                height
              }
              sku
              compareAtPriceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;

// ************************** Pre-Orders *********************************

const FETCH_PREORDERS_PRODUCTS_QUERY = `#graphql
  # This GraphQL query fetches data for products in a specific collection.
  query FetchCollectionByHandle($handle: String!, $first: Int!) {
    # Retrieve the collection by its handle
    collection(handle: $handle) {
      # Fetch the first 'n' products in the collection
      products(first: $first, sortKey:CREATED reverse:true) {
        edges {
          node {
            id # The unique identifier of the product
            title # The title of the product
            handle # The handle (URL-friendly identifier) of the product
            tags # The tags for the product

            # Retrieve the first image associated with the product
            images(first: 1) {
              edges {
                node {
                  transformedSrc:url # The URL of the product's image
                  altText # Alternative text for the image
                }
              }
            }

            # Fetch the price range information for the product
            priceRange {
              minVariantPrice {
                amount # The price amount
                currencyCode # The currency code (e.g., USD)
              }
            }
            # Fetch the first few variants for each product
            variants(first: 250) { # per Product - fetches Up to 250
              nodes {
                id
                title
                availableForSale
                priceV2 {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                  width
                  height
                }
                sku
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
  `;
type MoneyV2 = {
  amount: string;
  currencyCode: CurrencyCode;
};

type Image = {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
};

type Product = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  images: {
    nodes: Array<Image>;
  };
};

type RecommendedProductsQuery = {
  products: {
    nodes: Array<Product>;
  };
};

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  const fetchedProducts = useSignal<Product[]>([]);
  const displayIndex = useSignal(0);
  const displayedProductsCount = useSignal(0); // Number of products to display at a time - updated on mount per the useEffect updateDisplayedProductsCount
  const transitioning = useSignal(false); // New signal to handle transition

  const handleTransition = async (updateIndex: () => void) => {
    transitioning.value = true; // Start transition (fade out)
    await new Promise((r) => setTimeout(r, 100)); // Wait for fade-out animation
    updateIndex();
    await new Promise((r) => setTimeout(r, 10)); // Short delay before starting fade-in
    transitioning.value = false; // End transition (fade in)
  };

  useEffect(() => {
    products.then((data) => {
      // Assuming 'data.products.nodes' contains the array of products
      fetchedProducts.value = data.products.nodes;
    });
  }, [products]);

  useEffect(() => {
    const updateDisplayedProductsCount = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        displayedProductsCount.value = 12; // lg+
      } else if (width >= 1024) {
        displayedProductsCount.value = 8; // md & sm
      } else if (width >= 640) {
        displayedProductsCount.value = 6; // md & sm
      } else {
        displayedProductsCount.value = 4; // mxs-
      }
    };

    // Update the count immediately once the component mounts
    updateDisplayedProductsCount();

    // Updated the count on resize
    window.addEventListener('resize', updateDisplayedProductsCount);
    updateDisplayedProductsCount(); // Initial check

    return () =>
      window.removeEventListener('resize', updateDisplayedProductsCount);
  }, []);

  // Calculate the subset of products to display based on the current index
  const displayedProducts = () =>
    fetchedProducts.value.slice(
      displayIndex.value,
      displayIndex.value + displayedProductsCount.value,
    );

  const handleNext = () => {
    handleTransition(() => {
      const nextIndex = displayIndex.value + displayedProductsCount.value;
      displayIndex.value =
        nextIndex >= fetchedProducts.value.length ? 0 : nextIndex;
    });
  };

  const handlePrev = () => {
    handleTransition(() => {
      const prevIndex = displayIndex.value - displayedProductsCount.value;
      displayIndex.value =
        prevIndex < 0
          ? fetchedProducts.value.length - displayedProductsCount.value
          : prevIndex;
    });
  };

  return (
    <div className="max-w-[46rem] md:max-w-[54rem] lg:max-w-[71rem] xl:max-w-[86rem] 2xl:max-w-[100rem] min-w-[20rem] sm:min-w-[35rem] mx-auto p-2">
      <div className="bg-slate-50 p-2 bg-opacity-90 rounded-3xl mx-auto md:max-w-[50rem] lg:max-w-[62rem] xl:max-w-[65rem] 2xl:max-w-[90rem] ">
        <h2 className="w-fit mx-auto text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold pb-1 sm:pb-2 border-b-2 border-black mb-4 text-center">
          Recommended Products
        </h2>
        <div className="flex flex-row items-center w-full mx-auto">
          <FaAngleLeft
            className=" -translate-y-2 -ml-2 xxs:mx-auto lg:w-10 lg:h-96 h-72 w-8 text-amber-500 bg-gray-900 border-2 border-slate-500 hover:scale-105 transition-all duration-150 ease-in-out rounded-xl px-2 text-xl active:animate-ping active:scale-50"
            onClick={handlePrev}
          />
          <div
            className={`relative grid gap-3 mxs:gap-1 md:gap-2 mb-4 grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 2xl:grid-cols-6 mx-auto ${
              transitioning.value ? 'opacity-15' : 'opacity-100'
            } transition-opacity duration-100`}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Await resolve={products}>
                {displayedProducts().map((product) => (
                  <div
                    key={product.id}
                    className="text-slate-50 mx-auto max-w-36 w-28 h-[18rem] xxs:w-32 xs:min-w-[10rem] mxs:max-w-52 mxs:min-w-48 mxs:w-52 sm:max-w-44 sm:w-[10.5rem] sm:min-w-36 sm:h-[21rem] msm:w-[13.2rem] md:max-w-68 md:min-w-52 md:w-60 md:h-[24rem] lg:min-w-52 lg:max-w-64 lg:w-52 lg:h-[25rem] shadow-md border-2 border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:scale-105 transition-all duration-150 ease-in-out"
                  >
                    <Link to={`/products/${product.handle}`}>
                      {/* Image Container */}
                      <div className="product-image-container">
                        {product.images.nodes.length > 0 && (
                          <img
                            src={product.images.nodes[0].url}
                            alt={
                              product.images.nodes[0].altText || 'Product Image'
                            }
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                        <TagOverlay tags={product.tags} />
                      </div>
                    </Link>

                    <div className="product-details">
                      <Link
                        to={`/products/${product.handle}`}
                        prefetch="intent"
                        className="hover:no-underline h-full"
                      >
                        <h4 className="product-title">{product.title}</h4>
                      </Link>
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
                ))}
              </Await>
            </Suspense>
          </div>
          <FaAngleRight
            className="-translate-y-2 -mr-2 xxs:mx-auto lg:w-10 lg:h-96 h-72 w-8 text-amber-500 bg-gray-900 border-2 border-slate-500 hover:scale-105 transition-all duration-150 ease-in-out rounded-xl px-2 text-xl active:animate-ping active:scale-50"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 10) {
      nodes {
        id
        availableForSale
        priceV2 {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
          width
          height
        }
        sku
        compareAtPriceV2 {
          amount
          currencyCode
        }
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 24, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
