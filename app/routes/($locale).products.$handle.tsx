import {Suspense, useEffect} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  // Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/utils';
import {useSignal} from '@preact/signals-react';
import TagOverlay from '~/components/TagOverlay';
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa';

declare global {
  interface Window {
    _learnq: any[];
  }
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // @ts-ignore
  return [{title: `cooledtured | ${data?.product.title ?? ''}`}];
};

// Loader function to load and fetch data for the product
export async function loader({params, request, context}: LoaderFunctionArgs) {
  // Extracts the product handle from the route parameters.
  const {handle} = params;
  // Extracts the storefront object from the context, which is used to make queries to the Shopify Storefront API.
  const {storefront} = context;

  // Retrieves selected product options from the request and filters out unnecessary query parameters.
  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  // Checks if a product handle is defined in the route. If not, it throws an error.
  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // Performs a GraphQL query to fetch product data based on the product handle and selected options.
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  // Checks if the product was found. If not, it throws a 404 response, indicating the product does not exist.
  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // Retrieves the first variant of the product.
  const firstVariant = product.variants.nodes[0];
  // Checks if the first variant is the default variant
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  // If the first variant is default, it sets it as the selected variant. Otherwise, additional logic is applied to determine the selected variant.
  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  // Returning the fetched data
  return defer({product, variants});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

// This is the main React component for the product page. It uses the data fetched in the loader to render the product details.
export default function Product() {
  // product and variants are destructured from the loaded data. selectedVariant is then extracted from product.
  // @ts-ignore
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;

  // Klaviyo Product & View Tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window._learnq = window._learnq || [];

      const viewedProduct = {
        Name: product.title,
        ProductID: product.id.substring(product.id.lastIndexOf('/') + 1),
        Categories: product.collections
          ? product.collections.edges.map(
              (a: {node: {title: any}}) => a.node.title,
            )
          : null,
        ImageURL: selectedVariant?.image?.url || '',
        URL: window.location.href,
        Brand: product.vendor,
        Price: selectedVariant?.priceV2?.amount || '0', // Provide default value
        CompareAtPrice: selectedVariant?.compareAtPriceV2?.amount || '0', // Provide default value
      };

      window._learnq.push(['track', 'Viewed Product', viewedProduct]);

      const recentlyViewedItem = {
        Title: product.title,
        ItemId: product.id.substring(product.id.lastIndexOf('/') + 1),
        Categories: product.collections
          ? product.collections.edges.map(
              (a: {node: {title: any}}) => a.node.title,
            )
          : null,
        ImageUrl: selectedVariant?.image?.url || '',
        Url: window.location.href,
        Metadata: {
          Brand: product.vendor,
          Price: selectedVariant?.priceV2?.amount || '0', // Provide default value
          CompareAtPrice: selectedVariant?.compareAtPriceV2?.amount || '0', // Provide default value
        },
      };

      window._learnq.push(['trackViewedItem', recentlyViewedItem]);

      // console.log('Track Recently Viewed Item:', recentlyViewedItem);
      // console.log('Track Viewed Product:', viewedProduct);
    }
  }, [product, selectedVariant]);

  return (
    <div className=" mt-2 md:mt-4 md:mx-16 flex flex-col lg:gap-4">
      <ProductDisplay product={product} />
      <ProductMain
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
      />
    </div>
  );
}

// type definition for ProductDisplay()
type ProductImage = {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
};

type Product = {
  tags: string[];
  id: string;
  title: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
};

