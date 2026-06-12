// ============================================================
// Social Media Hub – Settings
// Profile, connected accounts, notification preferences
// ============================================================

import React, { useEffect, useState } from 'react';
import type { AppSettings } from '../types/types';
import { apiGetSettings } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { PlatformIcon } from './platforms';
import './Settings.css';

const Settings: React.FC = () => {
  const { showToast } = useAppContext();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetSettings().then((data) => { setSettings(data); setLoading(false); });
  }, []);

  const handleSave = () => {
    showToast('✅ Settings saved');
  };

  if (loading) {
    return (
      <>
        <div className="page-header"><div><h2>Settings</h2></div></div>
        <div className="page-body"><div className="loading-shell">
          <div className="skeleton skeleton-card" style={{ height: 300 }} />
        </div></div>
      </>
    );
  }

  if (!settings) return null;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your profile, accounts, and preferences</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>

      <div className="page-body">
        <div className="settings-layout">
          {/* Profile */}
          <div className="card settings-section">
            <div className="card-header"><h3>Profile</h3></div>
            <div className="card-body">
              <div className="settings-profile-header">
                <div className="settings-avatar">
                  {settings.profileAvatar ? (
                    <img src={settings.profileAvatar} alt="" />
                  ) : (
                    <span>{settings.profileName[0]}</span>
                  )}
                </div>
                <div>
                  <p className="settings-profile-name">{settings.profileName}</p>
                  <button className="settings-link-btn">Change Avatar</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input className="form-input" defaultValue={settings.profileName} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" defaultValue={settings.profileBio} rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Timezone</label>
                <select className="form-select" defaultValue={settings.timezone}>
                  <option>Africa/Lagos</option>
                  <option>Africa/Nairobi</option>
                  <option>Europe/London</option>
                  <option>America/New_York</option>
                  <option>Asia/Dubai</option>
                </select>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="card settings-section">
            <div className="card-header"><h3>Connected Accounts</h3></div>
            <div className="card-body">
              <div className="settings-accounts-list">
                {settings.connectedAccounts.map((acct) => (
                  <div key={acct.platform} className="settings-account-row">
                    <div className="settings-account-info">
                      <span className="settings-account-platform">
                        <PlatformIcon platform={acct.platform} />
                        {' '}{acct.platform}
                      </span>
                      <span className="settings-account-handle">{acct.handle}</span>
                      {acct.connected && (
                        <span className="settings-account-followers">{acct.followers.toLocaleString()} followers</span>
                      )}
                    </div>
                    <span className={`settings-account-status ${acct.connected ? 'connected' : ''}`}>
                      {acct.connected ? '✓ Connected' : 'Connect'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card settings-section">
            <div className="card-header"><h3>Notifications</h3></div>
            <div className="card-body">
              <div className="settings-toggles">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Get weekly digest and alerts via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Real-time alerts for new comments and mentions' },
                  { key: 'autoSchedule', label: 'Auto-Schedule', desc: 'Automatically spread posts across optimal posting times' },
                ].map((item) => (
                  <div key={item.key} className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <p className="settings-toggle-label">{item.label}</p>
                      <p className="settings-toggle-desc">{item.desc}</p>
                    </div>
                    <label className="settings-switch">
                      <input
                        type="checkbox"
                        defaultChecked={(settings as any)[item.key] ?? false}
                      />
                      <span className="settings-switch-track" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
