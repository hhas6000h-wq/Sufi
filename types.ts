
export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER'
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: UserRole;
  isFollowing: boolean;
  isMuted: boolean;
  isBanned: boolean;
  isVerified?: boolean;
  points: number;
  gems: number; // Added to fix Auth.tsx missing property error
  followersCount: number;
  followingCount: number;
  followingList: string[];
}

export interface SiteSettings {
  name: string;
  title: string; // Added to fix App.tsx error
  iconUrl: string; // Added to fix App.tsx error
  chatBackground: string;
  broadcast: { // Added to fix App.tsx error
    serverUrl: string;
    streamKey: string;
    quality: string;
    latencyMode: string;
    maxViewers: number;
    isPublic: boolean;
    broadcastTitle: string;
  };
  broadcastSettings: {
    quality: string;
    isPublic: boolean;
  };
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text?: string;
  imageUrl?: string;
  timestamp: string;
  role: UserRole;
  isVerified?: boolean;
}

export interface DirectMessage extends Message {
  receiverId: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  type: 'IMAGE' | 'TEXT' | 'REEL';
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: Comment[]; // Updated from any[] to use Comment interface
  isLiked: boolean;
  isSaved?: boolean; // Added to fix Home.tsx error
  timestamp: string;
  isVerified?: boolean;
  hashtags?: string[];
  mentions?: string[];
}

export interface MicSlot {
  id: number;
  userId: string | null;
  username?: string;
  avatar?: string;
  isMuted: boolean;
  isSpeaking: boolean;
}

export interface LiveStream {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  viewerCount: number;
  title: string;
  isLive: boolean;
}
