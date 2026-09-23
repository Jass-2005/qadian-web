import React, { useState } from 'react';
import { 
  Clock, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Sun, 
  Moon, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import './ExpiredScreen.css';
import { ACCESS_CONFIG } from '../config/accessConfig';

export default function ExpiredScreen({ 
  expiryDate, 
  onAdminUnlock, 
  theme, 
  toggleTheme 
}) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formattedDate = expiryDate 
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'Asia/Kolkata'
      }).format(expiryDate)
    : 'Scheduled Time Window';

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    if (!passcode) {
      setErrorMsg('Please enter the admin passcode.');
      return;
    }

    if (passcode.trim() === ACCESS_CONFIG.adminPasscode) {
      sessionStorage.setItem('qadian_admin_unlocked', 'true');
      localStorage.setItem('qadian_admin_unlocked', 'true');
      setErrorMsg('');
      onAdminUnlock();
    } else {
      setErrorMsg('Invalid admin passcode. Please try again.');
    }
  };

  return (
    <div className="expired-screen-wrapper">
      {/* Semantic Top Navigation / Header */}
      <header className="expired-top-nav">
        <div className="expired-nav-container">
          <div className="expired-brand">
            <div className="expired-brand-avatar">
              <img 
                src="./dsidein_logo_transparent.png" 
                alt="Dsidein Logo" 
                className="expired-logo-img" 
              />
            </div>
            <div className="expired-brand-text">
              <span className="brand-name">Dsidein</span>
              <span className="brand-separator">/</span>
              <span className="brand-context">Command Center</span>
            </div>
          </div>

          <div className="expired-nav-actions">
            <button 
              type="button"
              className="btn-theme-toggle" 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>

      {/* Semantic Main Content Area */}
      <main className="expired-main-content">
        <article className="expired-card">
          {/* Badge & Icon */}
          <div className="expired-icon-wrap" aria-hidden="true">
            <div className="expired-icon-ring">
              <Clock className="expired-clock-icon" size={36} />
            </div>
            <div className="expired-badge">
              <ShieldAlert size={13} />
              <span>ACCESS WINDOW CONCLUDED</span>
            </div>
          </div>

          {/* Titles */}
          <header className="expired-card-header">
            <h1 className="expired-title">{ACCESS_CONFIG.title}</h1>
            <p className="expired-subtitle">{ACCESS_CONFIG.subtitle}</p>
          </header>

          <p className="expired-description">
            {ACCESS_CONFIG.message}
          </p>

          {/* Details Section */}
          <section className="expired-details-box" aria-label="Access Expiration Details">
            <div className="details-row">
              <span className="details-label">Access Status</span>
              <span className="details-value status-tag-expired">Expired</span>
            </div>
            <div className="details-row">
              <span className="details-label">Expiry Timestamp</span>
              <time className="details-value details-time" dateTime={expiryDate?.toISOString?.()}>
                {formattedDate}
              </time>
            </div>
            <div className="details-row">
              <span className="details-label">Constituency</span>
              <span className="details-value">18 - Qadian (223 Booths)</span>
            </div>
          </section>

          {/* Note to visitor */}
          <p className="expired-contact-note">
            {ACCESS_CONFIG.contactNote}
          </p>

          {/* Admin Unlock Drawer */}
          <section className="expired-admin-section">
            {!showAdminLogin ? (
              <button 
                type="button"
                className="btn-show-admin"
                onClick={() => setShowAdminLogin(true)}
              >
                <KeyRound size={15} />
                <span>Administrator Unlock</span>
                <ChevronRight size={14} className="admin-chevron" />
              </button>
            ) : (
              <form onSubmit={handleUnlockSubmit} className="admin-unlock-form" noValidate>
                <div className="admin-form-header">
                  <span className="admin-form-title">
                    <Lock size={14} /> Enter Admin Passcode
                  </span>
                  <button 
                    type="button" 
                    className="btn-cancel-admin"
                    onClick={() => {
                      setShowAdminLogin(false);
                      setErrorMsg('');
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <div className="admin-input-group">
                  <input 
                    type="password"
                    className="admin-passcode-input"
                    placeholder="Enter passcode to unlock..."
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setErrorMsg('');
                    }}
                    autoFocus
                    aria-label="Admin passcode"
                  />
                  <button type="submit" className="btn-admin-submit">
                    Unlock
                  </button>
                </div>

                {errorMsg && (
                  <div className="admin-error-msg" role="alert">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            )}
          </section>
        </article>
      </main>

      {/* Semantic Footer */}
      <footer className="expired-footer">
        <p>18-Qadian Assembly Election Intelligence & Data Analytics</p>
      </footer>
    </div>
  );
}
