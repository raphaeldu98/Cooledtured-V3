import {Link} from '@remix-run/react';
import React from 'react';
const Custom404: React.FC = () => {
  return (
    <div className="relative bg-black min-h-screen mx-auto">
      <style>{`
        @font-face {
            font-family: Shopify Sans;
            src: url(https://cdn.shopify.com/oxygen/static-assets/ShopifySans-Medium.woff2) format("woff2"),
                 url(https://cdn.shopify.com/oxygen/static-assets/ShopifySans-Medium.woff) format("woff");
            font-weight: 500;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: Shopify Sans;
            src: url(https://cdn.shopify.com/oxygen/static-assets/ShopifySans-Black.woff2) format("woff2"),
                 url(https://cdn.shopify.com/oxygen/static-assets/ShopifySans-Black.woff) format("woff");
            font-weight: 900;
            font-style: normal;
            font-display: swap;
        }
        @keyframes slide {
            0% {
                transform: translate3d(0, 0, 0);
            }
            100% {
                transform: translate3d(-105px, 0, 0);
            }
        }

        a:link, a:hover {
            color: #3de877;
            text-decoration: none;
        }
        h1 {
            font: 900 3em "Shopify Sans", sans-serif;
        }
        .b-marquee {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 45px;
            overflow-x: hidden;
        }
        .b-marquee__ani {
            position: absolute;
            top: 0;
            left: 0;
            width: 150vw;
            height: 45px;
            background-image: url("https://cdn.shopify.com/oxygen/static-assets/404-outline.svg");
            background-size: contain;
            background-repeat: repeat-x;
            animation: slide 6s linear infinite;
        }
        .b-shopify {
          position: fixed;
          bottom: 0;
          right: 0;         
            display: block;
            width: 75px;
            height: 40px;
            background-image: url("https://cdn.shopify.com/oxygen/static-assets/shopify-logo.svg");
            background-position: center center;
            background-size: contain;
            background-repeat: no-repeat;
        }

      `}</style>
      <div className="pt-20 sm:pt-40 grid grid-cols-1 md:grid-cols-2 justify-items-center max-w-[60rem] mx-auto mb-16 transition-all duration-300 ease-in-out">
        <div className="text-center sm:text-nowrap font-sans text-lg text-white md:text-left sm:ml-8 min-w-80">
          <div className="flex flex-col">
            <h1 className="text-green-600">Error 404 -</h1>
            <h1 className="mb-4">Page Not Found</h1>
          </div>

          <p>The page either doesn't exist or there was an error.</p>
          <a href="/_index.tsx" className="text-green-600">
            Go back to the Homepage
          </a>
          <a
            href="https://www.shopify.com"
            className="b-shopify"
            title="Shopify"
          ></a>
          <div className="b-marquee mt-2">
            <div className="b-marquee__ani"></div>
          </div>
          <img
            src={'/images/404images/cooledtured.png'}
            alt="Logo"
            className="hidden md:block max-h-24 mt-8 "
          />
        </div>
        <Link to="/">
          <img
            src={'/images/404images/cooledtured.png'}
            alt="logo"
            className=" max-h-80 mt-8 md:mt-0 mx-auto sm:mx-0 hover:scale-110 hover:animate-pulse transition-transform duration-300 ease-in-out"
          />
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
