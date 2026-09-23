import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import './AccessBanner.css';

export default function AccessBanner({ expiryDate, onExpire, isAdmin }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isWarning, setIsWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!expiryDate || isAdmin) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiryDate.getTime() - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        if (onExpire) onExpire();
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Under 15 minutes is warning state
      setIsWarning(totalSeconds < 900);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s remaining`);
      } else {
        setTimeLeft(`${seconds}s remaining`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiryDate, onExpire, isAdmin]);

  if (dismissed || !expiryDate) return null;

  return (
    <aside 
      className={`access-banner-pill ${isWarning ? 'banner-warning' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="banner-content">
        <Clock size={14} className="banner-icon" />
        <span className="banner-label">Temporary Access:</span>
        <strong className="banner-time">{timeLeft}</strong>
      </div>
      <button 
        type="button"
        className="btn-banner-close" 
        onClick={() => setDismissed(true)}
        aria-label="Dismiss access banner"
        title="Dismiss banner"
      >
        <X size={12} />
      </button>
    </aside>
  );
}
