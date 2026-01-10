
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
  gems: number;
  followersCount: number;
  followingCount: number;
}

export interface SiteSettings {
  name: string;
  title: string;
  iconUrl: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'REEL';
  content: string;
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  timestamp: string;
  isVerified?: boolean;
  location?: string;
  tags?: string[];
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  image: string;
  isFollowed?: boolean;
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

export interface MicSlot {
  id: number;
  userId: string | null;
  username?: string;
  avatar?: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isVideoOn?: boolean;
  stream?: MediaStream;
  status?: 'connecting' | 'connected' | 'disconnected';
}
