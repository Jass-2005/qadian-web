import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';
import './AccessBanner.css';

export default function AccessBanner({ expiryDate, onExpire, isAdmin }) {
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!expiryDate || isAdmin) return;

    const checkTimer = () => {
      const now = Date.now();
      const diff = expiryDate.getTime() - now;
      const totalSec = Math.floor(diff / 1000);

      if (totalSec <= 0) {
        setSecondsRemaining(0);
        if (onExpire) onExpire();
      } else {
        setSecondsRemaining(totalSec);
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [expiryDate, onExpire, isAdmin]);

  // STRICT REQUIREMENT:
  // Do NOT show the timer the whole time!
  // ONLY show to the person in the last minute (<= 60 seconds)
  if (dismissed || secondsRemaining === null || secondsRemaining > 60 || secondsRemaining <= 0 || isAdmin) {
    return null;
  }

  return (
    <aside 
      className="last-minute-warning-banner"
      role="alert"
      aria-live="assertive"
    >
      <div className="warning-content">
        <div className="warning-icon-pulse">
          <AlertTriangle size={16} />
        </div>
        <div className="warning-text-group">
          <strong className="warning-headline">Session Ending Soon</strong>
          <span className="warning-detail">
            Your access link expires in <span className="warning-seconds-pill">{secondsRemaining}s</span>
          </span>
        </div>
      </div>
      <button 
        type="button"
        className="btn-warning-dismiss" 
        onClick={() => setDismissed(true)}
        aria-label="Dismiss warning"
        title="Dismiss warning"
      >
        <X size={13} />
      </button>
    </aside>
  );
}
