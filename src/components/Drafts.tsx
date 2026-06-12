// ============================================================
// Social Media Manager – Drafts
// Card grid showing all draft posts with images, captions,
// platform badges, and schedule / publish / delete actions.
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Post } from '../types/types';
import { PlatformIcon } from './platforms';
import './Drafts.css';

const PLATFORM_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  instagram: { bg: '#FDE2EE', color: '#C2185B', label: 'Instagram' },
  tiktok:    { bg: '#E8E8E8', color: '#111827', label: 'TikTok' },
  facebook:  { bg: '#DBEAFE', color: '#1455B5', label: 'Facebook' },
  whatsapp:  { bg: '#D1FAE5', color: '#065F46', label: 'WhatsApp' },
};

// ── Single Draft Card ──────────────────────────────────────
interface DraftCardProps {
  post: Post;
  onSchedule: (post: Post) => void;
  onPublish: (post: Post) => void;
  onDelete: (id: string) => void;
}

const DraftCard: React.FC<DraftCardProps> = ({ post, onSchedule, onPublish, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  const createdDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="draft-card">
      {/* Image area */}
      <div className="draft-card-image">
        {post.mediaUrl && !imgError ? (
          <img
            src={post.mediaUrl}
            alt="Draft media"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="draft-card-no-image">
            <span>🖼️</span>
            <p>No image</p>
          </div>
        )}
        {/* Draft badge overlay */}
        <span className="draft-badge-overlay">Draft</span>
      </div>

      {/* Body */}
      <div className="draft-card-body">
        {/* Platform badges */}
        <div className="draft-platforms">
          {post.platforms.map((pl) => {
            const s = PLATFORM_COLORS[pl];
            return (
              <span
                key={pl}
                className="draft-platform-badge"
                style={{ background: s.bg, color: s.color }}
              >
                <PlatformIcon platform={pl} size={12} /> {s.label}
              </span>
            );
          })}
        </div>

        {/* Caption */}
        <p className="draft-caption">{post.caption}</p>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="draft-hashtags">
            {post.hashtags.slice(0, 4).map((h) => (
              <span key={h} className="hashtag-chip">{h}</span>
            ))}
            {post.hashtags.length > 4 && (
              <span className="draft-hashtag-more">+{post.hashtags.length - 4}</span>
            )}
          </div>
        )}

        {/* Meta */}
        <p className="draft-meta">Saved {createdDate}</p>
      </div>

      {/* Actions */}
      <div className="draft-card-actions">
        <button
          className="btn btn-primary btn-sm draft-action-btn"
          onClick={() => onSchedule(post)}
        >
          📅 Schedule
        </button>
        <button
          className="btn btn-teal btn-sm draft-action-btn"
          onClick={() => onPublish(post)}
        >
          🚀 Publish
        </button>
        <button
          className="btn btn-ghost btn-sm draft-delete-btn"
          onClick={() => onDelete(post.id)}
          aria-label="Delete draft"
        >
          🗑
        </button>
      </div>
    </div>
  );
};

// ── Schedule Modal (inline) ────────────────────────────────
interface ScheduleModalProps {
  post: Post;
  onConfirm: (scheduledAt: string) => void;
  onCancel: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ post, onConfirm, onCancel }) => {
  const [dateTime, setDateTime] = useState('');
  return (
    <div className="schedule-modal-overlay" onClick={onCancel}>
      <div className="schedule-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Schedule post">
        <h3 className="schedule-modal-title">Schedule Draft</h3>
        <p className="schedule-modal-sub">
          {post.caption.slice(0, 60)}{post.caption.length > 60 ? '…' : ''}
        </p>
        <input
          type="datetime-local"
          className="form-input"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          autoFocus
        />
        <div className="schedule-modal-actions">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => dateTime && onConfirm(dateTime)}
            disabled={!dateTime}
          >
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Drafts Page ───────────────────────────────────────
const Drafts: React.FC = () => {
  const { state, updatePost, deletePost, showToast } = useAppContext();
  const navigate = useNavigate();
  const [schedulingPost, setSchedulingPost] = useState<Post | null>(null);

  const drafts = state.posts.filter((p) => p.status === 'draft');

  const handleSchedule = (post: Post) => setSchedulingPost(post);

  const handleConfirmSchedule = (scheduledAt: string) => {
    if (!schedulingPost) return;
    updatePost({ ...schedulingPost, status: 'scheduled', scheduledAt: new Date(scheduledAt).toISOString() });
    showToast(`📅 Scheduled for ${new Date(scheduledAt).toLocaleString('en-GB')}`);
    setSchedulingPost(null);
  };

  const handlePublish = (post: Post) => {
    updatePost({ ...post, status: 'published' });
    showToast('🎉 Published successfully!');
  };

  const handleDelete = (id: string) => {
    deletePost(id);
    showToast('🗑 Draft deleted.');
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Drafts</h2>
          <p>{drafts.length} draft{drafts.length !== 1 ? 's' : ''} waiting to be published</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          + New Post
        </button>
      </div>

      <div className="page-body">
        {drafts.length === 0 ? (
          <div className="drafts-empty-state card">
            <div className="card-body">
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <p>No drafts yet. Start creating content!</p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 16 }}
                  onClick={() => navigate('/create')}
                >
                  Create a Post
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="drafts-grid">
            {drafts.map((post) => (
              <DraftCard
                key={post.id}
                post={post}
                onSchedule={handleSchedule}
                onPublish={handlePublish}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Schedule modal */}
      {schedulingPost && (
        <ScheduleModal
          post={schedulingPost}
          onConfirm={handleConfirmSchedule}
          onCancel={() => setSchedulingPost(null)}
        />
      )}
    </>
  );
};

export default Drafts;
