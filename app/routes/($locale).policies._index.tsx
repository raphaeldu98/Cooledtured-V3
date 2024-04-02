import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {NavLink, useLoaderData} from '@remix-run/react';

export async function loader({context}: LoaderFunctionArgs) {
  const policyMenuHandle = 'policies-menu'; // Menu to pull

  // Perform the query
  const data = await context.storefront.query(POLICY_MENU_QUERY, {
    variables: {
      policyMenuHandle,
    },
  });

  // Check if the necessary data is present
  if (!data || !data.menu || !data.menu.items.length) {
    throw new Response('No policy menu items found', {status: 404});
  }

  // Data.shop contains the shop details as per the query structure
  if (!data.shop) {
    throw new Response('Shop details not found', {status: 404});
  }

  // Return the fetched menu items and shop details
  return json({
    menuItems: data.menu.items,
    shopDetails: data.shop, // Include shop details
  });
}

function PolicyMenu() {
  const {menuItems, shopDetails} = useLoaderData<typeof loader>();

  return (
    <div className="p-8 bg-white-100 max-w-[80rem] mx-auto text-center space-y-4">
      <h1 className="text-4xl font-bold mb-12">Policy Menu</h1>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center">
        {menuItems.map((item: any) => (
          <NavLink
            key={item.id}
            to={new URL(item.url, shopDetails.primaryDomain.url).pathname}
            prefetch="intent"
            className=" h-full flex items-center justify-center hover:bg-blue-950 text-slate-50 text-1xl font-bold rounded-md shadow-md bg-blue-900 p-4 border-2 border-gray-200 hover:shadow-md hover:no-underline hover:text-orange-400 hover:shadow-white hover:scale-105"
          >
            {item.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
export default PolicyMenu;

const POLICY_MENU_QUERY = `#graphql
  query PolicyMenu(
    $country: CountryCode
    $policyMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
    menu(handle: $policyMenuHandle) {
      items {
        id
        title
        url
      }
    }
  }
` as const;
