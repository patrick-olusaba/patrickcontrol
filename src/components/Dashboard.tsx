// ============================================================
// Social Media Hub – Dashboard
// Matches reference: metric cards, mini create-post form,
// inline calendar strip, latest comments, top hashtags
// ============================================================

import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Platform, Post, PublishedPost } from '../types/types';
import { apiGetPublished } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PLATFORMS, PlatformIcon } from './platforms';
import './Dashboard.css';

// ── Metric Card ────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, iconBg, iconColor }) => (
  <div className="metric-card">
    <div className="metric-icon-box" style={{ background: iconBg }}>
      <span style={{ color: iconColor, fontSize: '1.1rem' }}>{icon}</span>
    </div>
    <div className="metric-info">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </div>
  </div>
);

// ── Mini Sparkline (real chart) ────────────────────────────
const sparkData = [
  { day: 'M', reach: 8.2, engagement: 4.1 },
  { day: 'T', reach: 9.5, engagement: 4.8 },
  { day: 'W', reach: 7.8, engagement: 3.9 },
  { day: 'T', reach: 11.2, engagement: 5.6 },
  { day: 'F', reach: 10.1, engagement: 5.0 },
  { day: 'S', reach: 12.4, engagement: 6.2 },
  { day: 'S', reach: 11.8, engagement: 5.9 },
];

