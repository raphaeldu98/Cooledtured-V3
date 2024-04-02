import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';

type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Login'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerAccessTokenCreate} = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: {email, password},
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerAccessTokenCreate;
    session.set('customerAccessToken', customerAccessToken);

    return redirect('/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Login() {
  const data = useActionData<ActionResponse>();
  const error = data?.error || null;

  return (
    <div className="flex flex-col items-center justify-center mt-4 mb-20 xs:mt-10 sm:mt-24">
      <div className="border-4 border-blue-900 min-w-[18rem] rounded-xl p-2 sm:p-8 bg-slate-200 shadow-md space-y-4 relative max-w-5xl mx-auto">
        <div className="relative gap-4 items-center flex flex-col w-full">
          <img
            src={'/images/CT_Logo_2x2in_v_white.svg'}
            alt="Logo"
            className=" w-32 h-auto -mt-4"
          />
          <h1 className="mb-5 text-center text-wrap font-bold text-3xl">
            Grow Your Collection!
          </h1>
        </div>
        <Form method="POST" className="w-full max-w-lg">
          {/* Display an error message if there's an error */}
          {error && (
            <div className="text-red-500 border border-red-400 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <fieldset className="border-none p-0 m-0">
            <label htmlFor="email" className="mb-1 block">
              <b>Email address</b>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              className="w-full p-2 mb-6 border-none"
              autoFocus
            />
            <div className="flex justify-between items-center">
              <label htmlFor="password">
                <b>Password</b>
              </label>
              <Link
                to="/account/recover"
                className="text-blue-700 font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              minLength={6}
              required
              className="w-full p-2 mb-6 border-none"
            />
          </fieldset>
          <button
            type="submit"
            className="w-3/4 max-w-xs mx-auto block bg-blue-950 text-slate-50 p-3 rounded hover:bg-green-600 border-4 border-amber-500 hover:border-blue-600 transition-all duration-100 ease-in-out transform hover:scale-105 active:animate-ping"
          >
            Let's Go!
          </button>
        </Form>
        <div className="flex flex-col">
          <p className="text-center mb-2 font-bold">Not a member?</p>
          <Link
            to="/account/register"
            className="text-blue-950 border-2 mx-auto border-blue-950 font-bold rounded-md p-1 bg-amber-500 active:animate-ping transition-all duration-100 ease-in-out hover:scale-105"
          >
            <span>Join the Club!</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;
