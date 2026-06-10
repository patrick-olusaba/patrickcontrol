// ============================================================
// PatrickControl – Hashtag Suggestions
// Shows all hashtag bundles, lets users copy them.
// ============================================================

import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import type { HashtagBundle } from './types';
import './HashtagSuggestions.css';

const HashtagSuggestions: React.FC = () => {
  const { state, showToast } = useAppContext();
  const [copiedBundle, setCopiedBundle] = useState<string | null>(null);

  const copyBundle = (bundle: HashtagBundle) => {
    const text = bundle.tags.join(' ');
    navigator.clipboard.writeText(text).catch(() => {
      // fallback for environments without clipboard API
      console.log('Copied (fallback):', text);
    });
    setCopiedBundle(bundle.id);
    showToast(`📋 Copied ${bundle.name} to clipboard`);
    setTimeout(() => setCopiedBundle(null), 2000);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Hashtag Suggestions</h2>
          <p>Curated bundles for maximum reach</p>
        </div>
      </div>

      <div className="page-body">
        <div className="hashtag-bundles-grid">
          {state.hashtagBundles.map((bundle: HashtagBundle) => (
            <div key={bundle.id} className="card hashtag-bundle-card">
              <div className="card-header">
                <h3>{bundle.name}</h3>
                <span className="badge badge-scheduled">{bundle.tags.length} tags</span>
              </div>
              <div className="card-body">
                <div className="bundle-tags">
                  {bundle.tags.map((tag) => (
                    <span key={tag} className="hashtag-chip bundle-tag">{tag}</span>
                  ))}
                </div>
                <button
                  className={`btn btn-sm ${copiedBundle === bundle.id ? 'btn-teal' : 'btn-secondary'} copy-bundle-btn`}
                  onClick={() => copyBundle(bundle)}
                >
                  {copiedBundle === bundle.id ? '✓ Copied!' : '📋 Copy All'}
                </button>
              </div>
            </div>
          ))}

          {/* Tip card */}
          <div className="card hashtag-tip-card">
            <div className="card-header">
              <h3>💡 Hashtag Tips</h3>
            </div>
            <div className="card-body">
              <ul className="hashtag-tips-list">
                <li>Mix high-reach (&gt;10K) and niche (&lt;1K) hashtags for best results.</li>
                <li>Instagram recommends 3–5 targeted hashtags per post.</li>
                <li>TikTok hashtags in captions boost discoverability significantly.</li>
                <li>Rotate bundles to avoid shadowban on Instagram.</li>
                <li>Add location hashtags for local reach (e.g. #NairobiTech, #LagosDevs).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HashtagSuggestions;
