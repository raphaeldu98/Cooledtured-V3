import {useRef, useEffect} from 'react';
import {Link} from '@remix-run/react';
import TagOverlay from './TagOverlay';
import brandData from '../data/fandomData.json'; // Import brand data from JSON
import {Signal, useSignal} from '@preact/signals-react';
import {ProductForm} from '~/routes/($locale).products.$handle'; // Add to Cart button and functionality
import {Money} from '@shopify/hydrogen';

// Define TypeScript types for product-related data
type ProductImage = {
  transformedSrc: string;
  altText?: string;
};

type ProductPrice = {
  amount: string;
  currencyCode: undefined;
};

type VariantNode = {
  id: string;
  availableForSale: boolean;
  priceV2: {
    amount: string;
    currencyCode: undefined;
  };
};

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  images: {
    edges: Array<{node: ProductImage}>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    nodes: Array<VariantNode>;
  };
};

// Define a type for bestSellingProducts data that includes products
type BestSellingProducts = {
  products: {
    edges: Array<{node: ProductNode}>;
  };
};

type BestSellersCarouselProps = {
  isLoading: Signal<boolean>;
  bestSellingProducts: BestSellingProducts;
  brandHandle: Signal<string | null>; // Defined as a signal
  prefetchBestSellerBrandProducts: (brandHandle: string) => void; // Corrected to a function type
};