function ProductDisplay({product}: {product: Product}) {
  // Using useSignal to manage the state of the currently displayed image
  const currentImage = useSignal<ProductImage>(product.images.edges[0].node);

  // Function to change the main image with a fade effect
  const isChanging = useSignal(false);
  // Function to zoom into image onClick
  const isZoomedIn = useSignal(false);

  const changeImage = (newImage: ProductImage) => {
    isChanging.value = true; // Indicate that the image is changing
    setTimeout(() => {
      currentImage.value = newImage;
      isChanging.value = false; // Reset after changing the image
    }, 100); // Duration of fade effect
  };

  // Function to handle image zoom
  const toggleZoom = () => {
    isZoomedIn.value = !isZoomedIn.value;
  };

  const closeOverlay = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      toggleZoom();
    }
  };

  // Functions to navigate images
  const nextImage = () => {
    const currentIndex = product.images.edges.findIndex(
      (edge) => edge.node.id === currentImage.value.id,
    );
    const nextIndex = (currentIndex + 1) % product.images.edges.length;
    changeImage(product.images.edges[nextIndex].node);
  };

  const prevImage = () => {
    const currentIndex = product.images.edges.findIndex(
      (edge) => edge.node.id === currentImage.value.id,
    );
    const prevIndex =
      (currentIndex - 1 + product.images.edges.length) %
      product.images.edges.length;
    changeImage(product.images.edges[prevIndex].node);
  };

  return (
    <div className="max-w-[45rem] mx-auto w-full justify-center">
      <h1 className="flex p-4 bg-gray-300 border-2 border-gray-700 shadow-lg shadow-black text-3xl lg:text-4xl justify-center  text-gray-900 mb-4 rounded-lg">
        {product.title}
      </h1>
      {/* Main Image with Scale and Fade Transition Effect */}
      <div className="mb-4 overflow-hidden w-full relative shadow-lg shadow-gray-700 rounded-lg">
        {/* The image now sizes dynamically with the width of the container */}
        <img
          src={currentImage.value.url}
          alt={currentImage.value.altText || 'Product Image'}
          className={`w-full h-auto transition-all max-h-[30rem] object-contain mx-auto duration-100 ease-in-out ${
            isChanging.value ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          onClick={toggleZoom}
        />
        {/* Navigation buttons */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-4xl py-8 px-0.5 hover:scale-105 active:scale-95 shadow-md shadow-gray-700 hover:shadow-amber-500 transition-all duration-150 ease-in rounded-md bg-gray-200"
          onClick={prevImage}
        >
          <FaAngleLeft />
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-4xl py-8 px-0.5 hover:scale-105 active:scale-95 shadow-md shadow-gray-700 hover:shadow-amber-500 transition-all duration-150 ease-in rounded-md bg-gray-200"
          onClick={nextImage}
        >
          <FaAngleRight />
        </button>
      </div>
      <div className="relative mt-10 mb-4">
        <TagOverlay tags={product.tags} />
      </div>

      {/* Image Selector */}
      <div className="flex justify-center p-2 overflow-x-auto gap-2">
        {product.images.edges.map(({node}) => (
          <img
            key={node.id}
            src={node.url}
            alt={node.altText || 'Product Image Thumbnail'}
            onClick={() => changeImage(node)}
            className={`cursor-pointer border border-slate-300 ${
              currentImage.value.id === node.id
                ? 'ring-2 ring-blue-500 border-none'
                : ''
            } w-20 h-20 object-cover transition-all duration-100 ease-out`}
          />
        ))}
      </div>

      {/* Overlay for Zoomed Image */}
      {isZoomedIn.value && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center"
          onClick={closeOverlay}
        >
          <img
            src={currentImage.value.url}
            alt={currentImage.value.altText || 'Product Image'}
            className=" p-4 object-contain"
            onClick={(event) => event.stopPropagation()} // Prevents click from propagating to overlay
          />
          <button
            className="absolute top-2 right-2 text-white text-2xl"
            onClick={toggleZoom}
          >
            &times;
          </button>
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-4xl py-8 px-0.5 hover:scale-105 active:scale-95 shadow-md shadow-gray-700 hover:shadow-amber-500 transition-all duration-150 ease-in rounded-md bg-gray-200"
            onClick={prevImage}
          >
            <FaAngleLeft />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-4xl py-8 px-0.5 hover:scale-105 active:scale-95 shadow-md shadow-gray-700 hover:shadow-amber-500 transition-all duration-150 ease-in rounded-md bg-gray-200"
            onClick={nextImage}
          >
            <FaAngleRight />
          </button>
        </div>
      )}
    </div>
  );
}

// This component renders the main content of the product page, including the product title, price, and description.
function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {descriptionHtml} = product;
  return (
    <div className="flex flex-col mx-auto max-w-full lg:max-w-[90ch] p-4 lg:px-8 bg-gray-200 rounded-lg shadow-md shadow-gray-700 mb-8">
      {/* <h1 className="text-3xl lg:text-4xl text-gray-800 mb-3">{title}</h1> */}
      <div className="my-6 flex gap-4">
        <ProductPrice selectedVariant={selectedVariant} />
        {/* Add margin bottom for spacing */}

        <Suspense
          fallback={
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={[]}
            />
          }
        >
          <Await
            errorElement={<p>There was a problem loading product variants</p>}
            resolve={variants}
          >
            {(data) => (
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={data.product?.variants.nodes || []}
              />
            )}
          </Await>
        </Suspense>
      </div>
      {/* Description with improved typography and spacing */}
      <div className="prose prose-h2:font-normal prose-h3:font-normal max-w-full mt-4">
        <h2 className=" text-5xl">Description</h2>
        <div
          className="flex flex-col max-w-full"
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      </div>
    </div>
  );
}

//  If there's a compare-at price (indicating a sale), it shows the sale price alongside the original price marked with a strikethrough.
function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="text-lg font-bold mt-1">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>

          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

// Handles the product form, including variant selection and add-to-cart functionality.
export function ProductForm({
  product,
  selectedVariant,
  variants,
  buttonClassName, // Prop to accept classNames being passed to it from components.
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
  buttonClassName?: string; // Optional - can be null
}) {
  return (
    <div className="block">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <div className="font-bold">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            window.location.href = window.location.href + '#cart-aside';
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]
              : []
          }
          buttonClassName={buttonClassName} // Pass the className to AddToCartButton
        >
          {/* Conditional rendering based on the availability and tag */}
          {selectedVariant?.availableForSale
            ? product.tags.includes('Pre-Order')
              ? 'Pre-order'
              : 'Add to cart'
            : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

// Renders options for a product variant, such as different sizes or colors.
function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

// Renders a button to add items to the cart.
function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  buttonClassName, // classNameProp to assign conditional styles passed from components
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
  buttonClassName?: string; // defined as optional
}) {
  return (
    // Wrapped within a CartForm component, which handles the form submission for adding items to the cart.
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={
              buttonClassName
                ? buttonClassName
                : 'bg-blue-900 text-slate-200 px-2 py-1 rounded-xl border-2 border-slate-950 hover:text-amber-500 transition-all duration-100 ease-in-out hover:scale-105 active:animate-ping'
            } // optional buttonClassName - if null then apply default styles. Default = product page styling.
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

// Defines a GraphQL fragment for product variant data.
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
      tags
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

// Defines a GraphQL fragment for product data, including the selected variant and SEO details.
const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    tags
    descriptionHtml
    description
    options {
      name
      values
    }
    images(first: 20) { #Fetch all images associated with the product
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
#    metafield(namespace: "your_namespace", key: "trade_item_description") {
#      value
#      type
#    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

// Defines a GraphQL query to fetch product data, including variants and SEO information.
const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
