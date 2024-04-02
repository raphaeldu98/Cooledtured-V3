import React from 'react';
import {useSignal} from '@preact/signals-react';
import careersImage from '../../public/images/careersPageImage.png';

interface JobCardProps {
  title: string;
  description: string;
  isFullTime: boolean;
  isRemote: boolean;
  category: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  description,
  isFullTime,
  isRemote,
}) => {
  const isDescriptionExpanded = useSignal(false);

  const toggleDescription = () => {
    isDescriptionExpanded.value = !isDescriptionExpanded.value;
  };

  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow w-80 flex flex-col">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="relative text-left">
        <p
          className={`text-sm text-gray-700 mb-2 ${
            !isDescriptionExpanded.value ? 'line-clamp-1' : ''
          }`}
        >
          {description}
        </p>
        <div
          onClick={toggleDescription}
          className="cursor-pointer hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 mx-auto transition-transform ${
              isDescriptionExpanded.value ? '' : 'rotate-180'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <span
          className={`${
            isFullTime
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          } text-xs font-semibold px-2.5 py-0.5 rounded`}
        >
          {isFullTime ? 'Full Time' : 'Part Time'}
        </span>
        {isRemote && (
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            Remote
          </span>
        )}
      </div>
    </div>
  );
};

export default function Careers() {
  const jobListings = [
    {
      title: 'Customer Acquisition',
      description:
        'Orchestrate engaging content across platforms, and spark conversations that ignite our brand.',
      isFullTime: true,
      isRemote: true,
      category: 'Marketing',
    },
    {
      title: 'E-Commerce Coordinator',
      description:
        'Architect of our online customer experience, ensuring every click sings with the coolcultured spirit.',
      isFullTime: true,
      isRemote: true,
      category: 'Marketing',
    },
    {
      title: 'Project Manager',
      description:
        'Manage the groundbreaking projects that shape’s coolcultured tomorrow.',
      isFullTime: true,
      isRemote: true,
      category: 'Operations',
    },
    {
      title: 'Developer',
      description:
        'Code your dreams into reality. Shape the future of pop culture, line by line.',
      isFullTime: true,
      isRemote: true,
      category: 'IT',
    },
    {
      title: 'Analyst',
      description:
        'Analyze, innovate and shape our future. Be the business development mastermind driving the next chapter.',
      isFullTime: true,
      isRemote: true,
      category: 'Operations',
    },
  ];

  const categories = [
    'View All',
    // 'Merchandising', // Uncomment if job to become available in this sector
    'Marketing',
    'Operations',
    'IT',
  ];
  const activeCategory = useSignal('View All');
  const isTransitioning = useSignal(false);
  const displayedJobListings = useSignal(jobListings);

  const handleCategoryClick = (category: string) => {
    if (category !== activeCategory.value && !isTransitioning.value) {
      // Start the fade-out transition
      isTransitioning.value = true;

      // Wait for the fade-out transition to finish
      setTimeout(() => {
        // Update the category and job listings while the content is invisible
        activeCategory.value = category;
        displayedJobListings.value =
          category === 'View All'
            ? jobListings
            : jobListings.filter((job) => job.category === category);

        // Start the fade-in transition
        isTransitioning.value = false;
      }, 150); // Timeout should match the fade-out transition duration
    }
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="title text-4xl font-bold text-center my-4">
        Join Our Team
      </h1>
      <p className="text-5xl text-blue-900 font-bold tracking-wide text-center my-4">
        Work with heart. Play with purpose.
      </p>
      <h3 className="text-lg text-center my-6">
        Find your fit at coolcultured.
      </h3>
      <div className="flex flex-col items-center">
        <a
          href="https://app.joinhandshake.com/stu/postings?employers%5B%5D=908556"
          className="mx-auto mb-4 w-full max-w-xs bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply
        </a>
        <div className="grid sm:grid-cols-4 grid-cols-2 justify-center gap-4 mb-8 flex-grow max-w-[60rem]">
          {categories.map((category) => (
            <button
              key={category}
              className={`py-2 px-4 rounded-full flex w-32 justify-center ${
                activeCategory.value === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              } hover:bg-blue-600 hover:text-white`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`flex justify-center items-start flex-wrap gap-4 transition-opacity duration-150 ${
          isTransitioning.value ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {displayedJobListings.value.map((job, index) => (
          <JobCard
            key={index}
            title={job.title}
            description={job.description}
            isFullTime={job.isFullTime}
            isRemote={job.isRemote}
            category={job.category}
          />
        ))}
      </div>
    </div>
  );
}
