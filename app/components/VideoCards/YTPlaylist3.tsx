import React from 'react';
import {FaYoutube} from 'react-icons/fa';
import {LoaderData} from './videoTypes';
import {useLoaderData} from '@remix-run/react';

const YTPlaylist3: React.FC = () => {
  // Extracting playlist1 details and videos from the loader data
  const {youtube} = useLoaderData<LoaderData>();

  // Access details and videos for playlist1 directly
  const {id, details, videos} = youtube.playlist3;

  // Construct the playlist URL using the ID directly from the loader
  const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${id}`;

  return (
    <>
      <div className="w-full flex place-content-center mx-auto max-w-[100rem]">
        <div className="relative bg-black rounded-xl border-4 border-red-600 p-4 w-full xxs:w-[95vw] my-5">
          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex mb-6 w-full md:mb-2 gap-4 items-start"
          >
            <FaYoutube className="flex-shrink-0 text-6xl sm:text-7xl text-red-600 rounded-md hover:scale-105 active:scale-95 hover:text-red-700" />
            <div className="  flex w-full items-center gap-4 justify-start">
              <div className="text-gray-300 md:max-w-[70%] text-wrap">
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
          <section className="grid gap-2 text-gray-300 grid-cols-1 md:grid-cols-2 mlg:grid-cols-3">
            {videos.map((video, index) => (
              <div
                key={index}
                className={`flex flex-col mt-2 py-2 xs:p-2 rounded-lg border-2 border-transparent hover:border-gray-400 ${
                  index === 0 ? 'md:col-span-2 mlg:col-span-1' : ''
                }`}
              >
                <iframe
                  src={video.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                  className="w-full rounded-lg aspect-video xxs:min-w-[20.2rem]"
                ></iframe>
                <div className="flex items-start">
                  <img
                    src="\images\CT_Logo_2x2in_v_white.svg"
                    className="w-1/6 p-2 max-w-12"
                  />
                  <div className="mt-2 w-5/6">
                    <p className="line-clamp-2 font-medium max-w-[50ch]">
                      {video.title}
                    </p>
                    <div className="text-xs text-gray-400 flex flex-col">
                      <p>{video.channelTitle}</p>
                      <p>{new Date(video.publishedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default YTPlaylist3;
