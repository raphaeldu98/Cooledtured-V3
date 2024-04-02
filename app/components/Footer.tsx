import {NavLink} from '@remix-run/react';
import {MenuItem} from '@shopify/hydrogen/storefront-api-types';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import Social from './Social';
import {useLoadScript} from '@shopify/hydrogen';
import {useEffect} from 'react';
import TrustedSiteEmbed from './TrustedSiteEmbed';

// Footer component definition
export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: HeaderQuery['shop']}) {
  // Render the footer element
  return (
    <footer className="footer">
      <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
    </footer>
  );
}

// FooterMenu functional component definition
function FooterMenu({
  menu, // Footer menu data
  primaryDomainUrl,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const {publicStoreDomain} = useRootLoaderData();

  const tScriptStatus = useLoadScript(
    `//code.tidio.co/sdgb4ayer2paibllxb53oimidd6jtxck.js`,
  );

  useEffect(() => {
    if (tScriptStatus === 'done') {
      // console.log('Tidio script loaded');

      // Create a style element
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
      #tidio-chat-iframe {
        bottom: -47px !important;
        right: 60px !important;
      }`;
      // Append the style element to the head
      document.head.appendChild(style);
    }
  }, [tScriptStatus]);

  function getNavLinkUrl(itemUrl: string | null | undefined) {
    if (!itemUrl) {
      return '#'; // Fallback URL if no URL is provided or if the URL is not recognized as internal
    }
    if (
      itemUrl.includes('myshopify.com') ||
      itemUrl.includes(publicStoreDomain) ||
      itemUrl.includes(primaryDomainUrl)
    ) {
      return new URL(itemUrl).pathname; // Strip the domain for internal links
    }
    return itemUrl;
  }

  // Function to handle navLink click - scrolls to top
  const scrollToTop = () => {
    document.body.scrollTo({
      top: 0, // Scroll to top of page
      behavior: 'auto',
    });
  };

  // Recursive function to render menu items
  function renderMenuItems(items: MenuItem[], level = 0) {
    return items.map((item) => {
      // Custom URL logic
      const customUrl =
        item.title === 'About Us' || item.title === 'Company Info'
          ? '/about' // Custom path for About Us and Company Info
          : item.title === 'Careers'
          ? '/careers'
          : item.title === 'Internship'
          ? '/internship'
          : item.title === 'info@cooledtured.com'
          ? '/about#contact' // Custom path for the Contact Us tab
          : item.title === 'Hours of Operations'
          ? '/about#OurHQ' // Custom path for the Contact Us tab
          : item.title === 'Legal Policy'
          ? '/policies'
          : item.title === 'Collaborate'
          ? '/collaboration'
          : null;

      const itemUrl = customUrl || getNavLinkUrl(item.url);

      // Combine text style and spacing into one conditional statement
      const classes =
        level === 0
          ? 'font-bold text-lg leading-10 mb-8'
          : level === 2
          ? 'text-sm font-light italic leading-snug mb-0'
          : 'text-base font-normal leading-normal mb-0';

      const linkContent = (
        <span className={`footer-menu-item-content ${classes}`}>
          {item.title}
        </span>
      );

      return (
        <div key={item.id} className={`footer-menu-item ${classes}`}>
          {level === 2 ? (
            // For level 2 items, render a span or div without NavLink functionality
            linkContent
          ) : (
            // For level 0 and 1 items, render a NavLink
            <NavLink
              to={itemUrl || '#'}
              className={({isActive}) =>
                isActive ? 'text-white' : 'text-gray-300'
              }
              prefetch="intent"
              onClick={scrollToTop}
            >
              {linkContent}
            </NavLink>
          )}
          {/* Render submenu items if they exist */}
          {item.items && item.items.length > 0 && (
            <div className="flex flex-col">
              {renderMenuItems(item.items, level + 1)}
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <>
      <nav
        className="bg-blue-950 text-slate-100 px-8 pt-8 lg:pb-4 border-t-2 border-gray-800"
        role="navigation"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* @ts-ignore */}
          {menu?.items ? renderMenuItems(menu.items) : null}
          <div className="col-start-1 col-span-2 md:col-span-3 md:col-start-auto md:col-end-3 lg:col-end-auto justify-center  grid grid-rows-2">
            <div>
              <h3 className=" text-lg leading-10 mb-2">
                Join our Mailing List!
              </h3>
              <div className="klaviyo-form-SpYEw3 mb-4"></div>
            </div>
            <Social />
          </div>
        </div>
        <div className="flex w-full justify-center sm:justify-start -mt-16 sm:-mt-12 mb-8">
          <TrustedSiteEmbed />
        </div>
      </nav>
      <div className="bg-blue-950 pb-0 lg:pb-0 -mt-8">
        <div className="leading-loose pb-3 pt-3 text-center font-semibold align-middle bg-slate-200 text-slate-700">
          <p>COOLEDTURED COLLECTIONS LLC.</p>
          <p>2019 - {new Date().getFullYear()} | ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </>
  );
}