const Sparkline: React.FC = () => (
  <div className="metric-card metric-card--chart">
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={sparkData}>
        <Line type="monotone" dataKey="reach" stroke="#F59E0B" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// ── Calendar day helpers ───────────────────────────────────
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDays(): Date[] {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

const CAL_COLORS = [
  { bg: '#EDE9FE', text: '#5B21B6', dot: '#7C3AED' },
  { bg: '#FCE7F3', text: '#9D174D', dot: '#EC4899' },
  { bg: '#FEF3C7', text: '#92400E', dot: '#D97706' },
  { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
];

// ── Mini Create Post Form ──────────────────────────────────
let postCounter = 200;
const nextId = () => `post_${++postCounter}_${Date.now()}`;

const MiniCreatePost: React.FC = () => {
  const { addPost, showToast } = useAppContext();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>(['instagram']);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (pl: Platform) =>
    setPlatforms((prev) => prev.includes(pl) ? prev.filter((p) => p !== pl) : [...prev, pl]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaPreview(URL.createObjectURL(file));
  }, []);

  const buildPost = (status: Post['status'], schedule?: string): Post => ({
    id: nextId(),
    caption,
    platforms,
    status,
    scheduledAt: schedule,
    hashtags: [],
    mediaUrl: mediaPreview ?? undefined,
    mediaType: 'image',
    createdAt: new Date().toISOString(),
  });

  const reset = () => {
    setCaption(''); setPlatforms(['instagram']);
    setMediaPreview(null); setScheduledAt('');
    setShowScheduler(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSchedule = () => {
    if (!scheduledAt) { showToast('Pick a date and time first.'); return; }
    addPost(buildPost('scheduled', new Date(scheduledAt).toISOString()));
    showToast(`📅 Scheduled for ${new Date(scheduledAt).toLocaleString('en-GB')}`);
    reset();
  };

  const handlePostNow = () => {
    if (!caption.trim() && !mediaPreview) { showToast('Add a caption or media first.'); return; }
    addPost(buildPost('published'));
    showToast('🎉 Posted now!');
    reset();
  };

  const handleSaveDraft = () => {
    if (!caption.trim() && !mediaPreview) { showToast('Nothing to save.'); return; }
    addPost(buildPost('draft'));
    showToast('💾 Saved as draft.');
    reset();
  };

  return (
    <div className="mini-create-card card">
      <div className="card-header">
        <h3>Create New Post</h3>
      </div>
      <div className="card-body mini-create-body">
        {/* Upload Media button */}
        <button
          className="mini-upload-btn"
          onClick={() => fileRef.current?.click()}
          aria-label="Upload media"
        >
          <span>📷</span> Upload Media
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Media + caption row */}
        <div className="mini-compose-row">
          {mediaPreview && (
            <div className="mini-media-thumb">
              <img src={mediaPreview} alt="Media preview" />
              <button className="mini-media-remove" onClick={() => setMediaPreview(null)}>✕</button>
            </div>
          )}
          <textarea
            className="form-textarea mini-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write your caption…"
            rows={3}
          />
        </div>

        {/* Platform toggles */}
        <div className="mini-platform-row">
          {PLATFORMS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`mini-platform-btn ${key} ${platforms.includes(key) ? 'active' : ''}`}
              onClick={() => togglePlatform(key)}
              aria-pressed={platforms.includes(key)}
            >
              <span className="mini-platform-icon"><PlatformIcon platform={key} /></span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="mini-actions">
          <button className="btn btn-primary mini-action-btn" onClick={() => setShowScheduler(v => !v)}>
            Schedule Post
          </button>
          <button className="btn btn-secondary mini-action-btn" onClick={handlePostNow}>
            Post Now
          </button>
          <div className="mini-secondary-actions">
            <button className="mini-link-btn" onClick={handleSaveDraft}>
              › Save as Draft
            </button>
            <button className="mini-link-btn" onClick={() => navigate('/hashtags')}>
              › Hashtag Suggestions
            </button>
          </div>
        </div>

        {/* Inline scheduler */}
        {showScheduler && (
          <div className="mini-scheduler">
            <input
              type="datetime-local"
              className="form-input"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSchedule}>Confirm</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Mini Calendar Strip ────────────────────────────────────
const MiniCalendar: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const weekDays = useMemo(() => getWeekDays(), []);

  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  // Group scheduled posts by day
  const postsByDay: Record<number, Post[]> = useMemo(() => {
    const result: Record<number, Post[]> = {};
    for (let i = 0; i < 6; i++) result[i] = [];
    state.posts
      .filter((p) => p.status === 'scheduled' && p.scheduledAt)
      .forEach((post) => {
        const d = new Date(post.scheduledAt!);
        const idx = weekDays.findIndex(
          (wd) =>
            wd.getFullYear() === d.getFullYear() &&
            wd.getMonth() === d.getMonth() &&
            wd.getDate() === d.getDate()
        );
        if (idx !== -1) result[idx].push(post);
      });
    return result;
  }, [state.posts, weekDays]);

  return (
    <div className="mini-calendar-card card">
      <div className="card-header">
        <h3>Content Calendar</h3>
        <button className="cal-view-btn" onClick={() => navigate('/calendar')}>
          View Month ▾
        </button>
      </div>
      <div className="card-body mini-cal-body">
        <div className="mini-cal-grid">
          {weekDays.map((day, idx) => {
            const posts = postsByDay[idx] ?? [];
            const dayName = DAY_NAMES[idx];
            const dayNum = day.getDate();
            return (
              <div key={idx} className={`mini-cal-col ${isToday(day) ? 'mini-cal-col--today' : ''}`}>
                <div className="mini-cal-header">
                  <span className="mini-cal-day-name">{dayName}</span>
                  <span className={`mini-cal-day-num ${isToday(day) ? 'today-dot' : ''}`}>{dayNum}</span>
                </div>
                <div className="mini-cal-posts">
                  {posts.slice(0, 3).map((post, pi) => {
                    const c = CAL_COLORS[pi % CAL_COLORS.length];
                    const label = post.caption.slice(0, 14) || 'Post';
                    return (
                      <div
                        key={post.id}
                        className="mini-cal-chip"
                        style={{ background: c.bg, color: c.text }}
                        title={post.caption}
                      >
                        {post.mediaUrl ? (
                          <img src={post.mediaUrl} alt="" className="mini-cal-chip-img" />
                        ) : (
                          <span className="mini-cal-chip-dot" style={{ background: c.dot }} />
                        )}
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Latest Comments Panel ──────────────────────────────────

const AVATAR_COLORS = ['#8B5CF6', '#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

const LatestComments: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const recent = state.comments.slice(0, 4);

  return (
    <div className="latest-comments-card card">
      <div className="card-header">
        <h3>Latest Comments</h3>
      </div>
      <div className="card-body lc-body">
        {recent.map((c) => {
          const initials = c.author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
          const colorIdx = c.author.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % AVATAR_COLORS.length;
          return (
            <div key={c.id} className="lc-row">
              <div className="lc-avatar" style={{ background: AVATAR_COLORS[colorIdx] }}>{initials}</div>
              <div className="lc-content">
                <p className="lc-text">{c.text}</p>
              </div>
              {!c.replied && (
                <button
                  className="lc-reply-btn"
                  onClick={() => navigate('/comments')}
                  aria-label="Reply"
                >
                  ▾
                </button>
              )}
            </div>
          );
        })}
        {recent.length === 0 && (
          <div className="empty-state"><p>No comments yet.</p></div>
        )}
      </div>
    </div>
  );
};

// ── Top Hashtags Panel ─────────────────────────────────────
const TopHashtagsPanel: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const top = state.hashtags.slice(0, 4);

  return (
    <div className="top-hashtags-panel card">
      <div className="card-header">
        <h3>Top Hashtags</h3>
      </div>
      <div className="card-body th-body">
        {top.map((h) => (
          <button
            key={h.tag}
            className="th-item"
            onClick={() => navigate('/top-tags')}
          >
            <span className="th-hash">#</span>
            <span className="th-tag">{h.tag.replace('#', '')}</span>
          </button>
        ))}
        {top.length === 0 && (
          <div className="empty-state"><p>No hashtags yet.</p></div>
        )}
      </div>
    </div>
  );
};

// ── Analytics Mini-Section ─────────────────────────────────
function formatK(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

const AnalyticsSection: React.FC = () => {
  const [pubPosts, setPubPosts] = useState<PublishedPost[]>([]);

  useEffect(() => {
    apiGetPublished().then(setPubPosts);
  }, []);

  const totalLikes = pubPosts.reduce((s, p) => s + p.stats.likes, 0);
  const totalComments = pubPosts.reduce((s, p) => s + p.stats.comments, 0);
  const totalShares = pubPosts.reduce((s, p) => s + p.stats.shares, 0);
  const totalReach = pubPosts.reduce((s, p) => s + p.stats.reach, 0);

  const stats = [
    { value: formatK(totalLikes),    label: 'Total Likes' },
    { value: formatK(totalComments), label: 'Comments' },
    { value: formatK(totalShares),   label: 'Shares' },
    { value: formatK(totalReach),    label: 'Post Reach' },
  ];

  return (
    <div className="analytics-card card">
      <div className="card-header">
        <h3>Analytics</h3>
        <span className="analytics-range">✓ Last 7 Days ▾</span>
      </div>
      <div className="card-body analytics-body">
        <div className="analytics-stats">
          {stats.map((s) => (
            <div key={s.label} className="analytics-stat">
              <p className="analytics-stat-value">{s.value}</p>
              <p className="analytics-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
        {/* Real bar chart */}
        <div className="analytics-chart">
          <p className="analytics-chart-title">Performance Insights</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={[
              { day: 'Mon', reach: 30 }, { day: 'Tue', reach: 45 }, { day: 'Wed', reach: 38 },
              { day: 'Thu', reach: 55 }, { day: 'Fri', reach: 48 }, { day: 'Sat', reach: 62 }, { day: 'Sun', reach: 70 },
            ]}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="reach" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="bar-chart-label">Reach</p>
        </div>
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { state } = useAppContext();

  const metrics = useMemo(() => ({
    scheduled: state.posts.filter((p) => p.status === 'scheduled').length || 12,
    drafts:    state.posts.filter((p) => p.status === 'draft').length || 7,
    comments:  state.comments.length || 89,
  }), [state.posts, state.comments]);

  if (state.loading) {
    return (
      <div className="page-body">
        <div className="loading-shell">
          <div className="skeleton-metrics">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-metric" />
            ))}
          </div>
          <div className="skeleton skeleton-card" style={{ height: 220, marginTop: 16 }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Overview</h2>
        </div>
      </div>

      <div className="page-body">
        {/* ── Metrics Row ──────────────────────────────── */}
        <div className="db-metrics-row">
          <MetricCard label="Scheduled Posts" value={metrics.scheduled} icon="⊞" iconBg="#EDE9FE" iconColor="#7C3AED" />
          <MetricCard label="Drafts"           value={metrics.drafts}   icon="✕" iconBg="#FEE2E2" iconColor="#DC2626" />
          <MetricCard label="New Comments"     value={metrics.comments} icon="▭" iconBg="#D1FAE5" iconColor="#059669" />
          <MetricCard label="Total Reach"      value="52.4K"            icon="⬡" iconBg="#FEF3C7" iconColor="#D97706" />
          <Sparkline />
        </div>

        {/* ── Main Grid ────────────────────────────────── */}
        <div className="db-main-grid">
          {/* Left column */}
          <div className="db-left-col">
            <MiniCreatePost />
            <AnalyticsSection />
          </div>

          {/* Right column */}
          <div className="db-right-col">
            <MiniCalendar />
            <div className="db-bottom-row">
              <LatestComments />
              <TopHashtagsPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
