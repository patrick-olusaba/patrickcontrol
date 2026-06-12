// ============================================================
// PatrickControl – Latest Comments (Personal)
// Shows recent comments with inline reply form.
// ============================================================

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Comment } from '../types/types';
import { PlatformIcon } from './platforms';
import './CommentsList.css';

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', whatsapp: 'WhatsApp',
};

// ── Time formatter ─────────────────────────────────────────
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);

  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return 'Just now';
}

// ── Single Comment Row ─────────────────────────────────────
interface CommentRowProps {
  comment: Comment;
  onReply: (id: string, text: string) => void;
}

const AVATAR_COLORS = [
  'var(--color-coral)',
  'var(--color-teal)',
  '#8B5CF6',
  '#3B82F6',
  '#EC4899',
  '#F59E0B',
];

const CommentRow: React.FC<CommentRowProps> = ({ comment, onReply }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText]       = useState('');
  const [sending, setSending]           = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);

    // Simulate async send (replace with real API call)
    await new Promise((r) => setTimeout(r, 400));

    console.log(`[PatrickControl] Reply to ${comment.id}:`, replyText);
    onReply(comment.id, replyText);

    setReplyText('');
    setShowReplyBox(false);
    setSending(false);
  };

  const initials = comment.author
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Deterministic color from author name
  const colorIdx = comment.author.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;

  return (
    <div className="comment-row">
      {/* Avatar */}
      <div
        className="comment-avatar"
        style={{ background: AVATAR_COLORS[colorIdx] }}
      >
        {initials}
      </div>

      <div className="comment-content">
        {/* Header */}
        <div className="comment-header">
          <div className="comment-author-meta">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-platform"><PlatformIcon platform={comment.platform} size={12} /> {PLATFORM_LABELS[comment.platform]}</span>
          </div>
          <span className="comment-time">{timeAgo(comment.createdAt)}</span>
        </div>

        {/* Body */}
        <p className="comment-text">{comment.text}</p>

        {/* Footer */}
        <div className="comment-footer">
          {comment.replied ? (
            <span className="replied-indicator">✓ Replied</span>
          ) : (
            <button
              className="btn btn-sm btn-ghost reply-btn"
              onClick={() => setShowReplyBox((v) => !v)}
              aria-expanded={showReplyBox}
            >
              💬 Reply
            </button>
          )}
        </div>

        {/* Inline reply input */}
        {showReplyBox && !comment.replied && (
          <div className="reply-box" role="form" aria-label={`Reply to ${comment.author}`}>
            <textarea
              className="form-textarea reply-textarea"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.author}…`}
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSendReply();
              }}
            />
            <div className="reply-actions">
              <span className="reply-hint">⌘/Ctrl + Enter to send</span>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setShowReplyBox(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSendReply}
                disabled={!replyText.trim() || sending}
              >
                {sending ? 'Sending…' : 'Send Reply'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────
const CommentsList: React.FC = () => {
  const { state, replyComment, showToast } = useAppContext();

  const [filter, setFilter] = useState<'all' | 'unreplied'>('all');

  const filtered = state.comments.filter((c: Comment) => {
    if (filter === 'unreplied') return !c.replied;
    return true;
  });

  const handleReply = (id: string, text: string) => {
    replyComment(id);
    showToast(`✉️ Reply sent to comment`);
    console.log('[PatrickControl] Reply sent:', { id, text });
  };

  const unrepliedCount = state.comments.filter((c: Comment) => !c.replied).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Latest Comments</h2>
          <p>Engage with your audience across all platforms</p>
        </div>
        {unrepliedCount > 0 && (
          <span className="unreplied-badge">{unrepliedCount} need reply</span>
        )}
      </div>

      <div className="page-body">
        {/* Filter bar */}
        <div className="comments-filter-bar">
          {(
            [
              { key: 'all',       label: `All (${state.comments.length})` },
              { key: 'unreplied', label: `⏳ Unreplied (${unrepliedCount})` },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              className={`filter-tab ${filter === key ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Comments list */}
        <div className="comments-list card">
          <div className="card-body comments-card-body">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <p>No comments match this filter.</p>
              </div>
            ) : (
              filtered.map((comment: Comment) => (
                <CommentRow
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentsList;
