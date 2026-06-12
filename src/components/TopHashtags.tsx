// ============================================================
// PatrickControl – Top Hashtags (Performance View)
// Shows hashtag performance with reach bars and trends.
// ============================================================

import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Hashtag } from '../types/types';
import './TopHashtags.css';

// ── Generate trend per hashtag (deterministic from tag name) ─
const getTrend = (tag: string): { trend: 'up' | 'down' | 'stable'; pct: string } => {
  const hash = tag.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = hash % 10;
  if (r < 5) return { trend: 'up',     pct: `+${(hash % 15) + 2}%` };
  if (r < 8) return { trend: 'stable', pct: `${hash % 3}%` };
  return { trend: 'down', pct: `-${(hash % 5) + 1}%` };
};

// ── Bar color by position ──────────────────────────────────
const BAR_COLORS = [
  'var(--color-coral)',
  'var(--color-teal)',
  '#2B7FD4',
  '#E8A020',
  '#8B5CF6',
  '#EC4899',
];

const TopHashtags: React.FC = () => {
  const { state } = useAppContext();

  const maxReach = useMemo(
    () => Math.max(...state.hashtags.map((h: Hashtag) => h.reach)),
    [state.hashtags]
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Top Hashtags</h2>
          <p>Performance overview based on engagement data</p>
        </div>
      </div>

      <div className="page-body">
        <div className="top-hashtags-layout">
          {/* Main performance table */}
          <div className="card hashtag-performance-card">
            <div className="card-header">
              <h3>Hashtag Performance</h3>
              <span className="update-hint">Last updated: just now</span>
            </div>
            <div className="card-body">
              {state.hashtags.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📊</div>
                  <p>No hashtag data available.</p>
                </div>
              ) : (
                <div className="hashtag-table">
                  {/* Header row */}
                  <div className="hashtag-table-header">
                    <span>#</span>
                    <span>Hashtag</span>
                    <span>Reach</span>
                    <span>7-day Trend</span>
                    <span>Performance</span>
                  </div>

                  {/* Data rows */}
                  {state.hashtags.map((hashtag: Hashtag, i: number) => {
                    const trendData = getTrend(hashtag.tag);
                    const barWidth  = Math.round((hashtag.reach / maxReach) * 100);

                    return (
                      <div key={hashtag.tag} className="hashtag-table-row">
                        <span className="row-rank">{i + 1}</span>

                        <span className="row-tag">
                          <span
                            className="tag-dot"
                            style={{ background: BAR_COLORS[i] ?? '#ccc' }}
                          />
                          {hashtag.tag}
                        </span>

                        <span className="row-reach">{hashtag.displayReach}</span>

                        <span className={`row-trend trend--${trendData.trend}`}>
                          {trendData.trend === 'up'     && '↑'}
                          {trendData.trend === 'down'   && '↓'}
                          {trendData.trend === 'stable' && '→'}
                          {' '}{trendData.pct}
                        </span>

                        <div className="row-bar-wrapper">
                          <div
                            className="row-bar"
                            style={{
                              width: `${barWidth}%`,
                              background: BAR_COLORS[i] ?? 'var(--color-coral)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Side panel */}
          <div className="hashtag-side-panel">
            {/* Top 3 leaderboard */}
            <div className="card hashtag-podium-card">
              <div className="card-header">
                <h3>🏆 Top 3 This Week</h3>
              </div>
              <div className="card-body">
                {state.hashtags.slice(0, 3).map((h: Hashtag, i: number) => (
                  <div key={h.tag} className="podium-row">
                    <span className={`podium-rank podium-rank--${i + 1}`}>{i + 1}</span>
                    <span className="podium-tag">{h.tag}</span>
                    <span className="podium-reach">{h.displayReach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick insight */}
            {state.hashtags.length >= 3 && (() => {
              const top = state.hashtags[0];
              const low = state.hashtags[state.hashtags.length - 1];
              return (
                <div className="card hashtag-insight-card">
                  <div className="card-header">
                    <h3>📈 Insight</h3>
                  </div>
                  <div className="card-body">
                    <p className="insight-text">
                      <strong>{top.tag}</strong> is your best-performing hashtag with{' '}
                      <strong>{top.displayReach} reach</strong>. Include it
                      in every post for maximum visibility.
                    </p>
                    <p className="insight-text" style={{ marginTop: 12 }}>
                      Consider creating a <strong>{low.tag}</strong> campaign to boost its
                      engagement — it has room to grow at {low.displayReach}.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHashtags;
