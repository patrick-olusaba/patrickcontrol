// ============================================================
// PatrickControl – Firebase Config & Firestore Helpers
// ============================================================

import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  type Firestore,
} from 'firebase/firestore';
import type {
  Post,
  Comment,
  Hashtag,
  TeamMember,
  HashtagBundle,
  PublishedPost,
  PostTemplate,
  AppSettings,
} from '../types/types';

// ── Firebase Config ─────────────────────────────────────────
// Read from environment variables (Vercel or .env.local)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

function getDb(): Firestore {
  if (!db) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

/** Returns true if Firebase is configured with real credentials */
export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY';
}

// ── Posts ───────────────────────────────────────────────────
export async function fbGetPosts(): Promise<Post[]> {
  const q = query(collection(getDb(), 'posts'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
}

export async function fbAddPost(post: Post): Promise<void> {
  await setDoc(doc(getDb(), 'posts', post.id), post);
}

export async function fbUpdatePost(post: Post): Promise<void> {
  await setDoc(doc(getDb(), 'posts', post.id), post, { merge: true });
}

export async function fbDeletePost(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'posts', id));
}

// ── Comments ────────────────────────────────────────────────
export async function fbGetComments(): Promise<Comment[]> {
  const q = query(collection(getDb(), 'comments'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
}

export async function fbUpdateComment(id: string, data: Partial<Comment>): Promise<void> {
  await setDoc(doc(getDb(), 'comments', id), data, { merge: true });
}

// ── Hashtags ────────────────────────────────────────────────
export async function fbGetHashtags(): Promise<Hashtag[]> {
  const snap = await getDocs(collection(getDb(), 'hashtags'));
  return snap.docs.map((d) => d.data() as Hashtag);
}

// ── Hashtag Bundles ─────────────────────────────────────────
export async function fbGetBundles(): Promise<HashtagBundle[]> {
  const snap = await getDocs(collection(getDb(), 'bundles'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HashtagBundle));
}

// ── Templates ───────────────────────────────────────────────
export async function fbGetTemplates(): Promise<PostTemplate[]> {
  const snap = await getDocs(collection(getDb(), 'templates'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PostTemplate));
}

export async function fbAddTemplate(tpl: PostTemplate): Promise<void> {
  await setDoc(doc(getDb(), 'templates', tpl.id), tpl);
}

export async function fbDeleteTemplate(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'templates', id));
}

// ── Published Posts ─────────────────────────────────────────
export async function fbGetPublished(): Promise<PublishedPost[]> {
  const snap = await getDocs(collection(getDb(), 'published'));
  return snap.docs.map((d) => d.data() as PublishedPost);
}

// ── Team ────────────────────────────────────────────────────
export async function fbGetTeam(): Promise<TeamMember[]> {
  const snap = await getDocs(collection(getDb(), 'team'));
  return snap.docs.map((d) => d.data() as TeamMember);
}

// ── Settings ────────────────────────────────────────────────
export async function fbGetSettings(): Promise<AppSettings | null> {
  const snap = await getDoc(doc(getDb(), 'settings', 'user'));
  return snap.exists() ? (snap.data() as AppSettings) : null;
}

export async function fbSaveSettings(settings: AppSettings): Promise<void> {
  await setDoc(doc(getDb(), 'settings', 'user'), settings);
}

// ── Seed initial data ───────────────────────────────────────
export async function fbSeedIfEmpty(): Promise<boolean> {
  const snap = await getDocs(collection(getDb(), 'posts'));
  if (!snap.empty) return false; // Already has data

  // Seed posts, comments, hashtags, etc. from mock data
  const { fetchPosts, fetchComments, fetchHashtags, fetchTeamMembers, fetchHashtagBundles, fetchTemplates, fetchPublishedPosts, fetchSettings } = await import('./mockData');

  const [posts, comments, hashtags, team, bundles, templates, published, settings] =
    await Promise.all([
      fetchPosts(), fetchComments(), fetchHashtags(), fetchTeamMembers(),
      fetchHashtagBundles(), fetchTemplates(), fetchPublishedPosts(), fetchSettings(),
    ]);

  const batch = [
    ...posts.map((p) => setDoc(doc(getDb(), 'posts', p.id), p)),
    ...comments.map((c) => setDoc(doc(getDb(), 'comments', c.id), c)),
    ...hashtags.map((h) => setDoc(doc(getDb(), 'hashtags', h.tag), h)),
    ...team.map((t) => setDoc(doc(getDb(), 'team', t.id), t)),
    ...bundles.map((b) => setDoc(doc(getDb(), 'bundles', b.id), b)),
    ...templates.map((t) => setDoc(doc(getDb(), 'templates', t.id), t)),
    ...published.map((p) => setDoc(doc(getDb(), 'published', p.id), p)),
    setDoc(doc(getDb(), 'settings', 'user'), settings),
  ];

  await Promise.all(batch);
  return true;
}
