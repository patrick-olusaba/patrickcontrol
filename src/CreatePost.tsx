// ============================================================
// PatrickControl – Create Post (Personal)
// Supports: media upload preview, caption, platform toggles,
// scheduling, hashtag bundles, WhatsApp preview mode.
// ============================================================

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAppContext } from './AppContext';
import type { Platform, Post, HashtagBundle, PostTemplate } from './types';
import { PLATFORMS, PlatformIcon } from './platforms';
import './CreatePost.css';

const PLACEHOLDER =
  'Share your latest project, thought, or update… Use emojis to add personality! 🚀✨';

// ── WhatsApp caption preview (truncated) ──────────────────
function getWhatsAppPreview(caption: string): string {
  const lines = caption.split('\n').slice(0, 3).join('\n');
  return lines.length > 160 ? lines.slice(0, 157) + '…' : lines;
}

// ── Unique post ID ─────────────────────────────────────────
let postCounter = 100;
const nextId = () => `post_${++postCounter}_${Date.now()}`;

// ── Component ─────────────────────────────────────────────
const CreatePost: React.FC = () => {
  const { state, addPost, showToast } = useAppContext();

  // Form state
  const [caption, setCaption]               = useState('');
  const [platforms, setPlatforms]           = useState<Platform[]>(['instagram']);
  const [selectedBundle, setSelectedBundle] = useState<string>('');
  const [mediaPreview, setMediaPreview]     = useState<string | null>(null);
  const [mediaType, setMediaType]           = useState<'image' | 'video'>('image');
  const [scheduledAt, setScheduledAt]       = useState('');
  const [showScheduler, setShowScheduler]   = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Load template from sessionStorage (set by Templates page)
  useEffect(() => {
    const raw = sessionStorage.getItem('activeTemplate');
    if (!raw) return;
    try {
      const tpl: PostTemplate = JSON.parse(raw);
      setCaption(tpl.caption);
      setPlatforms(tpl.platforms);
      // Find matching hashtag bundle or just use tags directly
      sessionStorage.removeItem('activeTemplate');
      showToast('📝 Template loaded — customise and post!');
    } catch { /* ignore invalid JSON */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived
  const isWhatsApp  = platforms.includes('whatsapp');
  const bundle      = state.hashtagBundles.find((b) => b.id === selectedBundle);
  const hashtags    = bundle ? bundle.tags : [];

  // Toggle a platform on/off
  const togglePlatform = (pl: Platform) => {
    setPlatforms((prev) =>
      prev.includes(pl) ? prev.filter((p) => p !== pl) : [...prev, pl]
    );
  };

  // Handle file selection → generate local preview URL
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    },
    []
  );

  // Clear media
  const removeMedia = () => {
    setMediaPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  // Build a Post object from current form state
  const buildPost = (status: Post['status'], overrideSchedule?: string): Post => ({
    id: nextId(),
    caption,
    platforms,
    status,
    scheduledAt: overrideSchedule,
    hashtags,
    mediaUrl:   mediaPreview ?? undefined,
    mediaType,
    createdAt: new Date().toISOString(),
  });

  // ── Actions ──────────────────────────────────────────────
  const handlePostNow = () => {
    if (!caption.trim() && !mediaPreview) {
      showToast('Add a caption or media before posting.');
      return;
    }
    addPost(buildPost('published'));
    showToast('🎉 Posted now! Your content is live.');
    resetForm();
  };

  const handleSaveDraft = () => {
    if (!caption.trim() && !mediaPreview) {
      showToast('Nothing to save — add a caption or media first.');
      return;
    }
    addPost(buildPost('draft'));
    showToast('💾 Saved as draft.');
    resetForm();
  };

  const handleSchedule = () => {
    if (!scheduledAt) {
      showToast('Pick a date and time to schedule.');
      return;
    }
    if (!caption.trim() && !mediaPreview) {
      showToast('Add a caption or media before scheduling.');
      return;
    }
    addPost(buildPost('scheduled', new Date(scheduledAt).toISOString()));
    showToast(`📅 Scheduled for ${new Date(scheduledAt).toLocaleString('en-GB')}`);
    setShowScheduler(false);
    resetForm();
  };

  const resetForm = () => {
    setCaption('');
    setPlatforms(['instagram']);
    setSelectedBundle('');
    setScheduledAt('');
    setMediaPreview(null);
    setShowScheduler(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Create Post</h2>
          <p>Compose and schedule content across all platforms</p>
        </div>
      </div>

      <div className="page-body">
        <div className="create-post-layout">
          {/* ── Left: form ──────────────────────────────── */}
          <div className="create-post-form card">
            <div className="card-body">

              {/* Media upload */}
              <div className="form-group">
                <label className="form-label">Media (Image / Video)</label>
                {mediaPreview ? (
                  <div className="media-preview">
                    {mediaType === 'image' ? (
                      <img src={mediaPreview} alt="Preview" className="media-preview-img" />
                    ) : (
                      <video src={mediaPreview} className="media-preview-video" controls />
                    )}
                    <button className="media-remove-btn" onClick={removeMedia} title="Remove media">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="media-dropzone"
                    onClick={() => fileRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to upload media"
                  >
                    <span className="dropzone-icon">🖼️</span>
                    <p>Click to upload an image or video</p>
                    <p className="dropzone-hint">JPG, PNG, MP4 · Max preview only, no upload</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Caption */}
              <div className="form-group">
                <label className="form-label" htmlFor="caption-input">Caption</label>
                <textarea
                  id="caption-input"
                  className="form-textarea"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={PLACEHOLDER}
                  rows={5}
                />
                <p className="char-count">{caption.length} characters</p>
              </div>

              {/* Hashtag Bundle */}
              <div className="form-group">
                <label className="form-label" htmlFor="hashtag-bundle">Hashtag Bundle</label>
                <select
                  id="hashtag-bundle"
                  className="form-select"
                  value={selectedBundle}
                  onChange={(e) => setSelectedBundle(e.target.value)}
                >
                  <option value="">— Choose a hashtag bundle —</option>
                  {state.hashtagBundles.map((b: HashtagBundle) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {hashtags.length > 0 && (
                  <div className="hashtag-chips">
                    {hashtags.map((tag) => (
                      <span key={tag} className="hashtag-chip">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform Toggles */}
              <div className="form-group">
                <label className="form-label">Platforms</label>
                <div className="platform-toggles">
                  {PLATFORMS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      className={`platform-toggle ${key} ${platforms.includes(key) ? 'active' : ''}`}
                      onClick={() => togglePlatform(key)}
                      aria-pressed={platforms.includes(key)}
                    >
                      <PlatformIcon platform={key} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="post-actions">
                <button className="btn btn-primary" onClick={handlePostNow}>
                  🚀 Post Now
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowScheduler((v) => !v)}
                >
                  📅 Schedule
                </button>
                <button className="btn btn-secondary" onClick={handleSaveDraft}>
                  💾 Save Draft
                </button>
              </div>

              {/* Inline scheduler */}
              {showScheduler && (
                <div className="scheduler-panel">
                  <p className="form-label">Pick date &amp; time</p>
                  <div className="scheduler-row">
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <button className="btn btn-primary" onClick={handleSchedule}>
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: preview panel ─────────────────────── */}
          <div className="preview-panel">
            <div className="card">
              <div className="card-header">
                <h3>Post Preview</h3>
                <span className="badge badge-scheduled">Preview</span>
              </div>
              <div className="card-body">
                {/* Media preview */}
                {mediaPreview && (
                  <div className="preview-media">
                    {mediaType === 'image' ? (
                      <img src={mediaPreview} alt="Post preview" />
                    ) : (
                      <video src={mediaPreview} controls />
                    )}
                  </div>
                )}

                {/* Caption preview — WhatsApp mode shortens it */}
                <div className="preview-caption">
                  {caption ? (
                    isWhatsApp ? (
                      <>
                        <div className="whatsapp-badge">💚 WhatsApp Preview (shortened)</div>
                        <p className="caption-text">{getWhatsAppPreview(caption)}</p>
                      </>
                    ) : (
                      <p className="caption-text">{caption}</p>
                    )
                  ) : (
                    <p className="placeholder-text">Your caption will appear here…</p>
                  )}
                </div>

                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="preview-hashtags">
                    {hashtags.map((tag) => (
                      <span key={tag} className="hashtag-chip">{tag}</span>
                    ))}
                  </div>
                )}

                {/* Platform badges */}
                {platforms.length > 0 && (
                  <div className="preview-platforms">
                    {platforms.map((pl) => (
                      <span key={pl} className={`platform-preview-badge platform-preview-badge--${pl}`}>
                        <PlatformIcon platform={pl} /> {pl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drafts counter */}
            <div className="drafts-summary card">
              <div className="card-body drafts-summary-body">
                <span className="drafts-icon">📝</span>
                <div>
                  <p className="drafts-count">
                    {state.posts.filter((p) => p.status === 'draft').length} Drafts
                  </p>
                  <p className="drafts-hint">Saved in this session</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
