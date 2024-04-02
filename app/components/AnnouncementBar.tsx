import {useEffect, useRef} from 'react';
import {useSignal} from '@preact/signals-react';
import announcementsData from '../data/announcements.json';
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa';

<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>;

// Type definition for props of each announcement
type AnnouncementProps = {
  message: string;
  link?: string; // optional property
  linkText?: string; // optional property
};

// Custom hook for setting up an interval
function useInterval(callback: () => void, delay: number) {
  const intervalId = useRef<number | null>(null); // useRef to persist the interval ID across renders

  useEffect(() => {
    intervalId.current = setInterval(callback, delay); // Set up the interval
    return () => clearInterval(intervalId.current); // Clear interval on component unmount or dependencies change
  }, [callback, delay]); // Dependencies array for useEffect
}

// Functional component for the Announcement Bar
const AnnouncementBar: React.FC = () => {
  // Signals for managing state in a reactive way
  const announcements = useSignal<AnnouncementProps[]>(announcementsData); // Signal for announcements data
  const currentAnnouncementIndex = useSignal(0); // Signal for current announcement index
  const showAnnouncement = useSignal(true); // Signal for showing/hiding announcement

  // Using the custom useInterval hook
  useInterval(() => {
    const nextIndex =
      (currentAnnouncementIndex.value + 1) % announcements.value.length; // Calculate next announcement index
    showAnnouncement.value = false; // Hide announcement for transition
    setTimeout(() => {
      currentAnnouncementIndex.value = nextIndex; // Update announcement index
      showAnnouncement.value = true; // Show announcement after transition
    }, 150); // Transition delay
  }, 8000); // Interval delay

  // Function to navigate between announcements
  const navigate = (direction: number) => {
    showAnnouncement.value = false; // Hide announcement for transition
    setTimeout(() => {
      const total = announcements.value.length; // Total number of announcements
      const newIndex =
        (currentAnnouncementIndex.value + direction + total) % total; // Calculate new index based on direction
      currentAnnouncementIndex.value = newIndex; // Update the current announcement index
      showAnnouncement.value = true; // Show announcement after transition
    }, 150); // Transition delay
  };

  return (
    <div className="flex items-center justify-between bg-gray-900 text-amber-500 p-2 text-center font-normal text-sm">
      <FaAngleLeft
        className=" font-extrabold text-base cursor-pointer active:animate-ping"
        onClick={() => navigate(-1)}
        aria-label="Previous announcement"
      />
      <div
        className={`flex-grow transition-opacity duration-300 ease-in-out ${
          showAnnouncement.value ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {announcements.value[currentAnnouncementIndex.value]?.message}
        {announcements.value[currentAnnouncementIndex.value]?.link && (
          <a
            href={announcements.value[currentAnnouncementIndex.value].link}
            className="underline pl-1"
          >
            {announcements.value[currentAnnouncementIndex.value].linkText}
          </a>
        )}
      </div>
      <FaAngleRight
        className=" font-extrabold text-base cursor-pointer active:animate-ping"
        onClick={() => navigate(1)}
        aria-label="Next announcement"
      />
    </div>
  );
};

export default AnnouncementBar;
