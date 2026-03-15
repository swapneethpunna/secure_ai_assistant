import { Palette } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoDelete, setAutoDelete] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your preferences and security</p>
      </div>

      {/* ── Security Status Card ─────────────────────────────── */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div>
            <p className="settings-card-title">Security Status</p>
            <p className="settings-card-sub">All systems encrypted and secure</p>
          </div>
          <span className="status-badge green">Active</span>
        </div>

        <div className="encryption-grid">
          <div className="encryption-card">
            <div className="enc-icon green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="enc-label">Document Encryption</p>
            <p className="enc-value">AES-256</p>
          </div>
          <div className="encryption-card">
            <div className="enc-icon green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="enc-label">Chat Encryption</p>
            <p className="enc-value">End-to-End</p>
          </div>
          <div className="encryption-card">
            <div className="enc-icon green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="enc-label">Transport Layer</p>
            <p className="enc-value">TLS 1.3</p>
          </div>
        </div>
      </div>

      {/* ── Appearance ───────────────────────────────────────── */}
      <div className="settings-card">
        <div className="settings-section-title">
          <div className="settings-section-icon purple">
            <Palette/>
          </div>
          <span>Appearance</span>
        </div>

        <div className="settings-row">
          <div className="settings-row-left">
            <div className="row-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
            <div>
              <p className="row-title">Dark Mode</p>
              <p className="row-sub">Switch between light and dark theme</p>
            </div>
          </div>
          <Toggle value={darkMode} onChange={setDarkMode} />
        </div>
      </div>
    </div>
  );
};

/* ── Toggle component ───────────────────────────────────────── */
type ToggleProps = { value: boolean; onChange: (v: boolean) => void };

const Toggle = ({ value, onChange }: ToggleProps) => (
  <button
    className={`toggle ${value ? "toggle-on" : ""}`}
    onClick={() => onChange(!value)}
    role="switch"
    aria-checked={value}
  >
    <span className="toggle-thumb" />
  </button>
);

export default Settings;