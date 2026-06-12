// ============================================================
// Social Media Hub – Post Templates
// Save and reuse caption + hashtag combos
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { PostTemplate } from '../types/types';
import { apiGetTemplates } from '../services/api';
import { PlatformIcon } from './platforms';
import './Templates.css';

const Templates: React.FC = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    apiGetTemplates().then((data) => { setTemplates(data); setLoading(false); });
  }, []);

  const copyTemplate = (tpl: PostTemplate) => {
    const text = `${tpl.caption}\n\n${tpl.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(tpl.id);
    showToast('📋 Template copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const useTemplate = (tpl: PostTemplate) => {
    // Store template in sessionStorage so CreatePost can pick it up
    sessionStorage.setItem('activeTemplate', JSON.stringify(tpl));
    navigate('/create');
    showToast('📝 Template loaded — ready to customise');
  };

  if (loading) {
    return (
      <>
        <div className="page-header"><div><h2>Templates</h2></div></div>
        <div className="page-body"><div className="loading-shell">
          <div className="skeleton-metrics">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton skeleton-card" style={{ height: 180 }} />))}</div>
        </div></div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Post Templates</h2>
          <p>{templates.length} templates — click to preview, copy, or use</p>
        </div>
      </div>

      <div className="page-body">
        {templates.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📋</div><p>No templates yet. Save one from Create Post!</p></div>
        ) : (
          <div className="templates-grid">
            {templates.map((tpl) => (
              <div key={tpl.id} className={`template-card card ${expanded === tpl.id ? 'expanded' : ''}`}>
                <div className="card-header" onClick={() => setExpanded(expanded === tpl.id ? null : tpl.id)} style={{ cursor: 'pointer' }}>
                  <div>
                    <h3>{tpl.name}</h3>
                    <div className="template-platforms">
                      {tpl.platforms.map((pl) => (
                        <span key={pl} className="template-platform-dot" title={pl}><PlatformIcon platform={pl} size={14} /></span>
                      ))}
                    </div>
                  </div>
                  <span className="template-chevron">{expanded === tpl.id ? '▲' : '▼'}</span>
                </div>

                {expanded === tpl.id && (
                  <div className="card-body template-expanded">
                    <p className="template-caption-preview">{tpl.caption}</p>
                    <div className="template-hashtags">
                      {tpl.hashtags.map((h) => (
                        <span key={h} className="hashtag-chip">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="template-card-actions">
                  <button className="btn btn-sm btn-primary" onClick={() => useTemplate(tpl)}>
                    ✚ Use Template
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => copyTemplate(tpl)}>
                    {copied === tpl.id ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Templates;
