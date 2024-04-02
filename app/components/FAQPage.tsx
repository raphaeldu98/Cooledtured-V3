import {useSignal} from '@preact/signals-react';
import FAQsData from '../data/FAQs.json';
import {Link} from '@remix-run/react';

type FAQItem = {
  question: string;
  answer: string;
  isOpen?: boolean;
};

type FAQItems = {
  General: FAQItem[];
  Billing: FAQItem[];
  Orders: FAQItem[];
  Shipping: FAQItem[];
  Community: FAQItem[];
};

type CategoryButtonProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const CategoryButton: React.FC<CategoryButtonProps> = ({onClick, children}) => {
  return (
    <button
      className="mx-2 xs:mx-0 w-full xs:w-44 md:w-40 h-16 rounded-md bg-blue-950 text-white text-lg font-bold outline-none border border-transparent focus:border-b-[6px] focus:border-b-amber-500 transition-all duration-150 ease-in-out hover:scale-[102%]"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const FAQPage: React.FC = () => {
  const faqItems = useSignal<FAQItems>(FAQsData);

  const activeCategory = useSignal<
    'General' | 'Orders' | 'Shipping' | 'Billing' | 'Community'
  >('General');

  const toggleCategory = (
    category: 'General' | 'Orders' | 'Shipping' | 'Billing' | 'Community',
  ) => {
    activeCategory.value = category;
  };

  const handleToggle = (index: number) => {
    const updatedFAQItems = {...faqItems.value};
    updatedFAQItems[activeCategory.value][index].isOpen =
      !updatedFAQItems[activeCategory.value][index].isOpen;
    faqItems.value = updatedFAQItems;
  };

  return (
    <div className="flex flex-col max-w-[90rem] mx-auto py-8">
      <div className="flex justify-center mb-4 flex-wrap gap-4 mx-1">
        <CategoryButton
          active={activeCategory.value === 'General'}
          onClick={() => toggleCategory('General')}
        >
          General
        </CategoryButton>
        <CategoryButton
          active={activeCategory.value === 'Orders'}
          onClick={() => toggleCategory('Orders')}
        >
          Orders
        </CategoryButton>
        <CategoryButton
          active={activeCategory.value === 'Shipping'}
          onClick={() => toggleCategory('Shipping')}
        >
          Shipping
        </CategoryButton>
        <CategoryButton
          active={activeCategory.value === 'Billing'}
          onClick={() => toggleCategory('Billing')}
        >
          Payments & Security
        </CategoryButton>
        <CategoryButton
          active={activeCategory.value === 'Community'}
          onClick={() => toggleCategory('Community')}
        >
          Community
        </CategoryButton>
      </div>

      <div className="space-y-4">
        {faqItems.value[activeCategory.value].map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded bg-gray-300"
          >
            <div
              className="font-semibold flex items-center cursor-pointer hover:text-blue-500"
              onClick={() => handleToggle(index)}
            >
              {/* <span className="mr-2 text-2xl">{item.isOpen ? '▽' : '▷'}</span> */}
              <span className="mr-2 text-2xl">{item.isOpen ? '-' : '+'}</span>
              {item.question}
            </div>
            {item.isOpen && (
              <div className="mt-2 pl-4 border-l-2 border-gray-400">
                {item.answer.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-12 text-gray-100 bg-blue-950 rounded-md gap-2 pt-2 pb-3 px-4 flex flex-col items-end w-max">
        <p className="font-medium text-base self-stretch mr-4 text-right">
          Have a question that's not listed?
        </p>
        <div className="bg-gray-200 rounded-md py-1 px-2 border-2 border-transparent hover:border-amber-500 hover:scale-[102%] active:scale-95 transition-all duration-100 ease-in">
          <Link
            to="/about#contact"
            className="text-blue-800 hover:text-blue-700 font-medium hover:underline"
          >
            Contact us directly HERE!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
