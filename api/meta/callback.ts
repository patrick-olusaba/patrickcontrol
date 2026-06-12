// ============================================================
// Vercel Serverless — Meta OAuth Callback
// GET /api/meta/callback?code=xxx&state=instagram|facebook
// Exchanges code for token, stores in Firestore
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const META_APP_ID = process.env.VITE_META_APP_ID || process.env.META_APP_ID || '';
const META_APP_SECRET = process.env.META_APP_SECRET || '';
const APP_URL = process.env.VITE_APP_URL || 'https://patrickcontrol.vercel.app';
const REDIRECT_URI = APP_URL + '/api/meta/callback';

// Firebase Admin — init once
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
  const code = req.query.code as string;
  const platform = (req.query.state as string) || 'instagram';

  if (!code) {
    return res.redirect(302, `${APP_URL}/settings?error=no_code`);
  }

  if (!META_APP_SECRET) {
    console.error('META_APP_SECRET not configured');
    return res.redirect(302, `${APP_URL}/settings?error=config`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${META_APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json() as any;

    if (tokenData.error) {
      console.error('Token exchange failed:', tokenData.error);
      return res.redirect(302, `${APP_URL}/settings?error=token&msg=${encodeURIComponent(tokenData.error.message || '')}`);
    }

    const shortToken = tokenData.access_token;

    // Exchange for long-lived token (60 days)
    const longRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const longData = await longRes.json() as any;
    const longToken = longData.access_token || shortToken;
    const expiresIn = longData.expires_in || 5184000; // ~60 days

    // Get user pages + Instagram business account
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${longToken}`
    );
    const pagesData = await pagesRes.json() as any;

    let instagramAccount = null;
    if (platform === 'instagram' && pagesData.data?.length > 0) {
      // Get Instagram account linked to first page
      for (const page of pagesData.data) {
        const igRes = await fetch(
          `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account{id,username,followers_count}&access_token=${longToken}`
        );
        const igData = await igRes.json() as any;
        if (igData.instagram_business_account) {
          instagramAccount = {
            id: igData.instagram_business_account.id,
            username: igData.instagram_business_account.username,
            followers: igData.instagram_business_account.followers_count || 0,
          };
          break;
        }
      }
    }

    // Store token in Firestore
    try {
      const db = getAdminDb();
      await db.collection('meta_tokens').doc(platform).set({
        platform,
        accessToken: longToken,
        expiresAt: Date.now() + (expiresIn * 1000),
        instagramAccount,
        pages: pagesData.data || [],
        updatedAt: new Date().toISOString(),
      });

      // Also update the settings connected account
      const handle = platform === 'instagram' && instagramAccount
        ? `@${instagramAccount.username}`
        : platform === 'facebook'
          ? (pagesData.data?.[0]?.name || 'Facebook Page')
          : '';
      const followers = platform === 'instagram' && instagramAccount
        ? instagramAccount.followers
        : 0;

      await db.collection('settings').doc('user').update({
        [`connectedAccounts.${platform === 'instagram' ? 0 : 2}`]: {
          platform,
          handle,
          connected: true,
          followers,
        },
      });
    } catch (dbErr) {
      console.error('Firestore write failed (token still valid):', dbErr);
    }

    return res.redirect(302, `${APP_URL}/settings?success=${platform}`);
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    return res.redirect(302, `${APP_URL}/settings?error=server&msg=${encodeURIComponent(err.message || '')}`);
  }
}
