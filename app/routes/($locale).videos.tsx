import {LoaderFunctionArgs, json} from '@shopify/remix-oxygen';
import {lazy} from 'react';
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import TwitchLiveStreams from '~/components/VideoCards/TwitchLive';
// import YTPlaylist1 from '~/components/VideoCards/YTPlaylist1';
// import YTPlaylist2 from '~/components/VideoCards/YTPlaylist2';
// import YTPlaylist3 from '~/components/VideoCards/YTPlaylist3';
// import YTPlaylist4 from '~/components/VideoCards/YTPlaylist4';
// import YTShortsPlaylist from '~/components/VideoCards/YTShortsPlaylist';
// import YTShortsPlaylist2 from '~/components/VideoCards/YTShortsPlaylist2';
import {
  TwitchStreamsResponse,
  TwitchTokenResponse,
  TwitchUsersResponse,
  TwitchVideosResponse,
  Video,
  VideoDetailsResponse,
  PlaylistDetailsResponse,
  PlaylistItemsResponse,
} from '~/components/VideoCards/videoTypes';

// const TwitchLiveStreams = lazy(
//   () => import('../components/VideoCards/TwitchLive'),
// );
const YTPlaylist1 = lazy(() => import('../components/VideoCards/YTPlaylist1'));
const YTPlaylist2 = lazy(() => import('../components/VideoCards/YTPlaylist2'));
const YTPlaylist3 = lazy(() => import('../components/VideoCards/YTPlaylist3'));
const YTPlaylist4 = lazy(() => import('../components/VideoCards/YTPlaylist4'));
const YTShortsPlaylist = lazy(
  () => import('../components/VideoCards/YTShortsPlaylist'),
);

// Loads all video data by fetching from the respective API for each source. All data to be obtained is editable from this loader. No edits to the other components in this folder are necessary.
export const loader = async ({context}: LoaderFunctionArgs) => {
  const clientId = context.env.TWITCH_CLIENT_ID;
  const clientSecret = context.env.TWITCH_CLIENT_SECRET;

  // YOUTUBE DATA FETCHING *****************
  const YOUTUBE_API = context.env.YOUTUBE_API;

  //********** IMPORTANT ************/
  // The playlist ID is simply all of the text after the following part of the playlist's url: "https://www.youtube.com/playlist?list="
  // Change the playlist to be featured easily by just updating the string for each ID. Shorts must go in the shortsPlaylistId section due to rendering conditions.
  // the Array in the shortsPlaylistId must be separated by commas and then must be represented in the playlist_ids as "playlistShorts1: shortsPlaylistId[ArrayLocation],"
  // Arrays start from 0 as the first item.
  const shortsPlaylistId = [
    'PLzgC_gpyRTz_t9mCNhEFZcpFdItQhNspU', // New Releases Shorts
    // 'PLzgC_gpyRTz-nwM-gqhR--toEOmzjThW5', //gameClips shorts playlist
  ];
  const PLAYLIST_IDS = {
    playlist1: 'PLzgC_gpyRTz9SaT3XPPHiW0S8o37RZsN3', // Game Stream Playlist
    playlist2: 'PLzgC_gpyRTz-_NHPf1FoNcvf0h0LJyRv0', // Behind the Hype
    playlist3: 'PLzgC_gpyRTz9I6LTzfwVN5kH2hu4C2JjY', // Beyond the Box
    playlist4: 'PLzgC_gpyRTz9uwmoWyMDGHLDEl0LyN3XG', // Other Streams
    playlistShorts1: shortsPlaylistId[0],
    // playlistShorts2: shortsPlaylistId[1],
  };

  // Helper function for YouTube API requests
  async function fetchYouTubeData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API request failed: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  }

  // Fetch YouTube playlist details and videos
  async function fetchYouTubePlaylistData(playlistId: string) {
    const details = await fetchYouTubeData<PlaylistDetailsResponse>(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API}`,
    );
    const maxResults = shortsPlaylistId.includes(playlistId) ? 10 : 3;
    const items = await fetchYouTubeData<PlaylistItemsResponse>(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${YOUTUBE_API}`,
    );

    // Map through each playlist item to fetch individual video details
    const videoDetailsPromises = items.items.map((item) =>
      fetchYouTubeData<VideoDetailsResponse>(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${item.snippet.resourceId.videoId}&key=${YOUTUBE_API}`,
      ),
    );
    const videosDetails = await Promise.all(videoDetailsPromises);

    // Map through fetched video details to construct video objects
    const videos: Video[] = videosDetails.map((response) => {
      const video = response.items[0];
      return {
        title: video.snippet.title,
        thumbnailUrl: video.snippet.thumbnails.default.url,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
      };
    });

    return {
      id: playlistId,
      details: details.items[0]?.snippet,
      videos: videos,
    };
  }

  // Parallel fetch for all playlists
  const youtubeDataPromises = Object.entries(PLAYLIST_IDS).map(([key, id]) =>
    fetchYouTubePlaylistData(id).then((data) => ({[key]: data})),
  );
  const youtubeDataResults = await Promise.all(youtubeDataPromises);
  const youtubeData = youtubeDataResults.reduce(
    (acc, curr) => ({...acc, ...curr}),
    {},
  );
  // TWITCH DATA FETCHING ***********************
  try {
    // Fetch the OAuth token
    const tokenResponse = await fetch(
      'https://id.twitch.tv/oauth2/token?grant_type=client_credentials',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&client_secret=${clientSecret}`,
      },
    );

    if (!tokenResponse.ok) throw new Error('Token request failed');
    const {access_token} = (await tokenResponse.json()) as TwitchTokenResponse;

    // Fetch user information
    const usersResponse = await fetch(
      `https://api.twitch.tv/helix/users?login=cooledtured`,
      {
        headers: {
          'Client-ID': clientId,
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!usersResponse.ok) throw new Error('Users request failed');
    const usersData = (await usersResponse.json()) as TwitchUsersResponse;
    const user = usersData.data[0];

    // Fetch stream information
    const streamsResponse = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=cooledtured`,
      {
        headers: {
          'Client-ID': clientId,
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    let mostRecentStream = undefined;
    if (!streamsResponse.ok) throw new Error('Streams request failed');
    const streamsData = (await streamsResponse.json()) as TwitchStreamsResponse;

    if (streamsData.data.length === 0) {
      // Fetch the most recent video if the channel is offline
      const videosResponse = await fetch(
        `https://api.twitch.tv/helix/videos?user_id=${user.id}&first=1&sort=time`,
        {
          headers: {
            'Client-ID': clientId,
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!videosResponse.ok) throw new Error('Videos request failed');
      const videosData = (await videosResponse.json()) as TwitchVideosResponse;
      if (videosData.data.length > 0) {
        const video = videosData.data[0];
        mostRecentStream = {
          title: video.title,
          description: video.description,
          url: video.url,
          id: video.id,
        };
      }
    }

    return json({
      twitch: {
        channelInfo: {
          name: user.display_name,
          description: user.description,
          profileImageUrl: user.profile_image_url,
        },
        isLive: streamsData.data.length > 0,
        connectionStatus: 'success',
        mostRecentStream,
      },
      youtube: youtubeData,
    });
  } catch (error) {
    console.error(error);
    return json(
      {channelInfo: null, isLive: false, connectionStatus: 'failed'},
      {status: 500},
    );
  }
};

