// ============================================================
// Social Media Hub – Published Posts
// Card grid showing all published posts with performance stats
// ============================================================

import React, { useEffect, useState } from 'react';
import type { PublishedPost } from '../types/types';
import { apiGetPublished } from '../services/api';
import { PlatformIcon } from './platforms';
import './PublishedPosts.css';

function formatStat(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

const PublishedPosts: React.FC = () => {
  const [published, setPublished] = useState<PublishedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetPublished().then((data) => {
      setPublished(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <div className="page-header"><div><h2>Published</h2></div></div>
        <div className="page-body"><div className="loading-shell">
          <div className="skeleton-metrics">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton skeleton-card" style={{ height: 200 }} />))}</div>
        </div></div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Published Posts</h2>
          <p>{published.length} posts live across platforms</p>
        </div>
      </div>

      <div className="page-body">
        {published.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🚀</div><p>No published posts yet.</p></div>
        ) : (
          <div className="published-grid">
            {published.map((post) => {
              const pubDate = new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <div key={post.id} className="pub-card card">
                  <div className="pub-card-image">
                    {post.mediaUrl ? (
                      <img src={post.mediaUrl} alt="" />
                    ) : (
                      <div className="pub-no-media">📝</div>
                    )}
                    <span className="pub-badge">Published</span>
                  </div>
                  <div className="pub-card-body">
                    <p className="pub-caption">{post.caption.slice(0, 100)}{post.caption.length > 100 ? '…' : ''}</p>
                    <div className="pub-platforms">
                      {post.platforms.map((pl) => (
                        <span key={pl} className="pub-platform-tag"><PlatformIcon platform={pl} size={12} /> {pl}</span>
                      ))}
                    </div>
                    <p className="pub-date">📅 {pubDate}</p>
                  </div>
                  <div className="pub-card-stats">
                    {[
                      { label: 'Likes', value: post.stats.likes, icon: '❤️' },
                      { label: 'Comments', value: post.stats.comments, icon: '💬' },
                      { label: 'Shares', value: post.stats.shares, icon: '🔄' },
                      { label: 'Reach', value: post.stats.reach, icon: '👁' },
                    ].map((s) => (
                      <div key={s.label} className="pub-stat">
                        <span className="pub-stat-icon">{s.icon}</span>
                        <span className="pub-stat-val">{formatStat(s.value)}</span>
                        <span className="pub-stat-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default PublishedPosts;
