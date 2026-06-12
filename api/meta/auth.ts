// ============================================================
// Vercel Serverless — Meta OAuth Redirect
// GET /api/meta/auth?platform=instagram|facebook
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

const META_APP_ID = process.env.VITE_META_APP_ID || process.env.META_APP_ID || '';
const META_APP_SECRET = process.env.META_APP_SECRET || '';
const REDIRECT_URI = (process.env.VITE_APP_URL || 'https://patrickcontrol.vercel.app') + '/api/meta/callback';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const platform = (req.query.platform as string) || 'instagram';

  if (!META_APP_ID) {
    return res.status(500).json({ error: 'Meta App ID not configured. Add META_APP_ID env var.' });
  }

  // Instagram needs these permissions, Facebook uses pages_*
  const scopes = platform === 'instagram'
    ? 'instagram_basic,pages_show_list,pages_read_engagement,instagram_content_publish'
    : 'pages_show_list,pages_read_engagement,pages_manage_posts,pages_read_user_content';

  const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&response_type=code&state=${platform}`;

  res.redirect(302, fbAuthUrl);
}
