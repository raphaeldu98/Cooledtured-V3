import {NavLink} from '@remix-run/react';
import {Suspense, useEffect, useRef, forwardRef} from 'react';
import {useSignal} from '@preact/signals-react';
import {CartMain} from '~/components/Cart';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import {
  FaBars,
  FaSearch,
  FaUser,
  FaSignInAlt,
  FaShoppingCart,
  FaAngleRight,
  FaAngleDown,
} from 'react-icons/fa';

<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>;

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;
type Viewport = 'desktop' | 'mobile';

type MobileMenuProps = {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
};

const MobileMenu = ({menu, primaryDomainUrl}: MobileMenuProps) => {
  const {publicStoreDomain} = useRootLoaderData();
  const isMenuOpen = useSignal(false);

  // State to manage the visibility of each submenu
  const submenuVisibility = useSignal(new Map<string, boolean>());

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  const toggleSubmenu = (itemId: string) => {
    submenuVisibility.value.set(itemId, !submenuVisibility.value.get(itemId));
    submenuVisibility.value = new Map(submenuVisibility.value);
  };

  // Determine if any submenu is visible for setting width
  const isAnySubmenuVisible = Array.from(submenuVisibility.value.values()).some(
    (value) => value,
  );

  const getNavLinkUrl = (item: any) => {
    // Custom URL logic for "Brands" & "Fandoms"
    if (item.title === 'Brands') {
      return '/brandCollections';
    } else if (item.title === 'Fandoms') {
      return '/fandomCollections';
    } else if (item.title === 'Videos') {
      return '/Videos';
    } else if (item.title === 'Community') {
      return '/Community';
    }

    // Check if itemUrl is defined
    if (!item.url) return '#';

    // Existing logic for internal links
    if (
      item.url.includes('myshopify.com') ||
      item.url.includes(publicStoreDomain) ||
      item.url.includes(primaryDomainUrl)
    ) {
      return new URL(item.url).pathname;
    }
    return item.url;
  };

  if (!menu) {
    return null;
  }

  return (
    <>
      {/* Menu Icon  */}
      <button
        onClick={toggleMenu}
        className="text-3xl text-slate-200 md:hidden hover:scale-105 hover:text-amber-500 transition-all duration-100"
      >
        <FaBars />
      </button>
      {isMenuOpen.value && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
      {/* Mobile Menu Aside */}
      <div
        className={`fixed top-20 left-0 h-auto ${
          isAnySubmenuVisible ? 'w-52' : 'w-44'
        } bg-blue-950  border-r-amber-500 border-b-amber-500 border-r-2 border-b-2 transform transition-all duration-500 z-50 ${
          isMenuOpen.value ? 'translate-x-0' : '-translate-x-full'
        } `}
      >
        <div className="text-slate-200 p-4">
          {menu.items.map((item) => (
            <div key={item.id} className="relative group">
              {/* Main Menu Items */}
              <div className="grid grid-cols-2 gap-2 items-center">
                <NavLink
                  onClick={closeMenu}
                  prefetch="intent"
                  to={getNavLinkUrl(item)}
                  className={`block col-span-1 py-2 whitespace-nowrap hover:scale-105 hover:text-amber-500 transition-all duration-100 ${
                    submenuVisibility.value.get(item.id) &&
                    (item.title === 'Brands' || item.title === 'Fandoms')
                      ? 'text-amber-500'
                      : 'text-slate-200'
                  }`}
                >
                  {item.title}
                </NavLink>
                {(item.title === 'Brands' || item.title === 'Fandoms') && (
                  <div
                    onClick={() => toggleSubmenu(item.id)}
                    className={`cursor-pointer p-1 bg-slate-900 rounded-full align-middle translate-y-0.5 hover:scale-105 transition-all duration-300 col-start-2 w-6 ${
                      isAnySubmenuVisible ? 'ml-16' : 'ml-12'
                    }`}
                  >
                    {submenuVisibility.value.get(item.id) ? (
                      <FaAngleDown className="text-amber-500 hover:text-violet-700" />
                    ) : (
                      <FaAngleRight className="hover:text-amber-500" />
                    )}
                  </div>
                )}
              </div>
              {/* Sub-menu items */}
              {/* Transition for submenu */}
              {item.items && item.items.length > 0 && (
                <div
                  className={`border-l-2 border-amber-500 transition-all max-h duration-300 ease-in-out overflow-y-auto overflow-x-clip ${
                    submenuVisibility.value.get(item.id)
                      ? 'max-h-96'
                      : 'max-h-0'
                  }`}
                >
                  {item.items.map((subItem) => (
                    <NavLink
                      end
                      key={subItem.id}
                      onClick={closeMenu}
                      prefetch="intent"
                      to={getNavLinkUrl(subItem)}
                      className="block px-4 py-2 hover:bg-slate-900 hover:scale-105 transition-transform duration-50"
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {menu} = header;
  return (
    <header className="relative flex mlg:grid mlg:grid-cols-3 items-center bg-blue-950 text-slate-200 py-4 px-4 top-0 z-40">
      {/* Mobile Header with Logo and Menu Toggle */}
      <div className="flex md:items-center mlg:hidden flex-shrink-0">
        <MobileMenu
          menu={menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <NavLink prefetch="intent" to="/" end className="ml-2">
          <img
            src={'/images/CT_Logo_2x2in_v_white.svg'}
            alt="Logo"
            className="max-h-12 hover:scale-110 -my-2"
          />
        </NavLink>
      </div>
      {/* Search Bar - Centered on small screens */}
      <div className="flex flex-1 justify-center w-full flex-shrink mx-4 md:hidden">
        <SearchBar />
      </div>

      {/* Desktop and Larger Screens */}
      <div className="hidden md:flex-1 md:flex">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
      </div>
      <div className="hidden hover:scale-105 hover:text-amber-500 transition-all duration-100 mlg:flex mlg:relative mlg:justify-center xl:justify-items-start ">
        <NavLink
          prefetch="intent"
          to="/"
          end
          className="flex items-center lg:flex-grow justify-center text-lg"
        >
          <div className="absolute flex items-center">
            <img
              src={'/images/CT_Logo_2x2in_v_white.svg'}
              alt="Logo"
              className="mr-2 max-h-12"
            />
            <img
              src={'/images/cooledtured.png'}
              alt="Logo"
              className="mr-2 max-h-10"
            />
            {/* <strong>{shop.name}</strong> */}
          </div>
        </NavLink>
      </div>

      <div className="flex justify-end items-center gap-1 sm:gap-4">
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        <CartToggle cartPromise={cart} />
      </div>
    </header>
  );
}
<div className="text-center sm:text-left"></div>;

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className =
    viewport === 'desktop'
      ? 'hidden md:flex md:gap-4 md:ml-4 mlg:ml-0 whitespace-nowrap md:justify-between mlg:w-full 2xl:justify-start 2xl:gap-8'
      : 'flex flex-col gap-4';

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  function getNavLinkUrl(itemUrl: string) {
    if (
      itemUrl.includes('myshopify.com') ||
      itemUrl.includes(publicStoreDomain) ||
      itemUrl.includes(primaryDomainUrl)
    ) {
      return new URL(itemUrl).pathname; // Strip the domain for internal links
    }
    return itemUrl;
  }

  return (
    <nav className={className} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // Hide the "About Us" item only on `mlg:` and then show it again on `xl:`
        const isAboutUs = item.title === 'About Us';
        const aboutUsClasses = isAboutUs
          ? 'md:hidden mmd:block mlg:hidden xl:block'
          : '';

        // Check for custom URL logic, like "Brands" & "Fandoms"
        const url =
          item.title === 'Brands'
            ? '/brandCollections'
            : item.title === 'Fandoms'
            ? '/fandomCollections'
            : item.title === 'About'
            ? '/about/'
            : item.title === 'Videos'
            ? '/videos/'
            : item.title === 'Community'
            ? '/community'
            : getNavLinkUrl(item.url);

        return (
          <div className={`relative group ${aboutUsClasses}`} key={item.id}>
            <NavLink
              className="flex hover:no-underline lg:flex-grow md:font-semibold xl:text-lg lg:text-center cursor-pointer text-slate-200 text-base"
              end
              onClick={closeAside}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              <div className=" hover:scale-105 hover:text-amber-500 transition-all duration-100">
                {item.title}
              </div>
            </NavLink>

            {/* Sub-menu items */}
            {item.items && item.items.length > 0 && (
              <div className="absolute hidden group-hover:flex flex-col bg-gray-800 text-white shadow-md min-w-full -translate-y-px">
                {item.items.map((subItem) => (
                  <NavLink
                    className="submenu-link block px-4 py-2 hover:bg-gray-700"
                    end
                    key={subItem.id}
                    onClick={closeAside}
                    prefetch="intent"
                    style={activeLinkStyle}
                    to={getNavLinkUrl(subItem.url as string)}
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav
      className="flex items-center gap-4 xl:gap-6 ml-auto w-full justify-end"
      role="navigation"
    >
      <div className="hidden md:flex ">
        <SearchBar />
      </div>
      <NavLink
        prefetch="intent"
        to="/account"
        style={activeLinkStyle}
        className="relative text-lg lg:text-[1.35rem] xl:text-[1.6rem] shadow-inner shadow-blue-500 bg-blue-800 border-gray-600 rounded-full xl:rounded-xl w-8 h-8 lg:w-9 xl:w-10 lg:h-9 xl:h-10 2xl:w-16 flex justify-center items-center hover:scale-105 hover:bg-blue-600 hover:shadow-blue-900 transition-all ease-in-out duration-100 group"
      >
        {isLoggedIn ? (
          <FaUser className=" text-slate-200 group-hover:text-amber-500" />
        ) : (
          <FaSignInAlt className=" text-slate-200 group-hover:text-amber-500" />
        )}
      </NavLink>
    </nav>
  );
}

function SearchBar() {
  const isInputFocused = useSignal(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isInputFocused.value) {
        const searchElement = document.getElementById('search-bar-container');
        // Check if searchElement is not null and if the click is outside the search element
        if (searchElement && !searchElement.contains(event.target as Node)) {
          isInputFocused.value = false;
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInputFocused]);

  return (
    <div
      id="search-bar-container"
      className="relative bg-slate-200 rounded-lg w-full hover:scale-105 transition-all duration-100 ease-in-out"
    >
      <form
        className="flex items-center justify-between w-full"
        action="/search"
        method="GET"
      >
        <input
          type="text"
          name="q"
          placeholder="Search..."
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isInputFocused.value
              ? 'w-36 lg:w-44 xl:w-64'
              : 'w-12 md:w-28 lg:w-36 xl:w-56'
          } bg-transparent text-gray-700 border-none outline-none focus:ring-0 p-2 rounded`}
          onFocus={() => (isInputFocused.value = true)}
        />
        <button
          type="submit"
          className="mx-1 p-2 bg-blue-800 shadow-inner shadow-blue-500 text-slate-200 rounded-lg hover:bg-blue-600 hover:shadow-blue-800 hover:scale-105 transition-all duration-100 ease-in-out hover:text-amber-500"
        >
          <FaSearch />
        </button>
      </form>
    </div>
  );
}

// Type definition for card content for passing on the toggles for content
type SlideOverProps = {
  isOpen: boolean;
  onClose: () => void;
  cart: CartApiQueryFragment | null;
  badgeRef: React.RefObject<HTMLDivElement>;
};

// Customized Cart Content
const CartContent = ({isOpen, onClose, cart, badgeRef}: SlideOverProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Checking if the user clicks out of the tab to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !badgeRef.current?.contains(event.target as Node)
      ) {
        onClose(); // Close the cart if clicking outside of it and not on the badge
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isOpen, ref, badgeRef]);

  // Renders the cart with either loading the cart or the cart itself
  const renderCartContent = () => {
    if (cart === null) {
      return <p>Loading cart...</p>;
    } else {
      return <CartMain cart={cart} layout="aside" />;
    }
  };

  return (
    <div
      ref={ref}
      className={`border-l-2 border-b-2 border-amber-500 fixed top-20 right-0 w-80 h-auto bg-white p-4 shadow-md transform ease-in-out duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{maxHeight: '90vh', overflowY: 'auto'}}
    >
      {/* Title */}
      <div className="text-blue-950 font-bold mb-2">My Cart</div>

      {/* Button to close the tab */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 p-2 text-blue-950"
      >
        X
      </button>

      {/* Cart render */}
      <Suspense>{renderCartContent()}</Suspense>
      {cart?.lines.nodes.length != 0 && cart && (
        <div className="flex justify-center">
          <p className="text-gray-400">
            {`or `}
            <button
              onClick={onClose}
              className="font-semibold text-blue-950 hover:text-blue-700"
            >
              {`Continue shopping →`}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

// CartBadge icon with number of cart items on top right
const CartBadge = forwardRef<
  HTMLDivElement,
  {count: number; onClick?: () => void}
>(({count, onClick}, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="relative cursor-pointer text-lg lg:text-[1.35rem] xl:text-[1.6rem] shadow-inner shadow-blue-500 bg-blue-800 border-gray-600 rounded-full xl:rounded-xl w-8 h-8 lg:w-9 xl:w-10 lg:h-9 xl:h-10 2xl:w-16 flex justify-center items-center hover:scale-105 hover:bg-blue-600 hover:shadow-blue-900 transition-all ease-in-out duration-100 group"
    >
      <FaShoppingCart className="text-xl lg:text-[1.5rem] xl:text-[1.75rem] text-slate-300 group-hover:text-amber-500" />
      {count > 0 && (
        <span className="absolute top-0 left-3/4 transform -translate-x-1/4 -translate-y-1/4 bg-red-600 border border-gray-600 text-slate-200 text-xs font-bold px-1 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
});

// CartToggle logic to toggle the cart content once cartbadge is clicked
function CartToggle({
  cartPromise,
}: {
  cartPromise: Promise<CartApiQueryFragment | null>;
}) {
  const isOpen = useSignal(false); // Signal intial for boolean value of tab being closed
  const cart = useSignal<CartApiQueryFragment | null>(null); // Signal for cart value from backend
  const badgeRef = useRef<HTMLDivElement>(null); // Ref for the badge

  // Promises for the cart.value being loaded
  useEffect(() => {
    cartPromise.then((cartData) => {
      cart.value = cartData;
    });
  }, [cartPromise]);

  // Modify toggleCart to close the cart when the badge is clicked while open
  const toggleCart = () => {
    isOpen.value = !isOpen.value;
  };

  // Listen to product add to cart changes
  useEffect(() => {
    const checkHref = () => {
      if (window.location.hash === '#cart-aside') {
        isOpen.value = true;
      } else {
        isOpen.value = false;
      }
    };

    // Check the href on initial load
    checkHref();

    // Add the event listener for href changes
    window.addEventListener('hashchange', checkHref, false);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener('hashchange', checkHref, false);
    };
  }, []);
  // Counts the cart items for the user to display onto badge
  const cartCount = cart.value ? cart.value.totalQuantity || 0 : 0;

  return (
    <div>
      <div className="p-2">
        <CartBadge ref={badgeRef} count={cartCount} onClick={toggleCart} />
      </div>
      <CartContent
        isOpen={isOpen.value}
        onClose={() => {
          isOpen.value = false;
        }}
        cart={cart.value}
        badgeRef={badgeRef} // Passing the badgeRef to CartContent
      />
    </div>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    transform: isActive ? 'scale(1.02)' : undefined,
    color: isPending ? '#E5E6F2' : '#E5E6F2',
    textDecoration: isActive ? 'none' : undefined,
  };
}
