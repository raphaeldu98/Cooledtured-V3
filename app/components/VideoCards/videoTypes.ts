// Types.ts
export type Video = {
  title: string;
  thumbnailUrl: string;
  embedUrl: string;
  channelTitle: string;
  publishedAt: string;
};

export type PlaylistDetail = {
  title: string;
  description: string;
  id: string;
};

export type VideoDetailsResponse = {
  items: Array<{
    id: string;
    snippet: {
      publishedAt: string;
      channelTitle: string;
      title: string;
      thumbnails: {
        default: {
          url: string;
        };
      };
    };
  }>;
};

export type PlaylistDetailsResponse = {
  items: Array<{
    snippet: {
      title: string;
      description: string;
    };
  }>;
};

export type PlaylistItemsResponse = {
  items: Array<{
    snippet: {
      resourceId: {
        videoId: string;
      };
    };
  }>;
};

// Define a more accurate type for the loader's return data that includes
// multiple playlists by their keys
export type LoaderData = {
  twitch: {
    channelInfo: {
      name: string;
      description: string;
      profileImageUrl: string;
    };
    isLive: boolean;
    connectionStatus: 'success' | 'failed';
    mostRecentStream?: {
      title: string;
      description: string;
      url: string;
      id: string;
    };
  };
  youtube: {
    [key: string]: { // This syntax allows for dynamic keys such as playlist1, playlist2, etc.
      details: PlaylistDetail;
      videos: Video[];
      id: string
    };
  };
};


  //************************* TWITCH TYPES *****************/
  export type TwitchUser = {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
  }
  
  export type TwitchUsersResponse = {
    data: TwitchUser[];
  }
  
  export type TwitchStream = {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
  }
  
  export type TwitchStreamsResponse = {
    data: TwitchStream[];
  }
  
  export type ChannelInfo = {
    name: string;
    description: string;
    profileImageUrl: string;
  }
  
  export type TwitchDataState = {
  isLive: boolean;
  channelInfo: {
    name: string;
    description: string;
    profileImageUrl: string;
  } | null;
  connectionStatus: 'connecting' | 'success' | 'failed';
  mostRecentStream?: {
    title: string;
    description: string;
    url: string;
    id: string;
  };
  streamTitle?: string;
  streamDescription?: string;
}


  export type TwitchTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
  }
  
  export type TwitchVideo = {
    id: string;
    user_id: string;
    user_name: string;
    title: string;
    description: string;
    created_at: string;
    url: string;
    thumbnail_url: string;
    view_count: number;
    duration: string;
  }
  
  export type TwitchVideosResponse = {
    data: TwitchVideo[];
  }