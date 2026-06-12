// ============================================================
// PatrickControl – Content Calendar
// Week view (Mon–Sun) with scheduled posts displayed as
// cards. Drag & drop is simulated with move buttons.
// ============================================================

import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Post } from '../types/types';
import { PlatformIcon } from './platforms';
import './ContentCalendar.css';

// ── Helpers ────────────────────────────────────────────────
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Post Card inside calendar cell ────────────────────────
interface CalendarPostCardProps {
  post: Post;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}

const CalendarPostCard: React.FC<CalendarPostCardProps> = ({
  post,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}) => {
  const [expanded, setExpanded] = useState(false);

  const time = post.scheduledAt
    ? new Date(post.scheduledAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      className="cal-post-card"
      onClick={() => setExpanded((v) => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
    >
      {/* Tiny thumbnail if post has an image */}
      {post.mediaUrl && (
        <div className="cal-post-thumb">
          <img src={post.mediaUrl} alt="" aria-hidden="true" />
        </div>
      )}
      <div className="cal-post-time">{time}</div>
      <div className="cal-post-caption">
        {post.caption.slice(0, 45)}{post.caption.length > 45 ? '…' : ''}
      </div>
      <div className="cal-post-platforms">
        {post.platforms.map((pl) => (
          <span key={pl} title={pl}><PlatformIcon platform={pl} size={14} /></span>
        ))}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="cal-post-expanded" onClick={(e) => e.stopPropagation()}>
          {post.mediaUrl && (
            <img src={post.mediaUrl} alt="Post media" className="cal-post-expanded-img" />
          )}
          <p className="cal-post-full-caption">{post.caption}</p>
          <div className="cal-post-hashtags">
            {post.hashtags.map((h) => (
              <span key={h} className="hashtag-chip">{h}</span>
            ))}
          </div>
          <div className="cal-move-buttons">
            <button
              className="btn btn-sm btn-ghost"
              onClick={onMoveLeft}
              disabled={!canMoveLeft}
              title="Move to previous day"
            >
              ← Move
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={onMoveRight}
              disabled={!canMoveRight}
              title="Move to next day"
            >
              Move →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────
const ContentCalendar: React.FC = () => {
  const { state, updatePost } = useAppContext();

  // Offset in weeks (0 = current week)
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const base = getWeekStart(new Date());
    base.setDate(base.getDate() + weekOffset * 7);
    return base;
  }, [weekOffset]);

  // Build array of 7 dates for the week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // Scheduled posts for this week
  const scheduledPosts = useMemo(
    () => state.posts.filter((p) => p.status === 'scheduled' && p.scheduledAt),
    [state.posts]
  );

  // Group posts by day index (0=Mon … 6=Sun)
  const postsByDay: Record<number, Post[]> = useMemo(() => {
    const result: Record<number, Post[]> = {};
    for (let i = 0; i < 7; i++) result[i] = [];

    scheduledPosts.forEach((post) => {
      const d = new Date(post.scheduledAt!);
      const dayOfWeek = weekDays.findIndex(
        (wd) =>
          wd.getFullYear() === d.getFullYear() &&
          wd.getMonth() === d.getMonth() &&
          wd.getDate() === d.getDate()
      );
      if (dayOfWeek !== -1) result[dayOfWeek].push(post);
    });

    // Sort each day by time
    Object.values(result).forEach((arr) =>
      arr.sort((a, b) =>
        new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()
      )
    );

    return result;
  }, [scheduledPosts, weekDays]);

  // Move a post to adjacent day
  const movePost = (post: Post, direction: -1 | 1) => {
    const current = new Date(post.scheduledAt!);
    current.setDate(current.getDate() + direction);
    updatePost({ ...post, scheduledAt: current.toISOString() });
  };

  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate()     === today.getDate()   &&
    d.getMonth()    === today.getMonth()  &&
    d.getFullYear() === today.getFullYear();

  const weekLabel = `${weekDays[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${weekDays[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Content Calendar</h2>
          <p>Plan and manage your posting schedule</p>
        </div>
      </div>

      <div className="page-body">
        {/* Week navigation */}
        <div className="calendar-nav">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setWeekOffset((v) => v - 1)}
          >
            ← Previous Week
          </button>
          <span className="calendar-week-label">{weekLabel}</span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setWeekOffset(0)}
          >
            Today
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setWeekOffset((v) => v + 1)}
          >
            Next Week →
          </button>
        </div>

        {/* Week grid */}
        <div className="calendar-grid">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`calendar-day ${isToday(day) ? 'calendar-day--today' : ''}`}
            >
              {/* Day header */}
              <div className="calendar-day-header">
                <span className="day-label">{DAY_LABELS[idx]}</span>
                <span className={`day-number ${isToday(day) ? 'day-number--today' : ''}`}>
                  {day.getDate()}
                </span>
                {postsByDay[idx].length > 0 && (
                  <span className="day-post-count">{postsByDay[idx].length}</span>
                )}
              </div>

              {/* Posts for this day */}
              <div className="calendar-day-body">
                {postsByDay[idx].length === 0 ? (
                  <div className="cal-empty-day">No posts</div>
                ) : (
                  postsByDay[idx].map((post) => (
                    <CalendarPostCard
                      key={post.id}
                      post={post}
                      onMoveLeft={() => movePost(post, -1)}
                      onMoveRight={() => movePost(post, 1)}
                      canMoveLeft={idx > 0}
                      canMoveRight={idx < 6}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Drafts bar */}
        {state.posts.filter((p) => p.status === 'draft').length > 0 && (
          <div className="drafts-bar card">
            <div className="card-body">
              <div className="drafts-bar-inner">
                <span className="drafts-bar-label">
                  📝 {state.posts.filter((p) => p.status === 'draft').length} drafts waiting to be scheduled
                </span>
                <div className="drafts-bar-posts">
                  {state.posts
                    .filter((p) => p.status === 'draft')
                    .slice(0, 4)
                    .map((post) => (
                      <div key={post.id} className="draft-thumb-chip">
                        {post.mediaUrl && (
                          <img src={post.mediaUrl} alt="" className="draft-thumb-chip-img" />
                        )}
                        <span className="draft-thumb-chip-label">
                          {post.caption.slice(0, 24)}{post.caption.length > 24 ? '…' : ''}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentCalendar;
