import type {CustomerFragment} from 'storefrontapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';
import {useSignal} from '@preact/signals-react';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'PUT') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();
  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    return json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    const password = getPassword(form);
    const customer: CustomerUpdateInput = {};
    const validInputKeys = [
      'firstName',
      'lastName',
      'email',
      'password',
      'phone',
    ] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (key === 'acceptsMarketing') {
        customer.acceptsMarketing = value === 'on';
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    if (password) {
      customer.password = password;
    }

    // update customer and possibly password
    const updated = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        customer,
      },
    });

    // check for mutation errors
    if (updated.customerUpdate?.customerUserErrors?.length) {
      return json(
        {error: updated.customerUpdate?.customerUserErrors[0]},
        {status: 400},
      );
    }

    // update session with the updated access token
    if (updated.customerUpdate?.customerAccessToken?.accessToken) {
      session.set(
        'customerAccessToken',
        updated.customerUpdate?.customerAccessToken,
      );
    }

    return json(
      {error: null, customer: updated.customerUpdate?.customer},
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error: any) {
    return json({error: error.message, customer: null}, {status: 400});
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  // Signal to manage the visibility of password fields
  const showPassChange = useSignal(false);

  // Function to toggle password visibility
  const togglePasswordChange = () => {
    showPassChange.value = !showPassChange.value;
    // Immediately return if showing the password fields, clear them otherwise
    if (showPassChange.value) return;

    // Function to clear the input field by id if it exists
    const clearInputFieldById = (elementId: any) => {
      const inputElement = document.getElementById(
        elementId,
      ) as HTMLInputElement | null;
      if (inputElement) inputElement.value = '';
    };

    // Clear each password input field
    clearInputFieldById('currentPassword');
    clearInputFieldById('newPassword');
    clearInputFieldById('newPasswordConfirm');
  };

  return (
    <div className="mx-4 mb-8">
      <h2 className="mb-4 text-lg">My profile</h2>
      <Form method="PUT">
        <legend className="mb-1 py-1 px-4 bg-gray-600 text-white  rounded-md w-max text-lg">
          Personal information
        </legend>
        <fieldset className="grid grid-cols-1 max-w-[50ch] md:max-w-[45ch]">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            aria-label="First name"
            defaultValue={customer.firstName ?? ''}
            minLength={2}
          />
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            aria-label="Last name"
            defaultValue={customer.lastName ?? ''}
            minLength={2}
          />
          <label htmlFor="phone">Mobile</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Mobile"
            aria-label="Mobile"
            defaultValue={customer.phone ?? ''}
          />
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            defaultValue={customer.email ?? ''}
          />
          <div className="mt-4 account-profile-marketing">
            <input
              id="acceptsMarketing"
              name="acceptsMarketing"
              type="checkbox"
              placeholder="Accept marketing"
              aria-label="Accept marketing"
              defaultChecked={customer.acceptsMarketing}
            />
            <label htmlFor="acceptsMarketing">
              &nbsp; Subscribed to marketing communications
            </label>
          </div>
        </fieldset>
        <br />
        <legend>
          <button
            type="button"
            onClick={togglePasswordChange}
            className="bg-blue-950 text-gray-100 px-4 py-2 rounded-lg font-normal font-Montserrat border-black border-2 hover:border-amber-500 hover:scale-[101%] active:scale-95 transition-transform duration-100 ease-in"
          >
            {showPassChange.value ? 'Cancel' : 'Change Password (Optional)'}
          </button>
        </legend>
        <div style={{display: showPassChange.value ? 'block' : 'none'}}>
          <fieldset className="max-w-[50ch] md:max-w-[45ch] grid grid-cols-1">
            <label htmlFor="currentPassword">Current password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Current password"
              aria-label="Current password"
              minLength={8}
            />

            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New password"
              aria-label="New password"
              minLength={8}
            />

            <label htmlFor="newPasswordConfirm">New password (confirm)</label>
            <input
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              type="password"
              placeholder="New password (confirm)"
              aria-label="New password confirm"
              minLength={8}
            />
            <small>Passwords must be at least 8 characters.</small>
          </fieldset>
        </div>
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
          disabled={state !== 'idle'}
          className="bg-blue-950 text-gray-100 px-4 py-2 rounded-lg font-normal font-Montserrat border-black border-2 hover:border-amber-500 hover:scale-105 active:scale-95 transition-all duration-100 ease-in"
        >
          {state !== 'idle' ? 'Updating' : 'Update'}
        </button>
      </Form>
    </div>
  );
}

function getPassword(form: FormData): string | undefined {
  let password;
  const currentPassword = form.get('currentPassword');
  const newPassword = form.get('newPassword');
  const newPasswordConfirm = form.get('newPasswordConfirm');

  let passwordError;
  if (newPassword && !currentPassword) {
    passwordError = new Error('Current password is required.');
  }

  if (newPassword && newPassword !== newPasswordConfirm) {
    passwordError = new Error('New passwords must match.');
  }

  if (newPassword && currentPassword && newPassword === currentPassword) {
    passwordError = new Error(
      'New password must be different than current password.',
    );
  }

  if (passwordError) {
    throw passwordError;
  }

  if (currentPassword && newPassword) {
    password = newPassword;
  } else {
    password = currentPassword;
  }

  return String(password);
}

const CUSTOMER_UPDATE_MUTATION = `#graphql
  # https://shopify.dev/docs/api/storefront/latest/mutations/customerUpdate
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        acceptsMarketing
        email
        firstName
        id
        lastName
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
