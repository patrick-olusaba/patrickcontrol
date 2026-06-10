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
