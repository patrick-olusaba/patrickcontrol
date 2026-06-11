// ============================================================
// Social Media Hub – Media Library
// Gallery of all uploaded images/videos, click to copy or view
// ============================================================

import React, { useEffect, useState } from 'react';
import { useAppContext } from './AppContext';
import type { MediaItem } from './types';
import { fetchMediaItems } from './services/mockData';
import './MediaLibrary.css';

const MediaLibrary: React.FC = () => {
  const { state, showToast } = useAppContext();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMediaItems().then((data) => { setMedia(data); setLoading(false); });
  }, []);

  // Also gather media from posts in state (user-uploaded)
  const postMedia: MediaItem[] = state.posts
    .filter((p) => p.mediaUrl)
    .map((p) => ({
      id: p.id, url: p.mediaUrl!, type: p.mediaType || 'image',
      postId: p.id, caption: p.caption.slice(0, 50), createdAt: p.createdAt,
    }));

  const allMedia = [...postMedia, ...media];
  const filtered = filter === 'all' ? allMedia : allMedia.filter((m) => m.type === filter);

  const copyToClipboard = (item: MediaItem) => {
    if (item.url) {
      navigator.clipboard.writeText(item.url).catch(() => {});
      showToast('📋 Media URL copied');
    }
  };

  if (loading) {
    return (
      <>
        <div className="page-header"><div><h2>Media Library</h2></div></div>
        <div className="page-body"><div className="loading-shell">
          <div className="skeleton-metrics">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="skeleton skeleton-card" style={{ height: 180 }} />))}</div>
        </div></div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Media Library</h2>
          <p>{allMedia.length} files — images, videos, and uploads</p>
        </div>
        <div className="media-filter-bar">
          {(['all', 'image', 'video'] as const).map((f) => (
            <button key={f} className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'image' ? '📷 Images' : '🎬 Videos'}
            </button>
          ))}
        </div>
      </div>

      <div className="page-body">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🖼️</div><p>No media files yet. Upload some from Create Post!</p></div>
        ) : (
          <div className="media-grid">
            {filtered.map((item) => (
              <div key={item.id} className="media-card card" onClick={() => setSelected(item)}>
                <div className="media-card-preview">
                  {item.url ? (
                    item.type === 'video' ? (
                      <video src={item.url} className="media-thumb-video" />
                    ) : (
                      <img src={item.url} alt="" className="media-thumb-img" />
                    )
                  ) : (
                    <div className="media-placeholder">{item.type === 'video' ? '🎬' : '🖼️'}</div>
                  )}
                  <span className="media-type-badge">{item.type === 'video' ? 'Video' : 'Image'}</span>
                </div>
                <div className="media-card-info">
                  <p className="media-card-caption">{item.caption || 'Untitled'}</p>
                  <button className="media-copy-btn" onClick={(e) => { e.stopPropagation(); copyToClipboard(item); }}>
                    📋 Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {selected && (
        <div className="media-modal-overlay" onClick={() => setSelected(null)}>
          <div className="media-modal" onClick={(e) => e.stopPropagation()}>
            <button className="media-modal-close" onClick={() => setSelected(null)}>✕</button>
            {selected.url ? (
              selected.type === 'video' ? (
                <video src={selected.url} controls className="media-modal-preview" />
              ) : (
                <img src={selected.url} alt="" className="media-modal-preview" />
              )
            ) : (
              <div className="media-modal-placeholder">{selected.type === 'video' ? '🎬' : '🖼️'}</div>
            )}
            <p className="media-modal-caption">{selected.caption || 'Untitled'}</p>
            <button className="btn btn-primary btn-sm" onClick={() => { copyToClipboard(selected); setSelected(null); }}>
              📋 Copy URL
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaLibrary;
