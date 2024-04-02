import {useSignal} from '@preact/signals-react';
import {ChangeEvent} from 'react';

export default function MailingList(): JSX.Element {
  const email = useSignal<string>('');

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    email.value = event.target.value;
  };

  const handleSubscribe = (): void => {
    // Add your logic for handling the subscription (e.g., API call, state update)
    console.log(`Subscribing ${email.value} to the newsletter...`);
    // Reset the email input after subscribing
    email.value = ''; // Reset the email
  };

  return (
    <div
      style={{
        marginTop: '10px',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '300px',
        maxHeight: '200px',
        margin: '0 auto',
      }}
      className="mailing-list"
    >
      <h3 style={{fontSize: '1.0em', marginBottom: '15px', color: '#000'}}>
        JOIN OUR MAILING LIST
      </h3>
      <form
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}
      >
        <input
          style={{
            padding: '10px',
            backgroundColor: 'white',
            color: '#000',
            marginBottom: '15px',
            border: '1px solid #000', // Added border for consistency
          }}
          type="email"
          id="email"
          name="email"
          value={email.value}
          onChange={handleEmailChange}
          required
          placeholder="Email"
        />
        <button
          style={{
            padding: '10px',
            backgroundColor: 'black',
            color: '#fff',
            marginBottom: '15px',
          }}
          type="button"
          onClick={handleSubscribe}
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
