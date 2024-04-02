import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
// import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
// import {CartMain} from '~/components/Cart';
// import {
//   PredictiveSearchForm,
//   PredictiveSearchResults,
// } from '~/components/Search';
import AnnouncementBar from './AnnouncementBar';
import BackToTop from './BackToTop';
import Discord from './DiscordWidget';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <>
      <div className="max-w-[100vw]">
        <div className="sticky top-0 z-[100]">
          <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
          <AnnouncementBar />
          <Discord />
          <BackToTop />
        </div>
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
        <Suspense>
          <Await resolve={footer}>
            {(footerData) => (
              <Footer menu={footerData.menu} shop={header.shop} />
            )}
          </Await>
        </Suspense>
      </div>
      <script
        type="text/javascript"
        src="https://cdn.ywxi.net/js/1.js"
        async
      ></script>
    </>
  );
}
