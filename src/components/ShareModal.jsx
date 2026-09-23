import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Copy, 
  Check, 
  Calendar, 
  Share2, 
  ShieldCheck, 
  ExternalLink,
  Sliders
} from 'lucide-react';
import './ShareModal.css';
import { ACCESS_CONFIG } from '../config/accessConfig';

const PRESET_DURATIONS = [
  { label: '1 Hour', hours: 1 },
  { label: '4 Hours', hours: 4 },
  { label: '12 Hours', hours: 12 },
  { label: '24 Hours (1 Day)', hours: 24 },
  { label: '3 Days', hours: 72 },
  { label: '7 Days', hours: 168 }
];

export default function ShareModal({ isOpen, onClose }) {
  const [selectedHours, setSelectedHours] = useState(24);
  const [isCustom, setIsCustom] = useState(false);
  const [customDateTime, setCustomDateTime] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate target expiration timestamp
  let expiryTimestamp;
  if (isCustom && customDateTime) {
    expiryTimestamp = new Date(customDateTime).getTime();
  } else {
    expiryTimestamp = Date.now() + selectedHours * 60 * 60 * 1000;
  }

  // Base URL (handles both local dev and production GitHub Pages)
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
  const generatedLink = `${baseUrl}/#exp=${expiryTimestamp}`;

  const formattedExpiry = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(new Date(expiryTimestamp));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.getElementById('share-link-input');
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="share-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
      <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <header className="share-modal-header">
          <div className="share-modal-title-group">
            <div className="share-icon-circle">
              <Share2 size={18} />
            </div>
            <div>
              <h2 id="share-modal-title" className="share-modal-title">Share Expiring Link</h2>
              <p className="share-modal-subtitle">Generate a time-limited access link for 18-Qadian Portal</p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-modal-close" 
            onClick={onClose}
            aria-label="Close share dialog"
          >
            <X size={18} />
          </button>
        </header>

        {/* Modal Body */}
        <main className="share-modal-body">
          {/* Preset Duration Buttons */}
          <section className="duration-selection-section">
            <label className="section-field-label">
              <Clock size={14} /> Choose Expiration Duration
            </label>
            <div className="preset-buttons-grid">
              {PRESET_DURATIONS.map((preset) => (
                <button
                  key={preset.hours}
                  type="button"
                  className={`btn-preset ${!isCustom && selectedHours === preset.hours ? 'active' : ''}`}
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
                className={`btn-preset ${isCustom ? 'active' : ''}`}
                onClick={() => setIsCustom(true)}
              >
                Custom Date/Time
              </button>
            </div>

            {isCustom && (
              <div className="custom-datetime-wrap">
                <label htmlFor="custom-date-picker" className="custom-datetime-label">
                  <Calendar size={13} /> Select Custom Expiration
                </label>
                <input
                  id="custom-date-picker"
                  type="datetime-local"
                  className="custom-datetime-input"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </section>

          {/* Expiration Summary Box */}
          <section className="expiry-summary-box">
            <div className="summary-row">
              <span className="summary-label">Link Valid Until:</span>
              <strong className="summary-value">{formattedExpiry} IST</strong>
            </div>
            <p className="summary-hint">
              After this time, anyone opening this link will see the <strong>"Access Expired"</strong> page.
            </p>
          </section>

          {/* Generated Link Field */}
          <section className="link-generation-section">
            <label htmlFor="share-link-input" className="section-field-label">Generated Share Link</label>
            <div className="share-link-input-group">
              <input 
                id="share-link-input"
                type="text" 
                readOnly 
                value={generatedLink}
                className="share-link-input"
                onClick={(e) => e.target.select()}
              />
              <button 
                type="button"
                className={`btn-copy-link ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Admin Notice */}
          <footer className="share-modal-footer-note">
            <ShieldCheck size={14} className="note-icon" />
            <span>
              <strong>Owner Protection:</strong> You can always unlock the dashboard with passcode <code>{ACCESS_CONFIG.adminPasscode}</code> even after expiration.
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
