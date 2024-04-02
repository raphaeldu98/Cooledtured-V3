import {FaYoutube} from 'react-icons/fa';
import {LoaderData} from './videoTypes';
import {useLoaderData} from '@remix-run/react';

const YTShortsPlaylist: React.FC = () => {
  const {youtube} = useLoaderData<LoaderData>();
  const {details, videos, id} = youtube.playlistShorts1;

  // YouTube playlist base URL
  const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${id}`;

  // Function to scroll the videos container (remains unchanged)
  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('videosContainer');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollLeft += scrollAmount;
    }
  };

  return (
    <>
      <style>
        {`
          /* This styles the scrollbar track */
          ::-webkit-scrollbar {
            width: 12px; /* width of the entire scrollbar */
          }

          /* This styles the scrollbar handle */
          ::-webkit-scrollbar-thumb {
            background-color: black; /* color of the scrollbar itself */
            border-radius: 6px; /* roundness of the scrollbar */
            border: 3px solid black; /* creates padding around the scrollbar */
          }

          /* Optional: This styles the scrollbar track */
          ::-webkit-scrollbar-track {
            background: black; /* color of the background */
          }

          /* For Firefox */
          * {
            scrollbar-width: thin; /* "auto" or "thin" */
            scrollbar-color: darkgrey black; /* thumb and track color */
          }
        `}
      </style>
      <div className="w-full flex place-content-center mx-auto ">
        <div className="relative max-w-[100rem] bg-black rounded-xl border-4 border-red-600 p-4 w-full xxs:w-[95vw] my-5">
          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex mb-6 w-full md:mb-2 gap-4 items-start"
          >
            <FaYoutube className="  flex-shrink-0 text-6xl sm:text-7xl text-red-600 rounded-md hover:scale-105 active:scale-95 hover:text-red-700" />
            <div className="  flex w-full items-center gap-4 justify-start">
              <div className=" text-gray-300 md:max-w-[70%] text-wrap">
                <h1 className=" text-3xl my-2 hover:scale-105 hover:text-sky-700">
                  {details.title}
                </h1>
                <p className="hover:scale-105 hover:text-sky-700">
                  {details.description}
                </p>
              </div>
            </div>
          </a>
          {/* Playlist link at the top right */}
          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex justify-center md:absolute md:top-8 md:right-8 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-150 hover:no-underline ease-in-out"
          >
            Full Playlist Here!
          </a>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => scrollContainer('left')}
              className="mr-2 px-1 py-12 text-slate-100 bg-gray-800 border-2 border-transparent rounded-full hover:py-24 hover:rounded-xl hover:border-gray-950 focus:outline-none hover:text-amber-500 hover:scale-105 transition-all duration-150 ease-in-out active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 sm:h-6 w-4 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div
              id="videosContainer"
              className="flex overflow-x-scroll mx-1 scroll-smooth scrollbar-hide gap-4 p-4 rounded-3xl"
              style={{scrollBehavior: 'smooth'}}
            >
              {videos.map((video, index) => (
                <iframe
                  key={index}
                  src={video.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                  className="max-w-60 xl:max-w-80 aspect-[9/16] rounded-lg hover:-translate-y-2 transition-transform duration-150 ease-in-out"
                ></iframe>
              ))}
            </div>
            <button
              onClick={() => scrollContainer('right')}
              className="ml-2 px-1 py-12 text-slate-100 bg-gray-800 border-2 border-transparent rounded-full hover:py-24 hover:rounded-xl hover:border-gray-950 focus:outline-none hover:text-amber-500 hover:scale-105 transition-all duration-150 ease-in-out active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 sm:h-6 w-4 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default YTShortsPlaylist;
