// ============================================================
// PatrickControl – App Shell
// Icon sidebar (collapsible) + main content + right panel
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AppProvider, useAppContext } from './AppContext';

import Dashboard          from './Dashboard';
import CreatePost         from './CreatePost';
import ContentCalendar    from './ContentCalendar';
import CommentsList       from './CommentsList';
import HashtagSuggestions from './HashtagSuggestions';
import TopHashtags        from './TopHashtags';

import './styles.css';

// ── Navigation items ───────────────────────────────────────
const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard',   icon: '▤' },
  { to: '/create',    label: 'Create Post', icon: '✚' },
  { to: '/calendar',  label: 'Calendar',    icon: '◫' },
  { to: '/comments',  label: 'Comments',    icon: '◉' },
  { to: '/hashtags',  label: 'Hashtags',    icon: '⌗' },
  { to: '/top-tags',  label: 'Top Hashtags',icon: '▲' },
];

// ── Icon Sidebar ───────────────────────────────────────────
const Sidebar: React.FC<{ mobileOpen: boolean; onClose: () => void }> = ({
  mobileOpen,
  onClose,
}) => {
  const { state } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const activeMembers = state.teamMembers.filter((m) => m.active).length;

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <nav
        className={`sidebar ${mobileOpen ? 'open' : ''} ${expanded ? 'expanded' : ''}`}
        aria-label="Main navigation"
        onMouseEnter={() => !mobileOpen && setExpanded(true)}
        onMouseLeave={() => !mobileOpen && setExpanded(false)}
      >
        <div className="sidebar-logo">
          <span className="logo-mark">PC</span>
          <div className="logo-info">
            <span className="logo-text">PatrickControl</span>
            <span className="logo-sub">Social Dashboard</span>
          </div>
        </div>

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
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    setTransitionKey((k) => k + 1);
  }, [location.pathname]);

  return <div className="page-enter" key={transitionKey}>{children}</div>;
};

// ── Inner App ──────────────────────────────────────────────
const InnerApp: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="main-content">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <PageTransition>
          <Routes>
            <Route path="/"          element={<Dashboard />}          />
            <Route path="/create"    element={<CreatePost />}          />
            <Route path="/calendar"  element={<ContentCalendar />}     />
            <Route path="/comments"  element={<CommentsList />}        />
            <Route path="/hashtags"  element={<HashtagSuggestions />}  />
            <Route path="/top-tags"  element={<TopHashtags />}         />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
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
