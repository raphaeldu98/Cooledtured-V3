import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Link,
  useLoaderData,
  useSearchParams,
  type MetaFunction,
} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {useEffect, useMemo} from 'react';
import Pagination from '~/components/Pagination';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // @ts-ignore
  return [{title: `cooledtured | ${data?.blog.title ?? ''} Blog`}];
};

export const loader = async ({
  params, // URL parameters.
  context: {storefront}, // Context for Shopify storefront API.
}: LoaderFunctionArgs) => {
  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const {blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  return json({blog});
};

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const articles = blog.articles.nodes;
  const articlesPerPage = 10;
  const totalPages = useMemo(
    () => Math.ceil(articles.length / articlesPerPage),
    [articles, articlesPerPage],
  );
  // Replace useSignal with useSearchParams to read the current page from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1; // URLs are 1-indexed for users

  useEffect(() => {
    // Ensure currentPage in the URL matches the page the user is actually on
    if (currentPage !== parseInt(searchParams.get('page') || '1', 10) - 1) {
      setSearchParams({page: (currentPage + 1).toString()});
    }
    // Scroll to the top of the page on currentPage change
    document.body.scrollTo({
      top: 0, // Scroll to top of page
      behavior: 'smooth', // Smooth scrolling *auto for instant scroll*
    });
  }, [currentPage, searchParams, setSearchParams]);

  const currentArticles = useMemo(() => {
    const start = currentPage * articlesPerPage;
    const end = start + articlesPerPage;
    return articles.slice(start, end);
  }, [articles, currentPage, articlesPerPage]);

  return (
    <div className="">
      <h1 className="text-blue-950 text-3xl md:text-5xl text-center mt-10 mb-6">
        Cooledtured Blog
      </h1>
      <div className="flex justify-between mb-5">
        {/* <p className="text-left ml-8">Latest News</p>
        <p className="text-right cursor-pointer hover:underline mr-8">
          View All
        </p> */}
      </div>
      <hr className="relative border-solid w-30 text-slate-500" />
      <div className="flex w-full justify-items-center">
        <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-8 mt-11 max-w-[82rem] rounded-3xl mx-auto p-4 bg-blue-950 bg-opacity-90">
          {currentArticles.map(
            (article: ArticleItemFragment, index: number) => {
              return (
                <ArticleItem
                  key={article.id}
                  article={article}
                  loading={index < 8 ? 'eager' : undefined}
                />
              );
            },
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

const removeImages = (html: string) => {
  return html.replace(/<img[^>]*>/g, '');
};

const removeIframe = (html: string) => {
  return html.replace(/<iframe[^>]*>/g, '');
};

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <>
      <style>
        {` 
        @font-face {
          font-family: 'KGRedHands';
          src: local('KGRedHands'), url('/fonts/KGRedHands.ttf') format('truetype');
        }
           
        h1, h2, h3 {
            font-family: 'KGRedHands', 'Montserrat';
        }

        @media (max-width: 768px) {

          h3 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            margin-right:15px;
            margin-top:-5%;
          }

          small {
            display:flex;
            justify-content:left;
            margin-right:10px;
          }
        }
      `}
      </style>
      <Link
        to={`/blogs/${article.blog.handle}/${article.handle}`}
        style={{textDecoration: 'none'}}
      >
        <div className="group max-w-7xl p-5 h-full cursor-pointer bg-slate-300 hover:bg-blue-950 transition-all duration-300 ease-in-out rounded-2xl hover:scale-[101%] hover:shadow-xl shadow-slate-200 border-4 border-gray-900 hover:border-amber-500">
          {article.image && (
            <div className="mr-10 mb-5 block w-2/5 float-left rounded-md relative max-h-60 overflow-hidden">
              <div className="relative object-cover object-center h-full w-full">
                <Image
                  alt={article.image.altText || article.title}
                  aspectRatio="7/4"
                  data={article.image}
                  loading={loading}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className=" h-52 object-cover"
                />
              </div>
              <h2 className="group-hover:text-slate-50 rounded-lg p-1 text-slate-100 bg-slate-900 opacity-50 group-hover:opacity-90 font-bold text-xl absolute top-0 left-0 text-left flex items-center justify-center">
                {article.author?.name.toUpperCase()}
              </h2>
            </div>
          )}
          <h3 className="text-blue-950 pt-5 group-hover:text-slate-100 text-xl">
            {article.title}
          </h3>
          <small className="group-hover:text-gray-300">{publishedAt}</small>
          <hr className="top-3 relative border-solid ml-1 w-25 group-hover:text-white" />
          <p
            className="line-clamp-4 mt-5 group-hover:text-slate-100"
            dangerouslySetInnerHTML={{
              __html: removeIframe(removeImages(article.contentHtml || '')),
            }}
          />
        </div>
      </Link>
    </>
  );
}

const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: 250,
        sortKey: PUBLISHED_AT,
        reverse: true,
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
