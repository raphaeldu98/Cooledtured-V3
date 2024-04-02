import {useRef} from 'react';
import {useSignal} from '@preact/signals-react';
import emailjs from '@emailjs/browser';
import {FaInfoCircle} from 'react-icons/fa';

const ContactForm = () => {
  const formRef = useRef(null);
  const name = useSignal('');
  const email = useSignal('');
  const phoneNumber = useSignal('');
  const message = useSignal('');
  const showSendErrorPopup = useSignal(false);
  const popupAnimation = useSignal('scale-95 opacity-100');
  const showInfoBox = useSignal(false);
  const showSendSuccessPopup = useSignal(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before sending
    if (!isValidEmail(email.value)) {
      console.error('Invalid email address');
      showSendErrorPopup.value = true;
      return;
    }

    const formData = {
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      message: message.value,
    };

    emailjs
      .send(
        'service_c2w8oo3',
        'template_ocfpdsa',
        formData,
        '0T-9lkX1OV-HTDjhd',
      )
      .then(
        function (response) {
          console.log('Email sent successfully:', response);
          showSendSuccessPopup.value = true; // Show success popup
          // Reset the signals
          name.value = '';
          email.value = '';
          phoneNumber.value = '';
          message.value = '';

          // Close the success popup after 2 seconds
          setTimeout(() => {
            showSendSuccessPopup.value = false;
          }, 2000); // 2000 milliseconds = 2 seconds
        },

        function (error) {
          console.error('Failed to send email:', error);
          showSendErrorPopup.value = true; // Show popup on failure
        },
      );
  };

  const closePopup = () => {
    popupAnimation.value =
      'scale-100 opacity-50 transition ease-in duration-100';
    setTimeout(() => {
      showSendErrorPopup.value = false;
      popupAnimation.value = 'scale-95 opacity-100'; // Reset animation state
      {
        toggleInfoBox;
      }
    }, 100); // 100ms for the animation to complete
    return {};
  };

  const toggleInfoBox = () => {
    showInfoBox.value = !showInfoBox.value;
  };

  return (
    <div className="mx-auto max-w-5xl p-20 w-full bg-blue-950 text-slate-200 rounded-md flex gap-4">
      <div className="w-1/2 flex flex-col justify-top mr-8 ">
        <h2 className=" w-3/4 text-6xl mb-2 text-left">
          Get in Touch with Us!
        </h2>
      </div>
      <form ref={formRef} onSubmit={handleSubmit} className="w-1/2">
        <div className="mb-4 flex flex-col">
          <div className="flex mb-10">
            <input
              type="text"
              name="user_name"
              value={name.value}
              onChange={(e) => (name.value = e.target.value)}
              placeholder="Your Name"
              className="w-full p-0  h-6 mr-2 bg-blue-950 text-slate-200 border-t-0  border-l-0  border-r-0 border-b border-slate-200 focus:ring-0  focus:outline-none "
              required
            />
            <input
              type="tel"
              name="user_phone"
              value={phoneNumber.value}
              onChange={(e) => (phoneNumber.value = e.target.value)}
              placeholder="Phone Number"
              className="w-full p-0  h-6 ml-2 bg-blue-950 text-slate-200 border-t-0  border-l-0  border-r-0 border-b border-slate-200 focus:ring-0  focus:outline-none "
              required
            />
          </div>
          <input
            type="email"
            name="user_email"
            value={email.value}
            onChange={(e) => (email.value = e.target.value)}
            placeholder="Your Email"
            className="w-full p-0  h-6 mb-10 bg-blue-950 text-slate-200 border-t-0  border-l-0  border-r-0 border-b border-slate-200 focus:ring-0  focus:outline-none "
            required
          />
          <textarea
            value={message.value}
            name="user_message"
            onChange={(e) => (message.value = e.target.value)}
            placeholder="Message"
            className="w-full p-0  h-6 mb-16 bg-blue-950 text-slate-200 border-t-0  border-l-0  border-r-0 border-b border-slate-200 focus:ring-0  focus:outline-none "
            required
          />
          <button
            type="submit"
            className="bg-slate-200 text-blue-950 px-4 py-2 rounded-full font-bold self-start"
          >
            Submit
          </button>
        </div>
      </form>

      {/* JSX for the success popup */}
      {showSendSuccessPopup.value && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-200 p-4 rounded border-4 border-green-500">
          <p
            className="text-center text-green-700"
            style={{fontFamily: "'Bubblegum Sans', cursive"}}
          >
            Email sent successfully!
          </p>
        </div>
      )}
      {showSendErrorPopup.value && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-200 py-4 px-6 rounded border-8 border-red-600 ${popupAnimation.value}`}
        >
          <p
            className="text-center font-bold text-lg text-blue-950"
            style={{fontFamily: "'Bubblegum Sans', cursive"}}
          >
            Whoops! It failed...
          </p>
          <button
            onClick={toggleInfoBox}
            className="absolute top-0 right-0 text-blue-500 text-sm mt-2 mr-2"
          >
            <FaInfoCircle />
          </button>
          {showInfoBox.value && (
            <div className="absolute w-max -bottom-16 -left-2/3 p-2 bg-blue-300 text-blue-950 border-2 border-amber-500 text-sm rounded">
              Was the email address valid?? 🙀 <br /> Contact us at
              info@cooledtured.com instead if this problem persists! 🚀
            </div>
          )}
          <button
            onClick={closePopup}
            className="mt-2 text-slate-200 font-semibold px-4 py-2 rounded-full border-2 border-amber-500 bg-blue-950 mx-auto block hover:scale-105 transition-transform duration-100 ease-in-out focus:outline-none"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
