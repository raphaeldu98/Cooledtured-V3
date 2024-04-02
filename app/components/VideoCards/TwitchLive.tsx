import {FaCircle} from 'react-icons/fa';
import {TwitchDataState} from './videoTypes';
import {useLoaderData} from '@remix-run/react';

const TwitchLiveStreams = ({parentDomain}: any) => {
  // Access data provided by the loader
  // Accessing nested twitch data provided by the loader
  const {twitch} = useLoaderData<{twitch: TwitchDataState}>();

  // Destructuring to extract twitch data
  const {channelInfo, isLive, mostRecentStream} = twitch;

  return (
    <div>
      {isLive ? (
        <>
          <iframe
            src={`https://player.twitch.tv/?channel=cooledtured&parent=${parentDomain}`}
            allowFullScreen={true}
            className="w-full aspect-video rounded-md"
          ></iframe>
          <h3 className="glowing-button flex gap-1 my-1 bg-red-700 w-max border-4 border-red-800 text-black p-1 rounded-xl">
            <FaCircle className="text-black" /> - Live now!
          </h3>
          {/* Additional live stream details can be displayed here */}
        </>
      ) : mostRecentStream ? (
        // Display an iframe for the most recent stream if available
        <iframe
          src={`https://player.twitch.tv/?video=${mostRecentStream.id}&parent=${parentDomain}`}
          allowFullScreen={true}
          className="w-full aspect-video rounded-md"
        ></iframe>
      ) : (
        <iframe
          src={`https://player.twitch.tv/?channel=cooledtured&parent=${parentDomain}`}
          allowFullScreen={true}
          className="w-full aspect-video rounded-md"
        ></iframe>
      )}
      {channelInfo && (
        <div className="my-1 p-4 bg-gray-900 text-gray-300 border-2 border-black rounded-b-2xl">
          <div className="flex items-center mb-2 gap-2 bg-gray-400 rounded-2xl shadow-md p-2 w-max">
            <img
              src={channelInfo.profileImageUrl}
              alt="Channel profile"
              className="max-w-12"
            />
            <h2 className="font-medium text-3xl text-blue-950">
              {channelInfo.name}
            </h2>
          </div>
          <p className="font-medium max-w-[75%]">{channelInfo.description}</p>
        </div>
      )}
    </div>
  );
};

export default TwitchLiveStreams;
