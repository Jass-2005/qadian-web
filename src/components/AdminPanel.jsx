import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Eye, 
  LogOut, 
  ArrowLeft,
  Calendar,
  Share2,
  Terminal,
  Zap,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import './AdminPanel.css';
import { ACCESS_CONFIG } from '../config/accessConfig';

const PRESET_DURATIONS = [
  { label: '1 Hour', hours: 1 },
  { label: '4 Hours', hours: 4 },
  { label: '12 Hours', hours: 12 },
  { label: '24 Hours', hours: 24 },
  { label: '3 Days', hours: 72 },
  { label: '7 Days', hours: 168 }
];

export default function AdminPanel({ 
  onClose, 
  onSimulateLastMinute, 
  onSimulateExpired, 
  theme, 
  toggleTheme 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('qadian_admin_unlocked') === 'true' ||
           localStorage.getItem('qadian_admin_unlocked') === 'true';
  });

  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCmd, setCopiedCmd] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Link Generator State
  const [selectedHours, setSelectedHours] = useState(24);
  const [isCustom, setIsCustom] = useState(false);
  const [customDateTime, setCustomDateTime] = useState('');

  // Live calculation of the shared public link
  const [timeRemainingStr, setTimeRemainingStr] = useState('');
  const [isCurrentlyExpired, setIsCurrentlyExpired] = useState(false);

  const expiryTimestamp = ACCESS_CONFIG.expiryTimestamp 
    ? new Date(ACCESS_CONFIG.expiryTimestamp).getTime() 
    : null;

  useEffect(() => {
    if (!expiryTimestamp || !ACCESS_CONFIG.isExpiryActive) {
      setTimeRemainingStr('Permanent (Expiry Inactive)');
      setIsCurrentlyExpired(false);
      return;
    }

    const updateStatus = () => {
      const now = Date.now();
      const diff = expiryTimestamp - now;

      if (diff <= 0) {
        setTimeRemainingStr('Expired');
        setIsCurrentlyExpired(true);
      } else {
        setIsCurrentlyExpired(false);
        const totalSec = Math.floor(diff / 1000);
        const hours = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        if (hours > 0) {
          setTimeRemainingStr(`${hours}h ${mins}m ${secs}s remaining`);
        } else if (mins > 0) {
          setTimeRemainingStr(`${mins}m ${secs}s remaining`);
        } else {
          setTimeRemainingStr(`${secs}s remaining (Last-Minute Warning Active)`);
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [expiryTimestamp]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim() === ACCESS_CONFIG.adminPasscode) {
      sessionStorage.setItem('qadian_admin_unlocked', 'true');
      localStorage.setItem('qadian_admin_unlocked', 'true');
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('qadian_admin_unlocked');
    localStorage.removeItem('qadian_admin_unlocked');
    setIsAuthenticated(false);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'cmd') {
      setCopiedCmd(text);
      setTimeout(() => setCopiedCmd(''), 2500);
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Base URL calculation for custom links
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
  let customExpiryTimestamp = Date.now() + selectedHours * 3600 * 1000;
  if (isCustom && customDateTime) {
    customExpiryTimestamp = new Date(customDateTime).getTime();
  }
  const customShareLink = `${baseUrl}/#exp=${customExpiryTimestamp}`;

  // If not authenticated, show passcode login screen
  if (!isAuthenticated) {
    return (
      <div className="admin-gate-wrapper">
        <article className="admin-gate-card">
          <div className="admin-gate-icon">
            <Lock size={32} />
          </div>
          <header>
            <h1 className="admin-gate-title">Dsidein Command Center</h1>
            <p className="admin-gate-subtitle">Access & Expiration Administration</p>
          </header>

          <form onSubmit={handleLoginSubmit} className="admin-gate-form">
            <div className="admin-field-group">
              <label htmlFor="admin-passcode-field" className="admin-field-label">
                <KeyRound size={14} /> Master Admin Passcode
              </label>
              <input 
                id="admin-passcode-field"
                type="password"
                className="admin-gate-input"
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                aria-label="Admin passcode"
              />
            </div>

            {errorMsg && (
              <p className="admin-gate-error" role="alert">{errorMsg}</p>
            )}

            <button type="submit" className="btn-gate-submit">
              Sign In to Admin Console
            </button>
          </form>

          <button 
            type="button" 
            className="btn-gate-back"
            onClick={onClose}
          >
            <ArrowLeft size={14} /> Return to Public View
          </button>
        </article>
      </div>
    );
  }

  // Authenticated Admin Console
  return (
    <div className="admin-panel-wrapper">
      {/* Top Header */}
      <header className="admin-navbar">
        <div className="admin-nav-container">
          <div className="admin-nav-brand">
            <div className="admin-brand-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="admin-portal-title">Dsidein Access Administration</div>
              <div className="admin-portal-sub">18-Qadian Assembly Segment • Private Console</div>
            </div>
          </div>

          <div className="admin-nav-actions">
            <button 
              type="button"
              className="btn-admin-theme" 
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button 
              type="button"
              className="btn-exit-admin" 
              onClick={onClose}
              title="Return to the live dashboard"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard</span>
            </button>

            <button 
              type="button"
              className="btn-admin-logout" 
              onClick={handleLogout}
              title="Lock Admin Console"
            >
              <LogOut size={14} />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-container">
        {/* Status Card: Live Status of Shared Base Link */}
        <section className="admin-card live-status-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <div className="card-badge">LIVE STATUS</div>
              <h2 className="card-main-heading">Shared Public Link Status</h2>
            </div>
            <div className={`status-pill ${isCurrentlyExpired ? 'expired' : 'active'}`}>
              {isCurrentlyExpired ? '🔴 EXPIRED' : '🟢 ACTIVE'}
            </div>
          </div>

          <div className="status-grid">
            <div className="status-grid-item">
              <span className="grid-label">Configured Expiry (IST)</span>
              <strong className="grid-value">
                {ACCESS_CONFIG.expiryTimestamp ? ACCESS_CONFIG.expiryTimestamp.replace('T', ' ') : 'None'}
              </strong>
            </div>
            <div className="status-grid-item">
              <span className="grid-label">Time Remaining</span>
              <strong className={`grid-value ${isCurrentlyExpired ? 'text-danger' : 'text-success'}`}>
                {timeRemainingStr}
              </strong>
            </div>
            <div className="status-grid-item">
              <span className="grid-label">Visitor Frontend Experience</span>
              <strong className="grid-value text-secondary">
                No timer shown • Last 60s alert only • Auto-locks at 0s
              </strong>
            </div>
          </div>

          {/* Quick Simulation / Testing Tools */}
          <div className="simulation-toolbar">
            <span className="simulation-title">
              <Eye size={14} /> Visitor Simulation:
            </span>
            <button 
              type="button"
              className="btn-sim-action"
              onClick={onSimulateLastMinute}
              title="Test how the 60-second warning toast appears to visitors"
            >
              <AlertTriangle size={13} /> Test 60s Warning Toast
            </button>
            <button 
              type="button"
              className="btn-sim-action"
              onClick={onSimulateExpired}
              title="Preview the full Expired Screen"
            >
              <Clock size={13} /> Preview Expired Page
            </button>
          </div>
        </section>

        {/* Card 2: Quick CLI Commands to Change Expiry on GitHub Pages */}
        <section className="admin-card cli-commands-card">
          <header className="card-header-row">
            <div className="card-title-group">
              <div className="card-badge terminal-badge">
                <Terminal size={12} /> LIVE UPDATE CONTROLS
              </div>
              <h2 className="card-main-heading">Change Expiration on GitHub Pages</h2>
            </div>
          </header>

          <p className="card-description">
            Run any command below in your terminal to change the expiration time and immediately push the update live to GitHub Pages:
          </p>

          <div className="commands-list">
            <div className="command-row">
              <div className="command-info">
                <strong className="command-title">Kill Link Immediately</strong>
                <span className="command-desc">Locks the site and shows the expired screen right now for all visitors</span>
              </div>
              <button 
                type="button"
                className={`btn-copy-cmd ${copiedCmd === 'python set_expiry.py now' ? 'copied' : ''}`}
                onClick={() => copyToClipboard('python set_expiry.py now', 'cmd')}
              >
                <code>python set_expiry.py now</code>
                {copiedCmd === 'python set_expiry.py now' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="command-row">
              <div className="command-info">
                <strong className="command-title">Extend for 1 Hour</strong>
                <span className="command-desc">Allows visitors to view for 1 more hour from now</span>
              </div>
              <button 
                type="button"
                className={`btn-copy-cmd ${copiedCmd === 'python set_expiry.py +1h' ? 'copied' : ''}`}
                onClick={() => copyToClipboard('python set_expiry.py +1h', 'cmd')}
              >
                <code>python set_expiry.py +1h</code>
                {copiedCmd === 'python set_expiry.py +1h' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="command-row">
              <div className="command-info">
                <strong className="command-title">Extend for 2 Hours</strong>
                <span className="command-desc">Allows visitors to view for 2 hours from now</span>
              </div>
              <button 
                type="button"
                className={`btn-copy-cmd ${copiedCmd === 'python set_expiry.py +2h' ? 'copied' : ''}`}
                onClick={() => copyToClipboard('python set_expiry.py +2h', 'cmd')}
              >
                <code>python set_expiry.py +2h</code>
                {copiedCmd === 'python set_expiry.py +2h' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="command-row">
              <div className="command-info">
                <strong className="command-title">Set Specific Time Today</strong>
                <span className="command-desc">Set an exact hour (e.g. 8:00 PM IST)</span>
              </div>
              <button 
                type="button"
                className={`btn-copy-cmd ${copiedCmd === 'python set_expiry.py "20:00"' ? 'copied' : ''}`}
                onClick={() => copyToClipboard('python set_expiry.py "20:00"', 'cmd')}
              >
                <code>python set_expiry.py "20:00"</code>
                {copiedCmd === 'python set_expiry.py "20:00"' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="command-row">
              <div className="command-info">
                <strong className="command-title">Remove Expiration (Open Access)</strong>
                <span className="command-desc">Keeps the link active indefinitely without any expiration</span>
              </div>
              <button 
                type="button"
                className={`btn-copy-cmd ${copiedCmd === 'python set_expiry.py disable' ? 'copied' : ''}`}
                onClick={() => copyToClipboard('python set_expiry.py disable', 'cmd')}
              >
                <code>python set_expiry.py disable</code>
                {copiedCmd === 'python set_expiry.py disable' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </section>

        {/* Card 3: New Custom Expiring Link Generator */}
        <section className="admin-card link-generator-card">
          <header className="card-header-row">
            <div className="card-title-group">
              <div className="card-badge share-badge">
                <Share2 size={12} /> CUSTOM LINKS
              </div>
              <h2 className="card-main-heading">Generate Additional Expiring Links</h2>
            </div>
          </header>

          <p className="card-description">
            Need to share a private link with someone else for a different duration? Generate a custom link below:
          </p>

          <div className="generator-body">
            <div className="preset-grid">
              {PRESET_DURATIONS.map((preset) => (
                <button
                  key={preset.hours}
                  type="button"
                  className={`btn-admin-preset ${!isCustom && selectedHours === preset.hours ? 'active' : ''}`}
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedHours(preset.hours);
                  }}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                className={`btn-admin-preset ${isCustom ? 'active' : ''}`}
                onClick={() => setIsCustom(true)}
              >
                Custom Date/Time
              </button>
            </div>

            {isCustom && (
              <div className="custom-input-box">
                <label htmlFor="admin-custom-date" className="custom-label">
                  <Calendar size={13} /> Select Expiration Date & Time:
                </label>
                <input 
                  id="admin-custom-date"
                  type="datetime-local"
                  className="admin-custom-date-field"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}

            <div className="generated-link-row">
              <input 
                type="text" 
                readOnly 
                value={customShareLink}
                className="admin-link-input"
                onClick={(e) => e.target.select()}
                aria-label="Generated custom link"
              />
              <button 
                type="button"
                className={`btn-copy-custom-link ${copiedLink ? 'copied' : ''}`}
                onClick={() => copyToClipboard(customShareLink, 'link')}
              >
                {copiedLink ? (
                  <>
                    <Check size={14} /> <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} /> <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
