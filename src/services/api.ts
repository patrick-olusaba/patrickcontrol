// ============================================================
// PatrickControl – API Layer
// Switches between Firebase (real) and Mock (fallback)
// ============================================================

import type {
  Post, Comment, Hashtag, TeamMember, HashtagBundle,
  PublishedPost, PostTemplate, MediaItem, AppSettings,
} from '../types/types';

import {
  fetchPosts, fetchComments, fetchHashtags, fetchTeamMembers,
  fetchHashtagBundles, fetchTemplates, fetchPublishedPosts,
  fetchMediaItems, fetchSettings,
} from './mockData';

import {
  isFirebaseConfigured,
  fbGetPosts, fbAddPost, fbUpdatePost, fbDeletePost,
  fbGetComments, fbUpdateComment,
  fbGetHashtags, fbGetBundles, fbGetTemplates, fbAddTemplate,
  fbDeleteTemplate, fbGetPublished, fbGetTeam, fbGetSettings,
  fbSaveSettings, fbSeedIfEmpty,
} from './firebase';

let seeded = false;

async function ensureSeeded() {
  if (!isFirebaseConfigured() || seeded) return;
  const didSeed = await fbSeedIfEmpty();
  if (didSeed) seeded = true;
}

// ── Posts ───────────────────────────────────────────────────
export async function apiGetPosts(): Promise<Post[]> {
  if (!isFirebaseConfigured()) return fetchPosts();
  await ensureSeeded();
  return fbGetPosts();
}

export async function apiAddPost(post: Post): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await fbAddPost(post);
}

export async function apiUpdatePost(post: Post): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await fbUpdatePost(post);
}

export async function apiDeletePost(id: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await fbDeletePost(id);
}

// ── Comments ────────────────────────────────────────────────
export async function apiGetComments(): Promise<Comment[]> {
  if (!isFirebaseConfigured()) return fetchComments();
  await ensureSeeded();
  return fbGetComments();
}

export async function apiReplyComment(id: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await fbUpdateComment(id, { replied: true });
}

// ── Hashtags ────────────────────────────────────────────────
export async function apiGetHashtags(): Promise<Hashtag[]> {
  if (!isFirebaseConfigured()) return fetchHashtags();
  await ensureSeeded();
  return fbGetHashtags();
}

// ── Bundles ─────────────────────────────────────────────────
export async function apiGetBundles(): Promise<HashtagBundle[]> {
  if (!isFirebaseConfigured()) return fetchHashtagBundles();
  await ensureSeeded();
  return fbGetBundles();
}

// ── Templates ───────────────────────────────────────────────
export async function apiGetTemplates(): Promise<PostTemplate[]> {
  if (!isFirebaseConfigured()) return fetchTemplates();
  await ensureSeeded();
  return fbGetTemplates();
}

export async function apiAddTemplate(tpl: PostTemplate): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await fbAddTemplate(tpl);
}

export async function apiDeleteTemplate(id: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await fbDeleteTemplate(id);
}

// ── Published Posts ─────────────────────────────────────────
export async function apiGetPublished(): Promise<PublishedPost[]> {
  if (!isFirebaseConfigured()) return fetchPublishedPosts();
  await ensureSeeded();
  return fbGetPublished();
}

// ── Team ────────────────────────────────────────────────────
export async function apiGetTeam(): Promise<TeamMember[]> {
  if (!isFirebaseConfigured()) return fetchTeamMembers();
  await ensureSeeded();
  return fbGetTeam();
}

// ── Media ───────────────────────────────────────────────────
export async function apiGetMedia(): Promise<MediaItem[]> {
  return fetchMediaItems(); // Media stays mock for now (needs Storage buckets)
}

// ── Settings ────────────────────────────────────────────────
export async function apiGetSettings(): Promise<AppSettings> {
  if (!isFirebaseConfigured()) return fetchSettings();
  const fb = await fbGetSettings();
  return fb ?? fetchSettings();
}

export async function apiSaveSettings(settings: AppSettings): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await fbSaveSettings(settings);
}
