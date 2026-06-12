// ============================================================
// Social Media Hub – App Shell
// Top bar + white text sidebar layout
// ============================================================

import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

const Dashboard          = lazy(() => import('./components/Dashboard'));
const CreatePost         = lazy(() => import('./components/CreatePost'));
const ContentCalendar    = lazy(() => import('./components/ContentCalendar'));
const CommentsList       = lazy(() => import('./components/CommentsList'));
const HashtagSuggestions = lazy(() => import('./components/HashtagSuggestions'));
const TopHashtags        = lazy(() => import('./components/TopHashtags'));
const Drafts             = lazy(() => import('./components/Drafts'));
const PublishedPosts     = lazy(() => import('./components/PublishedPosts'));
const MediaLibrary       = lazy(() => import('./components/MediaLibrary'));
const Settings           = lazy(() => import('./components/Settings'));
const Templates          = lazy(() => import('./components/Templates'));

import './styles.css';

// ── Navigation items ───────────────────────────────────────
const NAV_ITEMS = [
  { to: '/',             label: 'Dashboard',       icon: '⊞' },
  { to: '/calendar',     label: 'Calendar',         icon: '◫' },
  { to: '/create',       label: 'Create Post',      icon: '✚' },
  { to: '/drafts',       label: 'Drafts',           icon: '📝' },
  { to: '/published',    label: 'Published',        icon: '✓' },
  { to: '/templates',    label: 'Templates',        icon: '📋' },
  { to: '/comments',     label: 'Comments',         icon: '◎' },
  { to: '/hashtags',     label: 'Hashtags',         icon: '⌗' },
  { to: '/top-tags',     label: 'Top Hashtags',     icon: '▲' },
  { to: '/media',        label: 'Media Library',    icon: '🖼' },
  { to: '/settings',     label: 'Settings',         icon: '⚙' },
];

// ── Top Bar ────────────────────────────────────────────────
const TopBar: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  return (
    <header className="top-bar" role="banner">
      <button
        className="mobile-menu-btn"
        onClick={onMobileMenuToggle}
        aria-label="Toggle navigation"
        style={{ position: 'static' }}
      >
        ☰
      </button>

      <a href="/" className="top-bar-logo" aria-label="Social Media Hub home">
        <div className="logo-mark" aria-hidden="true">P</div>
        <span className="logo-text">PatrickControl</span>
      </a>

      <div className="top-bar-spacer" />

      <div className="top-bar-actions">
        <button
          className="top-bar-create-btn"
          onClick={() => navigate('/create')}
          aria-label="Create new post"
        >
          <span aria-hidden="true">＋</span>
          <span>Create Post</span>
        </button>

        <div className="top-bar-user" role="button" aria-label="User menu" tabIndex={0}>
          <div className="top-bar-avatar" aria-hidden="true">P</div>
          <span className="top-bar-username">Patrick</span>
          <span className="top-bar-chevron" aria-hidden="true">▾</span>
        </div>
      </div>
    </header>
  );
};

// ── Left Sidebar ───────────────────────────────────────────
const Sidebar: React.FC<{ mobileOpen: boolean; onClose: () => void }> = ({
  mobileOpen,
  onClose,
}) => {
  const { state } = useAppContext();
  const activeMembers = state.teamMembers.filter((m) => m.active).length;

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <nav
        className={`sidebar ${mobileOpen ? 'open' : ''}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={onClose}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="team-status">
            <div className="team-dot" />
            <div className="footer-text">
              <strong>{activeMembers} active</strong>
              <br />
              <span>Team online</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

// ── Toast ──────────────────────────────────────────────────
const Toast: React.FC = () => {
  const { state } = useAppContext();
  if (!state.toast) return null;
  return (
    <div className="toast-wrapper" aria-live="polite" aria-atomic="true">
      <div className="toast">{state.toast}</div>
    </div>
  );
};

// ── Page Transition ────────────────────────────────────────
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [key, setKey] = useState(0);
  useEffect(() => { setKey((k) => k + 1); }, [location.pathname]);
  return <div className="page-enter" key={key}>{children}</div>;
};

// ── Inner App ──────────────────────────────────────────────
const InnerApp: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <TopBar onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)} />

      <div className="body-layout">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div className="main-content">
          <PageTransition>
            <Suspense fallback={
              <div className="page-body">
                <div className="loading-shell">
                  <div className="skeleton-metrics">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="skeleton skeleton-metric" />
                    ))}
                  </div>
                  <div className="skeleton skeleton-card" style={{ height: 220 }} />
                </div>
              </div>
            }>
            <Routes>
              <Route path="/"           element={<Dashboard />}          />
              <Route path="/create"     element={<CreatePost />}          />
              <Route path="/calendar"   element={<ContentCalendar />}     />
              <Route path="/drafts"     element={<Drafts />}              />
              <Route path="/published"  element={<PublishedPosts />}      />
              <Route path="/templates"  element={<Templates />}           />
              <Route path="/comments"   element={<CommentsList />}        />
              <Route path="/hashtags"   element={<HashtagSuggestions />}  />
              <Route path="/top-tags"   element={<TopHashtags />}         />
              <Route path="/media"      element={<MediaLibrary />}        />
              <Route path="/settings"   element={<Settings />}            />
              <Route path="*"           element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
          </PageTransition>
        </div>
      </div>

      <Toast />
    </div>
  );
};

// ── Root App ───────────────────────────────────────────────
const App: React.FC = () => (
  <AppProvider>
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  </AppProvider>
);

export default App;
