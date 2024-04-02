import {FaArrowAltCircleRight} from 'react-icons/fa';

const Apply = () => {
  // Array of roles with their titles and descriptions
  const roles = [
    {
      title: 'Operations',
      description:
        'cooledtured excels in pop culture collectibles, bringing together experts in art, storytelling, business development, etc.',
    },
    {
      title: 'Technology',
      description:
        'Our tech team is the innovative engine behind everything we do. They connect, protect, and empower our entire organization to achieve peak performance.',
    },
    {
      title: 'Marketing',
      description:
        'Our marketing teams lead the charge in building meaningful relationships with hundreds of millions of fans worldwide who adore our collectibles.',
    },
    {
      title: 'Customer Experience',
      description:
        'cooledtured empowers collectors globally, providing essential support for a seamless experience.',
    },
    {
      title: 'Commercial',
      description:
        'Commercial team leads global business success through strategic partnerships, market focus, and operational excellence.',
    },
    {
      title: 'Human Resources',
      description:
        "Our people are our top priority. Our dedicated Human Resources team seeks, empowers, and cultivates exceptional talent who shape cooledtured's future.",
    },
    {
      title: 'Finance',
      description:
        "Finance team champions deliver critical support, guiding the organization's cooledtured’s digital journey.",
    },
    {
      title: 'Legal',
      description:
        'Savvy legal minds provide actionable risk mitigation, empowering our teams to elevate the customer experience.',
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-center text-2xl xs:text-3xl md:text-4xl font-bold text-blue-950 mr-4 mb-4 leading-relaxed">
        What epic Adventures await in the
        <br />
        CTRL+Xperience?
      </h2>
      <div className="text-center md:text-sm">
        <a
          href="https://app.joinhandshake.com/stu/employers/908556"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center mx-auto w-max"
        >
          <button className="flex gap-4 items-center bg-blue-950 w-max px-20 py-2 align-middle text-white font-semibold text-xl rounded-xl shadow-xl hover:bg-blue-700 mt-5">
            See Open Roles <FaArrowAltCircleRight />
          </button>
        </a>
        <div className="mx-auto mt-12 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-8 max-w-[80rem]">
          {roles.map(({title, description}) => (
            <a
              key={title}
              href="https://app.joinhandshake.com/stu/employers/908556"
              target="_blank"
              rel="noopener noreferrer"
              className=" border-gray-200 border-2 rounded-xl p-4 w-full hover:border-b-amber-500 hover:scale-[102%] active:scale-95 transition-all duration-150 ease-out"
            >
              <div className="font-Montserrat font-extrabold text-3xl rounded-2xl mb-4 text-blue-950 text-left">
                {title}
              </div>
              <div className="text-left">{description}</div>
            </a>
          ))}
        </div>
      </div>
      <a
        href="https://app.joinhandshake.com/stu/employers/908556"
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center mx-auto w-max"
      >
        <button className="flex gap-4 items-center bg-blue-950 w-max px-20 py-2 align-middle text-white font-semibold text-xl rounded-xl shadow-xl hover:bg-blue-700 mt-5">
          See Open Roles <FaArrowAltCircleRight />
        </button>
      </a>
    </div>
  );
};

export default Apply;
