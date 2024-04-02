import CollaborationButton from '~/components/CollaborationButton';
import ContactForm from '~/components/ContactForm';
import CTLogo from '../public/images/CT_Logo_2x2in_v_white.svg';

const Collaboration = () => {
  return (
    <div className="collaboration-page flex flex-col items-center px-4 mb-16">
      {/* <img src={CTLogo} alt="CT Logo" className="w-24 h-24 mb-6" /> */}
      <p className="text-3xl text-center mb-6 text-gray-700">
        Let’s work together!
      </p>
      <div className="text-center mb-6 max-w-[70ch]  text-gray-500">
        {/* Container to limit text width */}
        <p>
          Looking for a sponsorship or a collaboration? Want to tell your fans
          about our brand and its values? Describe what you’re looking for in a
          collab and how you will invite them to promote our products.
        </p>
      </div>
      <CollaborationButton />
      <div className="flex justify-center text-center mt-6 mb-8 max-w-[19ch]">
        {/* Flex container for "Already a member?" and "Log in" */}
        <p className="mr-2  text-gray-500">Already a member? Log In</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 mb-12">
        <img
          src="/images/Collaboration/MilitaryMarineMale.png"
          alt="Image 1"
          style={{width: '200px', height: '200px'}}
          className="object-cover"
        />
        <img
          src="/images/Collaboration/EncantoBrunoMadrigal.jpg"
          alt="Image 2"
          style={{width: '200px', height: '200px'}}
          className="object-cover"
        />
        <img
          src="/images/Collaboration/ScarletWitch.webp"
          alt="Image 3"
          style={{width: '200px', height: '200px'}}
          className="object-cover"
        />
        <img
          src="/images/Collaboration/Soccer.webp"
          alt="Image 4"
          style={{width: '200px', height: '200px'}}
          className="object-cover"
        />
        {/* Add more images here */}
      </div>
      <p className="text-3xl text-center mb-4  text-gray-700">
        Partnership opportunities
      </p>
      {/* Tags section */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-[60ch]">
        <span className="px-4 py-2 bg-gray-200 text-gray-500">
          Affiliate marketing
        </span>
        <span className="px-4 py-2 bg-gray-200 text-gray-500">
          Discount codes
        </span>
        <span className="px-4 py-2 bg-gray-200 text-gray-500">
          Content creation
        </span>
        <span className="px-4 py-2 bg-gray-200 text-gray-500">Campaigns</span>
        <span className="px-4 py-2 bg-gray-200 text-gray-500">
          Usage rights
        </span>
        <span className="px-4 py-2 bg-gray-200 text-gray-500">
          Additional opportunities
        </span>
        <span className="px-4 py-2 bg-gray-200 text-gray-500">Gifting</span>
      </div>

      <ContactForm />
    </div>
  );
};

export default Collaboration;