// Create a React functional component named 'BestSellersCarousel' that takes 'bestSellingProducts' as a prop
const BestSellersCarousel: React.FC<BestSellersCarouselProps> = ({
  isLoading, // This is a signal
  bestSellingProducts,
  brandHandle,
  prefetchBestSellerBrandProducts,
}) => {
  if (!bestSellingProducts) return null;

  // Transition effect based on isLoading signal
  const transitionClass = isLoading.valueOf() ? 'opacity-10' : 'opacity-100';
  const displayedProductsCount = useSignal(0); // Default to 0 to be written to by useEffect immediately after mount - count of products to be displayed

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useSignal(false); // Signal for dragging status
  const startX = useSignal<number | null>(null); // Signal for start position of drag
  const scrollDistance = useSignal(200); // Signal for scroll distance

  // Adjust scroll distance for small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        scrollDistance.value = 341;
      } else if (window.innerWidth > 1279) {
        scrollDistance.value = 490;
      } else if (window.innerWidth < 1024) {
        scrollDistance.value = 500;
      } else {
        scrollDistance.value = 577;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Log the brand handle on change
  // useEffect(() => {
  //   console.log('handle state - child:', brandHandle.value);
  // }, [brandHandle.value]);

  // Handler to update the selected brand ID
  const handleBrandClick = (newBrandHandle: string) => {
    brandHandle.value = newBrandHandle; // Directly update the signal's value
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.value = true;
    startX.value = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.value || !containerRef.current || startX.value === null)
      return;
    const x = e.clientX;
    const distance = x - startX.value;
    containerRef.current.scrollLeft -= distance;
    startX.value = x;
  };

  const handleMouseUp = () => {
    isDragging.value = false;
  };

  const scrollRight = () => {
    if (!containerRef.current) return;

    // Calculate the maximum scrollable right position
    const maxScrollRight =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;

    // Calculate the next scroll position to the right
    let newScrollRight = containerRef.current.scrollLeft + scrollDistance.value;

    // Adjust the scroll position if it exceeds the maximum scrollable width
    if (newScrollRight > maxScrollRight) {
      // If exactly at or very close to the max, reset to start (0), considering a small tolerance for rounding issues
      if (containerRef.current.scrollLeft >= maxScrollRight - 5) {
        newScrollRight = 0;
      } else {
        // Otherwise, stop at the max
        newScrollRight = maxScrollRight;
      }
    }

    // Execute the scrolling
    containerRef.current.scrollTo({
      left: newScrollRight,
      behavior: 'smooth',
    });
  };

  const scrollLeftHandler = () => {
    if (!containerRef.current) return;
    const maxScrollRight =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;
    let newScrollLeft = containerRef.current.scrollLeft - scrollDistance.value;
    if (newScrollLeft < 0 && containerRef.current.scrollLeft !== 0) {
      newScrollLeft = 0;
    } else if (containerRef.current.scrollLeft === 0) {
      newScrollLeft = maxScrollRight;
    }
    containerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const updateDisplayedProductsCount = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        displayedProductsCount.value = 10; // xl
      } else if (width >= 1024) {
        displayedProductsCount.value = 8; // lg
      } else if (width >= 560) {
        displayedProductsCount.value = 6; // md & sm
      } else {
        displayedProductsCount.value = 4; // xs
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

  // Separate available and unavailable products
  const availableProducts = bestSellingProducts.products.edges.filter(
    ({node: product}) =>
      product.variants.nodes.some((variant) => variant.availableForSale),
  );

  const unavailableProducts = bestSellingProducts.products.edges.filter(
    ({node: product}) =>
      !product.variants.nodes.some((variant) => variant.availableForSale),
  );

  // Adjust the list based on the current displayedProductsCount and ensure a mix of available and unavailable if needed
  let displayProducts = availableProducts.slice(
    0,
    displayedProductsCount.value,
  );
  if (displayProducts.length < displayedProductsCount.value) {
    displayProducts = [
      ...displayProducts,
      ...unavailableProducts.slice(
        0,
        displayedProductsCount.value - displayProducts.length,
      ),
    ];
  }

  return (
    <div className="max-w-[45rem] md:max-w-[53rem] lg:max-w-[70rem] xl:max-w-[85rem] min-w-[20rem] sm:min-w-[35rem] mx-auto my-2 p-2 sm:p-4 bg-slate-50 bg-opacity-90 rounded-3xl min-h-60">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold pb-1 sm:pb-4 text-center">
        Best Sellers!
      </h2>
      {/* Scroll Container w/ buttons */}
      <div className="flex flex-grow-0 min-w-[19rem] justify-center sm:min-w-auto items-center mb-3 sm:mb-4">
        {/* Left Arrow SVG */}
        <button
          className="px-0.5 sm:px-1 py-8 lg:px-1.5 lg:py-10 xl:py-12 sm:ml-auto bg-gray-800 text-slate-50 rounded-xl sm:mr-1 md:mr-2 relative z-2 hover:text-amber-500 hover:scale-105 transition-all duration-150 ease-in-out active:scale-95"
          onClick={scrollLeftHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 sm:h-6 w-4 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {/* Brand images Container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto whitespace-no-wrap min-w-60 max-w-[27.2rem] sm:max-w-auto sm:w-[29.12rem] sm:min-w-[29.12rem] md:w-[39.7rem] md:min-w-[39.7rem] lg:min-w-[46rem] lg:max-w-[46rem] lg:w-[46rem] xl:w-[62rem] xl:min-w-[62rem] relative border-4 sm:px-1 pb-1 pt-2 lg:px-2 lg:pb-2 lg:pt-3 border-slate-300 justify-between bg-blue-950 rounded-3xl transition-all duration-300 ease-in-out"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            scrollbarWidth: 'none', // Hide default scrollbar
            msOverflowStyle: 'none', // Hide default scrollbar (IE)
          }}
        >
          {/* Brand images */}
          {brandData.brands
            .filter((brand) => brand.handle !== 'pre-orders') // to not include pre-orders among image carousel.
            .map((brand) => (
              <img
                key={brand.id}
                src={brand.logo}
                alt={brand.name}
                onMouseEnter={() => {
                  // console.log(`Hovering over brand: ${brand.handle}`);
                  prefetchBestSellerBrandProducts(brand.handle);
                }}
                className={` h-[4.58rem] sm:h-24 lg:h-28 xl:h-32 gap-1 md:gap-4 sm:mr-1 md:mr-4 cursor-pointer hover:scale-105 transition-all duration-300 drop-shadow-lg ease-in-out ${
                  brandHandle.value === brand.handle
                    ? 'scale-95 hover:scale-100 filter invert contrast-80 hue-rotate-180'
                    : ''
                }`} // Increase the size of each image and add margin-right, disable text selection
                style={{
                  scrollSnapAlign: 'start',
                }} // Ensure each image starts at the beginning of the container
                onClick={() => handleBrandClick(brand.handle.toString())}
              />
            ))}
        </div>

        {/* Right Arrow SVG */}
        <button
          className="px-0.5 sm:px-1 py-8 lg:px-1.5 lg:py-10 xl:py-12 sm:mr-auto bg-gray-800 text-slate-50 rounded-xl sm:ml-1 md:ml-2 relative z-2 hover:text-amber-500 hover:scale-105 transition-all duration-150 ease-in-out active:scale-95"
          onClick={scrollRight}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 sm:h-6 w-4 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Product Card Grid - Container */}
      <div className="product-carousel-grid-container">
        {/* Product Cards */}
        {displayProducts.map(({node: product}) => (
          <div key={product.id} className={`product-card ${transitionClass}`}>
            {product.images.edges.length > 0 && (
              <Link to={`/products/${product.handle}`} prefetch="intent">
                {/* Image Container */}
                <div className="product-image-container">
                  {/* Image */}
                  <img
                    src={product.images.edges[0].node.transformedSrc}
                    alt={
                      product.images.edges[0].node.altText || 'Product Image'
                    }
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                  {/* Tags Overlay */}
                  <TagOverlay tags={product.tags} />
                </div>
              </Link>
            )}
            {/* Product Details */}
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
                  <span className="ml-1">
                    {product.priceRange.minVariantPrice.currencyCode}
                  </span>
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
      </div>
    </div>
  );
};

export default BestSellersCarousel;
