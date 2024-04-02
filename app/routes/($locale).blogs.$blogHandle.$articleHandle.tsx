import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import ShareButtons from '~/components/shareButtons';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // @ts-ignore
  return [{title: `cooledtured | ${data?.article.title ?? ''} article`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {blogHandle, articleHandle},
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return json({article});
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="flex flex-col items-center px-4 py-8 bg-slate-300 text-blue-950 min-h-screen">
      <style>
        {` 
        @font-face {
          font-family: 'KGRedHands';
          src: local('KGRedHands'), url('/fonts/KGRedHands.ttf') format('truetype');
        }
        `}
      </style>
      <article className="max-w-4xl w-full pt-8 px-4 pb-4 bg-slate-100 rounded-xl">
        <h1 className="text-2xl sm:text-4xl font-bold text-center text-blue-950 leading-tight mb-6">
          {title}
        </h1>
        <hr className="border-t-2 border-gray-900 my-4" />
        <ShareButtons title={title} url={currentUrl} />
        <h3 className=" text-sm sm:text-base mb-6 flex justify-between">
          <time
            dateTime={article.publishedAt}
            className="font-medium text-amber-500"
          >
            {publishedDate}
          </time>

          <span className="font-medium text-gray-900">
            {author?.name.toUpperCase()}
          </span>
        </h3>
        <div className="border-4 rounded-xl border-gray-900 bg-slate-200">
          {image && (
            <div className=" rounded-md border-gray-900 border-2">
              {image && (
                <Image
                  data={image}
                  sizes="90vw"
                  loading="eager"
                  className="outline outline-black outline-[6px] w-full object-cover object-center"
                />
              )}
            </div>
          )}
          <div
            dangerouslySetInnerHTML={{__html: contentHtml}}
            className=" text-black  rounded-xl p-4 md:p-6"
          ></div>
        </div>

        <div className="mmd:my-8">
          <h3 className="flex mx-auto my-4 p-2 rounded-lg text-slate-50 bg-blue-950 border-2 max-w-max border-amber-500">
            Share this Story!
          </h3>
          <ShareButtons />
        </div>
      </article>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