export default function Videos() {
  let parentDomain;
  // Check if the code is running in a browser environment
  if (typeof window !== 'undefined') {
    switch (window.location.hostname) {
      case 'cooledtured.com':
        parentDomain = 'cooledtured.com';
        break;
      case 'animetoy.store':
        parentDomain = 'animetoy.store';
        break;
      default:
        parentDomain = 'cooledtured-f1446a4bee15c739426f.o2.myshopify.dev';
        break;
    }
  } else {
    // Default or server-side specific logic here
    parentDomain = 'cooledtured-f1446a4bee15c739426f.o2.myshopify.dev';
  }

  const handleRedirect = (url: string | URL | undefined) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url(/images/cooledtured-bg-site.webp)',
        backgroundBlendMode: 'multiply',
      }}
      className="bg-gray-600 bg-opacity-90 flex flex-col pb-8 bg-fixed object-cover"
    >
      <div className="flex justify-center gap-2 flex-col items-center p-2 sm:p-10 bg-gray-600 max-w-[102rem] mx-auto border-b-4 border-b-black 2xl:border-4 border-black 2xl:rounded-xl">
        <div className="-mb-4 xs:mb-4 sm:mb-0 xs:top-4 sm:top-auto flex justify-center items-center relative">
          <div className="bg-black w-screen  max-w-[102rem] overflow-visible absolute h-20 z-0 -translate-y-2 glow-effect" />
          <h1 className="text-blue-950 p-2 xs:p-6 bg-gray-400 rounded-b-2xl border-[6px] border-black text-4xl xs:text-5xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold relative">
            Watch with COOLEDTURED
          </h1>
        </div>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 place-items-center xl:place-items-start h-full w-full">
          <div
            className="lg:col-span-2 bg-gray-600 bg-blend-multiply border-4 border-black p-1 h-full rounded-b-xl bg-fixed"
            style={{
              backgroundImage: `url('/images/cooledtured-bg-site.webp')`,
            }}
          >
            <TwitchLiveStreams parentDomain={parentDomain} />
          </div>
          <div className="flex flex-col place-items-center col-span-1 h-full">
            <h2 className=" text-2xl font-medium mb-1 border-[6px] border-black text-center bg-blue-950 text-gray-200 w-full py-4 px-2 rounded-t-2xl lg:mx-auto lg:max-w-[31.75ch]">
              Discover our Community
            </h2>
            <div
              className="bg-gray-600 bg-blend-multiply border-4 border-black p-1 h-full rounded-b-xl bg-fixed"
              style={{
                backgroundImage: `url('/images/cooledtured-bg-site.webp')`,
              }}
            >
              <p className="indent-4 mx-auto flex flex-col h-full place-content-between bg-gray-900 bg-opacity-70 lg:max-w-[60ch]">
                <p className="md:px-8 lg:px-4  bg-gray-400 p-4 border-2 border-black font-medium  text-lg lg:text-sm mlg:text-base xl:text-lg">
                  <em className="font-bold text-lg lg:text-base mlg:text-lg xl:text-xl">
                    Ready
                  </em>{' '}
                  to immerse yourself in the world of cooledtured? Buckle up and
                  hit play on our captivating video collection. From inspiring
                  stories to behind-the-scenes glimpses, we've got something to
                  ignite your curiosity and fuel your creativity!
                </p>
                <br />
                <p className="md:px-8 lg:px-4 bg-gray-400 rounded-b-2xl p-4 border-2 border-black font-medium text-lg lg:text-sm mlg:text-base xl:text-lg">
                  Our video library is your gateway to a world of
                  wonder. Uncover hidden gems, revisit old favorites, and
                  discover new perspectives – all at your fingertips. So grab
                  your popcorn (or your preferred viewing snack), get comfy, and
                  let the cooledtured video adventure begin!
                </p>
              </p>
            </div>
          </div>
        </section>
        <div className="flex justify-center sm:mt-4 sm:mb-2 md:mb-4 gap-7 text-4xl sm:text-5xl align-middle items-center flex-nowrap relative">
          <div className="bg-black w-screen  max-w-[102rem] overflow-visible absolute h-16 z-0 -translate-y-2 border-2 border-blue-950" />
          <div className="flex relative justify-center mt-4 mb-8 gap-7 text-4xl sm:text-5xl align-middle items-center flex-nowrap bg-gray-400 rounded-3xl py-1.5 px-6 border-2 border-blue-950 glow-effect">
            <FaFacebook
              alt="Facebook"
              className="text-blue-600 cursor-pointer transition-transform duration-300 transform hover:scale-110 active:scale-95"
              onClick={() => handleRedirect('https://facebook.com/cooledtured')}
            />

            <FaYoutube
              alt="Youtube"
              className="text-red-600 cursor-pointer transition-transform duration-300 transform hover:scale-110 active:scale-95"
              onClick={() =>
                handleRedirect('https://www.youtube.com/@cooledtured')
              }
            />
            <FaTiktok
              alt="TikTok"
              className="cursor-pointer transition-transform duration-300 transform hover:scale-110 active:scale-95"
              onClick={() => handleRedirect('https://tiktok.com/@cooledtured/')}
            />
            <FaInstagram
              alt="Instagram"
              className="text-[#c13584] cursor-pointer transition-transform duration-300 transform hover:scale-110 active:scale-95"
              onClick={() => handleRedirect('https://instagram.com/cooledture')}
            />

            <FaDiscord
              alt="Discord"
              className="text-[#4e59db] cursor-pointer transition-transform duration-300 transform hover:scale-110 active:scale-95"
              onClick={() => handleRedirect('https://discord.gg/Pd2wgZaWac')}
            />
          </div>
        </div>

        <div className="flex items-center w-full justify-center">
          <div className="flex-grow border-t-[0.05rem] border-slate-700"></div>
          <span className="px-4 font-medium text-slate-800 text-center">
            Check out more Content!
          </span>
          <div className="flex-grow border-t-[0.05rem] border-slate-700"></div>
        </div>
      </div>
      <YTPlaylist1 />
      {/* <TikTok /> Currently unavailable - API requires mutiple steps */}
      <YTPlaylist2 />
      <YTPlaylist3 />
      <YTPlaylist4 />
      <YTShortsPlaylist />
      {/* <YTShortsPlaylist2 /> */}

      {/* <TwitchVideos /> */}
    </div>
  );
}
