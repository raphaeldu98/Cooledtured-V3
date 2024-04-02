import type {EntryContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    // Add the following directives to allow additional resources
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com', // Allow Google Fonts
      'https://static.klaviyo.com', // Allow Klaviyo Styles
      'https://fonts.cdnfonts.com/',
      'http://fonts.googleapis.com/',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com', // Allow Google Fonts
      'http://static.klaviyo.com', // Allow Klaviyo hosted fonts
      'https://cdn.shopify.com',
      'https://fonts.googeapis.com',
      'https://widget-v4.tidiochat.com', // For Tidio fonts
      'https://fonts.cdnfonts.com/',
      'http://fonts.googleapis.com/',
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'http://static.klaviyo.com',
      'https://static-tracking.klaviyo.com',
      'https://fast.a.klaviyo.com',
      'https://static-forms.klaviyo.com',
      'https://code.tidio.co/*', // General domain for Tidio script without specific file
      'http://code.tidio.co/sdgb4ayer2paibllxb53oimidd6jtxck.js', // Tidio script URL
      'https://metrics-collector.tidio.co/',
      'https://widget-v4.tidiochat.com', // For Tidio scripts
      'https://cdn.shopify.com/',
      'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
      "'unsafe-eval'", // Required by Hydrogen (e.g., `useHydrate`)
      'http://cdn.ywxi.net',
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'https://static-forms.klaviyo.com', // Allow Klaviyo form resources
      'https://fast.a.klaviyo.com', // Allow Klaviyo font resources
      'https://a.klaviyo.com',
      'https://cooledtured.myshopify.com/api/2024-01/graphql.json', // Add your Shopify Storefront API endpoint here
      'https://widget-v4.tidiochat.com', // For Tidio connections
      'wss://socket.tidio.co/socket.io/',
      'https://metrics-collector.tidio.co/',
      'https://www.googleapis.com/youtube/v3/',
      'https://*.twitch.tv/',
      'https://cdn.shopify.com',
    ],
    imgSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://localhost:3000',
      'https://d3k81ch9hvuctc.cloudfront.net',
      'https://cdnjs.cloudflare.com',
      'https://imgur.com',
      'https://www.entertainmentearth.com',
      'https://lh3.googleusercontent.com',
      'https://lh4.googleusercontent.com',
      'https://lh5.googleusercontent.com',
      'https://widget-v4.tidiochat.com', // For Tidio images
      'https://*.medium.com',
      'data:',
      'https://i.ytimg.com/vi/',
      'https://static-cdn.jtvnw.net/',
    ],
    frameSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'localhost:*',
      'https://discord.com',
      'https://www.youtube.com/',
      'https://widget-v4.tidiochat.com', // For Tidio iframes
      'https://player.twitch.tv/',
      'https://e.widgetbot.io/',
    ],
    mediaSrc: [
      'https://widget-v4.tidiochat.com', // Allow Tidio media sources
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer
        // @ts-ignore
        context={remixContext}
        url={request.url}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
