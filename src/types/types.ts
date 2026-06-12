// ============================================================
// PatrickControl – Shared TypeScript Types
// ============================================================

export type Platform = 'instagram' | 'tiktok' | 'facebook' | 'whatsapp';
export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface Post {
  id: string;
  caption: string;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt?: string;   // ISO date string
  hashtags: string[];
  mediaUrl?: string;      // local object URL for preview
  mediaType?: 'image' | 'video';
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  platform: Platform;
  postId?: string;
  createdAt: string;
  replied?: boolean;
}

export interface Hashtag {
  tag: string;
  reach: number;       // raw number, e.g. 12400
  displayReach: string; // formatted, e.g. "12.4K"
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

export interface DashboardMetrics {
  scheduledPosts: number;
  drafts: number;
  newComments: number;
  totalReach: string;
  pendingApprovals: number;
}

export interface HashtagBundle {
  id: string;
  name: string;
  tags: string[];
}

export interface PostTemplate {
  id: string;
  name: string;
  caption: string;
  hashtags: string[];
  platforms: Platform[];
  createdAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  postId: string;
  caption: string;
  createdAt: string;
}

export interface PublishedStats {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}

export interface PublishedPost extends Post {
  stats: PublishedStats;
  publishedAt: string;
}

export interface AppSettings {
  profileName: string;
  profileBio: string;
  profileAvatar: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoSchedule: boolean;
  connectedAccounts: ConnectedAccount[];
}

export interface ConnectedAccount {
  platform: Platform;
  handle: string;
  connected: boolean;
  followers: number;
}
