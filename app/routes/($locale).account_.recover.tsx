import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData} from '@remix-run/react';

type ActionResponse = {
  error?: string;
  resetRequested?: boolean;
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account');
  }

  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const form = await request.formData();
  const email = form.has('email') ? String(form.get('email')) : null;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!email) {
      throw new Error('Please provide an email.');
    }
    await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error: unknown) {
    const resetRequested = false;
    if (error instanceof Error) {
      return json({error: error.message, resetRequested}, {status: 400});
    }
    return json({error, resetRequested}, {status: 400});
  }
}

export default function Recover() {
  const action = useActionData<ActionResponse>();

  return (
    <div className="flex flex-col items-center justify-center mt-4 mb-20 xs:mt-10 sm:mt-24">
      <div className="border-4 border-blue-900 min-w-[18rem] rounded-xl p-2 sm:p-8 bg-slate-200 shadow-md space-y-4 relative max-w-5xl mx-auto">
        {action?.resetRequested ? (
          <div className="text-center flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">Request Sent.</h1>
            <p className="max-w-[60ch]">
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
            <br />
            <Link
              to="/account/login"
              className="text-blue-950 border-2 mx-auto border-blue-950 font-bold rounded-md py-1 px-2 bg-amber-500 active:animate-ping transition-all duration-100 ease-in-out hover:scale-105"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="max-w-[55ch]">
              <h1 className="text-3xl font-bold mb-2">Forgot Password.</h1>
              <p>
                Enter the email address associated with your account to receive
                a link to reset your password.
              </p>
            </div>
            <br />
            <Form method="POST" className="w-full mx-auto max-w-sm space-y-6">
              <fieldset className="border-none p-0 m-0 space-y-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  aria-label="Email address"
                  autoComplete="email"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  id="email"
                  name="email"
                  placeholder="Email address"
                  required
                  type="email"
                  className="w-full p-2 border-gray-300 rounded-md shadow-sm"
                />
              </fieldset>
              {action?.error ? (
                <p>
                  <mark>
                    <small>{action.error}</small>
                  </mark>
                </p>
              ) : (
                <br />
              )}
              <button
                type="submit"
                className="w-full px-4 pt-1.5 pb-2 text-slate-50 bg-blue-950 rounded hover:bg-green-600 border-4 border-amber-500 hover:border-blue-600 transition-all duration-100 ease-in-out hover:scale-105 text-lg active:animate-ping"
              >
                Request Reset Link
              </button>
            </Form>
            <div className="w-full">
              <p className="flex justify-center w-max text-blue-950 border-2 mx-auto border-blue-950 font-bold rounded-md py-1 px-2 bg-amber-500 active:animate-ping transition-all duration-100 ease-in-out hover:scale-105">
                <Link to="/account/login">Login →</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
