// ============================================================
// PatrickControl – Dashboard
// Clean metric cards row + content sections below
// ============================================================

import React, { useMemo } from 'react';
import { useAppContext } from './AppContext';
import './Dashboard.css';

// ── Metric Card ────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: 'blue' | 'green' | 'amber' | 'purple' | 'indigo';
  sub?: string;
}

const ACCENT_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  blue:   { bar: '#3B82F6', bg: '#EFF6FF', text: '#1D4ED8' },
  green:  { bar: '#10B981', bg: '#ECFDF5', text: '#059669' },
  amber:  { bar: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
  purple: { bar: '#8B5CF6', bg: '#F5F3FF', text: '#6D28D9' },
  indigo: { bar: '#4F6EF7', bg: '#EEF1FE', text: '#3B54D4' },
};

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, accent = 'blue', sub }) => {
  const c = ACCENT_COLORS[accent] ?? ACCENT_COLORS.blue;
  return (
    <div className="metric-card" style={{ borderTop: `3px solid ${c.bar}` }}>
      <div className="metric-icon" style={{ background: c.bg, color: c.text }}>{icon}</div>
      <div className="metric-content">
        <p className="metric-label">{label}</p>
        <p className="metric-value">{value}</p>
        {sub && <p className="metric-sub">{sub}</p>}
      </div>
    </div>
  );
};

// ── Upcoming Posts ─────────────────────────────────────────
const UpcomingPosts: React.FC = () => {
  const { state } = useAppContext();
  const recent = useMemo(
    () => state.posts.filter((p) => p.status === 'scheduled').slice(0, 4),
    [state.posts]
  );

  if (!recent.length) return <div className="empty-state"><p>No upcoming posts.</p></div>;

  return (
    <ul className="recent-posts-list">
      {recent.map((post) => {
        const dt = post.scheduledAt ? new Date(post.scheduledAt) : null;
        const dateStr = dt
          ? dt.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })
          : '—';
        const timeStr = dt
          ? dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          : '';

        return (
          <li key={post.id} className="recent-post-item">
            <div className="post-item-dot" />
            <div className="post-item-info">
              <p className="post-item-caption">
                {post.caption.slice(0, 55)}{post.caption.length > 55 ? '…' : ''}
              </p>
              <div className="post-item-meta">
                <span className="post-item-date">{dateStr} · {timeStr}</span>
                <div className="post-item-platforms">
                  {post.platforms.map((pl) => (
                    <span key={pl} className={`platform-dot platform-dot--${pl}`} title={pl} />
                  ))}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

// ── Pending Approvals ──────────────────────────────────────
const PendingApprovals: React.FC = () => {
  const { state } = useAppContext();
  const drafts = state.posts.filter((p) => p.status === 'draft').slice(0, 3);

  if (!drafts.length) return <div className="empty-state"><p>No drafts waiting.</p></div>;

  return (
    <ul className="pending-list">
      {drafts.map((post) => (
        <li key={post.id} className="pending-item">
          <span className="badge badge-draft">Draft</span>
          <p className="pending-caption">{post.caption.slice(0, 55)}…</p>
          <div className="pending-actions">
            <button className="btn btn-sm btn-primary">Approve</button>
            <button className="btn btn-sm btn-secondary">Edit</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

// ── Platform Reach ─────────────────────────────────────────
const PlatformReach: React.FC = () => {
  const platforms = [
    { name: 'Instagram', icon: '📸', pct: 58, reach: '18.2K', color: '#E1306C' },
    { name: 'TikTok',    icon: '🎵', pct: 27, reach: '8.5K',  color: '#111827' },
    { name: 'Facebook',  icon: '👥', pct: 12, reach: '4.1K',  color: '#1877F2' },
    { name: 'WhatsApp',  icon: '💚', pct: 3,  reach: '0.9K',  color: '#25D366' },
  ];

  return (
    <div className="quick-stats-list">
      {platforms.map((pl) => (
        <div className="quick-stat-row" key={pl.name}>
          <span className="quick-stat-icon">{pl.icon}</span>
          <span className="quick-stat-platform">{pl.name}</span>
          <div className="quick-stat-bar-wrapper">
            <div className="quick-stat-bar" style={{ width: `${pl.pct}%`, background: pl.color }} />
          </div>
          <span className="quick-stat-reach">{pl.reach}</span>
        </div>
      ))}
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { state } = useAppContext();

  const metrics = useMemo(() => {
    const scheduled = state.posts.filter((p) => p.status === 'scheduled').length;
    const drafts    = state.posts.filter((p) => p.status === 'draft').length;
    return { scheduled, drafts };
  }, [state.posts]);

  const now = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (state.loading) {
    return (
      <>
        <div className="page-header">
          <div>
            <div className="skeleton skeleton-title" style={{ height: 22 }} />
            <div className="skeleton skeleton-text" style={{ width: 160, marginTop: 6 }} />
          </div>
        </div>
        <div className="page-body">
          <div className="loading-shell">
            <div className="skeleton-metrics">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-metric" />
              ))}
            </div>
            <div className="skeleton-lower">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-card" style={{ height: 180 }} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back, Patrick — here's your overview</p>
        </div>
        <span className="header-date">{now}</span>
      </div>

      <div className="page-body">
        {/* ── Metrics Row ──────────────────────────────── */}
        <div className="metrics-grid">
          <MetricCard label="Scheduled Posts"  value={metrics.scheduled || 8}   icon="📅" accent="blue"   sub="This week" />
          <MetricCard label="Drafts"           value={metrics.drafts || 4}      icon="📝" accent="amber"  sub="Awaiting review" />
          <MetricCard label="New Comments"     value={state.comments.length || 42} icon="💬" accent="green"  sub="All platforms" />
          <MetricCard label="Total Reach"      value="31.7K"                     icon="📊" accent="purple" sub="↑ 11.4% this week" />
          <MetricCard label="Engagement Rate"  value="4.8%"                      icon="📈" accent="indigo" sub="↑ 0.6% vs last week" />
        </div>

        {/* ── Content Sections ────────────────────────── */}
        <div className="dashboard-lower">
          <div className="card">
            <div className="card-header">
              <h3>Upcoming Posts</h3>
              <span className="badge badge-scheduled">{metrics.scheduled} scheduled</span>
            </div>
            <div className="card-body">
              <UpcomingPosts />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Pending Review</h3>
              <span className="badge badge-draft">{metrics.drafts} drafts</span>
            </div>
            <div className="card-body">
              <PendingApprovals />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Platform Reach</h3>
            </div>
            <div className="card-body">
              <PlatformReach />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
