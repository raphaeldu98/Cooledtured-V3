// Fetcher.tsx
import {useEffect} from 'react';
import {
  PlaylistDetail,
  PlaylistDetailsResponse,
  PlaylistItemsResponse,
  Video,
  VideoDetailsResponse,
  shortsPlaylistId,
} from './videoTypes';

type FetcherProps = {
  playlistId: string;
  setVideos: (videos: Video[]) => void;
  setPlaylistDetail: (detail: PlaylistDetail) => void;
};

const Fetcher: React.FC<FetcherProps> = ({
  playlistId,
  setVideos,
  setPlaylistDetail,
}) => {
  const API_KEY = 'AIzaSyBS5MgXXmmyGrdg9B6FxVXHeCLriejxDRI'; // Place your API key here

  useEffect(() => {
    fetchPlaylistDetails();
    fetchPlaylistVideos();
  }, [playlistId]);

  const fetchPlaylistDetails = async () => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`,
    );
    const data: PlaylistDetailsResponse =
      (await response.json()) as PlaylistDetailsResponse;
    if (data.items.length > 0) {
      const {title, description} = data.items[0].snippet;
      setPlaylistDetail({title, description});
    }
  };

  const fetchPlaylistVideos = async () => {
    const maxResults = playlistId === shortsPlaylistId ? 12 : 3; // Conditional maxResults based on isShortsPlaylist
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`,
    );
    const data: PlaylistItemsResponse =
      (await response.json()) as PlaylistItemsResponse;
    const videoIds = data.items
      .map((item) => item.snippet.resourceId.videoId)
      .join(',');
    fetchVideoDetails(videoIds);
  };

  const fetchVideoDetails = async (videoIds: string) => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${API_KEY}`,
    );
    const data: VideoDetailsResponse =
      (await response.json()) as VideoDetailsResponse;
    const videos: Video[] = data.items.map((item) => ({
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.default.url,
      embedUrl: `https://www.youtube.com/embed/${item.id}`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));
    setVideos(videos);
  };

  return null; // This component does not render anything
};
export default Fetcher;
