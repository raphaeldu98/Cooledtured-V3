import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import {FaTrash} from 'react-icons/fa';
type CartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

export function CartMain({layout, cart}: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${
    withDiscount ? 'with-discount' : ''
  } flex flex-col h-full`;

  // below line returns cart details on all loads of page - not ideal for sending to klaviyo from this section due to re-renders
  // console.log(cart);

  return (
    <div className={className}>
      <div className="flex-grow">
        <CartEmpty hidden={linesCount} layout={layout} />
        <CartDetails cart={cart} layout={layout} />
      </div>
    </div>
  );
}

function CartDetails({layout, cart}: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <CartLines lines={cart?.lines} layout={layout} />
        {cart?.discountCodes && (
          <CartDiscounts discountCodes={cart.discountCodes} />
        )}
      </div>
      {cartHasItems && (
        <div className="bg-white shadow-md z-10 bottom-0 p-2">
          <CartSummary
            cost={cart.cost}
            layout={layout}
            checkoutUrl={cart.checkoutUrl}
          >
            {/* <CartCheckoutActions checkoutUrl={cart.checkoutUrl} /> */}
          </CartSummary>
        </div>
      )}
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul>
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li
      key={id}
      className="bg-gray-200 p-2 text-blue-950 mb-5 rounded-md overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-center">
        <div className="flex-shrink-0 mr-2 sm:mb-0 sm:mr-2 mb-2">
          {/* Fixed size container for the image */}
          {image && (
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={100}
              loading="lazy"
              width={100}
              className="object-contain w-24 h-24 sm:w-20 sm:h-20"
            />
          )}
        </div>

        {/* Title and price cell */}
        <div className="flex-1 min-w-0">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            className="text-base sm:text-lg font-bold hover:text-blue-600"
            onClick={() => {
              if (layout === 'aside') {
                // close the drawer
                window.location.href = lineItemUrl;
              }
            }}
          >
            <p className="break-words">
              <strong>{product.title}</strong>
            </p>
          </Link>
          <CartLinePrice line={line} as="span" />
          {/* <div className="flex flex-col space-y-1 mt-2">
            {selectedOptions.map((option) => (
              <p key={option.name} className="text-sm break-words">
                {option.name}: {option.value}
              </p>
            ))}
          </div> */}
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

// function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
//   if (!checkoutUrl) return null;

//   return (
//     <button className="bg-amber-500 text-white ml-2 py-2 px-6 rounded hover:bg-amber-600">
//       <a href={checkoutUrl} target="_self_">
//         CHECKOUT
//       </a>
//       <br />
//     </button>
//   );
// }

export function CartSummary({
  cost,
  layout,
  checkoutUrl,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
  checkoutUrl?: string;
}) {
  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };
  return (
    <div
      aria-labelledby="cart-summary"
      className={`cart-summary-${layout}shadow-md sticky bottom-0 overflow-hidden w-auto`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 bg-blue-950 rounded-md p-3">
          <h4 className="font-semibold text-white">Total:</h4>
          <span className="font-bold text-white">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="flex-none bg-blue-950 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mt-4 sm:mt-0"
        >
          CHECKOUT
        </button>
      </div>
      {children}
    </div>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        type="submit"
        className="inline-flex items-center justify-center p-2 h-full bg-transparent border-none text-blue-950 hover:text-red-500"
      >
        <FaTrash />
      </button>
    </CartForm>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-black mr-2">Qty</span>
        <CartLineUpdateButton
          lines={[{id: lineId, quantity: Math.max(1, quantity - 1)}]}
        >
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            className={`text-xs px-4 py-1 rounded-l-lg font-semibold bg-blue-950 border border-black text-white ${
              quantity <= 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-300 hover:text-white'
            } transition duration-150`}
          >
            &minus;
          </button>
        </CartLineUpdateButton>
        <span className="text-xs px-4 py-1 font-semibold bg-blue-950 text-white border-t border-b border-black text-center mx-0.5">
          {quantity}
        </span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: quantity + 1}]}>
          <button
            aria-label="Increase quantity"
            className="text-xs px-4 py-1 font-semibold rounded-r-lg bg-blue-950 border border-black text-white hover:bg-gray-300 hover:text-white transition duration-150"
          >
            &#43;
          </button>
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} />
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className="text-blue-950">
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

const ContinueShoppingButton = ({
  layout = 'aside',
}: {
  layout?: CartMainProps['layout'];
}) => {
  return (
    <div className="text-blue-950">
      <Link
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/';
          }
        }}
      >
        Continue shopping →
      </Link>
    </div>
  );
};

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden}>
      <br />
      <p className="text-blue-950">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <ContinueShoppingButton />
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="bg-white p-4 flex justify-center items-center">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>
      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex-grow flex">
          <input
            type="text"
            name="discountCode"
            placeholder="Enter promo code"
            className="flex-1 bg-gray-300 justify-start w-full rounded-l-md text-black placeholder-black"
          />
          &nbsp;
          <button
            type="submit"
            className="bg-blue-950 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.DiscountCodesUpdate}
        inputs={{
          discountCodes: discountCodes || [],
        }}
      >
        {children}
      </CartForm>
    </div>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
