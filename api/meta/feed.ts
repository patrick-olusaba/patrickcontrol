// ============================================================
// Vercel Serverless — Get Instagram / Facebook Feed
// GET /api/meta/feed?platform=instagram|facebook
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminDb() {
  if (!getApps().length) {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    if (key) {
      initializeApp({
        credential: cert({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: key.replace(/\\n/g, '\n'),
        }),
      });
    }
  }
  return getFirestore();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const platform = (req.query.platform as string) || 'instagram';

  try {
    const db = getAdminDb();
    const tokenDoc = await db.collection('meta_tokens').doc(platform).get();

    if (!tokenDoc.exists) {
      return res.json({ posts: [], error: 'Not connected. Go to Settings to connect.' });
    }

    const tokenData = tokenDoc.data()!;
    const accessToken = tokenData.accessToken;

    if (platform === 'instagram') {
      const igId = tokenData.instagramAccount?.id;
      if (!igId) return res.json({ posts: [], error: 'No Instagram business account found.' });

      // Fetch recent media
      const mediaRes = await fetch(
        `https://graph.facebook.com/v21.0/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=12&access_token=${accessToken}`
      );
      const mediaData = await mediaRes.json() as any;

      return res.json({
        platform: 'instagram',
        handle: tokenData.instagramAccount?.username || '',
        posts: (mediaData.data || []).map((m: any) => ({
          id: m.id,
          caption: m.caption || '',
          type: m.media_type,
          url: m.media_url || m.thumbnail_url || '',
          permalink: m.permalink || '',
          timestamp: m.timestamp || '',
          likes: m.like_count || 0,
          comments: m.comments_count || 0,
        })),
      });
    }

    if (platform === 'facebook') {
      const pageId = tokenData.pages?.[0]?.id;
      if (!pageId) return res.json({ posts: [], error: 'No Facebook page found.' });

      const feedRes = await fetch(
        `https://graph.facebook.com/v21.0/${pageId}/feed?fields=id,message,created_time,permalink_url,shares,likes.limit(0).summary(true),comments.limit(0).summary(true)&limit=12&access_token=${accessToken}`
      );
      const feedData = await feedRes.json() as any;

      return res.json({
        platform: 'facebook',
        handle: tokenData.pages?.[0]?.name || '',
        posts: (feedData.data || []).map((p: any) => ({
          id: p.id,
          caption: p.message || '',
          type: 'text',
          url: '',
          permalink: p.permalink_url || '',
          timestamp: p.created_time || '',
          likes: p.likes?.summary?.total_count || 0,
          comments: p.comments?.summary?.total_count || 0,
          shares: p.shares?.count || 0,
        })),
      });
    }

    return res.json({ posts: [], error: 'Unknown platform' });
  } catch (err: any) {
    console.error('Feed fetch error:', err);
    return res.json({ posts: [], error: err.message });
  }
}
