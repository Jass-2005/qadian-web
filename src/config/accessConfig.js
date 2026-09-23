/**
 * ACCESS & EXPIRATION CONFIGURATION
 * ============================================================================
 * Use this file to set the exact date and time you want the GitHub Pages site
 * to expire for visitors.
 * 
 * Local Timezone: Indian Standard Time (IST, UTC+05:30)
 * ============================================================================
 */

export const ACCESS_CONFIG = {
  // Set to true to enforce the expiration date & time below
  isExpiryActive: true,

  // SET YOUR DESIRED EXPIRATION TIME HERE (ISO-8601 format with timezone)
  // Format: "YYYY-MM-DDTHH:mm:ss+05:30"
  // Default is set to 2 hours from 17:30 IST today (19:30 IST):
  expiryTimestamp: "2026-09-23T19:30:00+05:30",

  // Master Admin Passcode:
  // If the page expires, YOU can click "Admin Unlock" and enter this passcode
  // to view the full dashboard on your browser at any time!
  adminPasscode: "qadian2026",

  // Title and message displayed on the Expired Screen
  title: "Temporary Access Expired",
  subtitle: "18-Qadian Assembly Election Analytics Portal",
  message: "The scheduled review window for this temporary link has concluded. Access to the election registry and analytics is now restricted.",

  // Contact text shown to visitors
  contactNote: "If you need renewed or extended access, please contact the administrator."
};

/**
 * Helper to check whether the current time is past the expiration time
 * Also supports dynamic URL hash/query overrides (e.g. #exp=1727100000000)
 */
export function checkAccessStatus() {
  // Check if admin is already unlocked in this browser session
  const adminUnlocked = sessionStorage.getItem('qadian_admin_unlocked') === 'true' ||
                        localStorage.getItem('qadian_admin_unlocked') === 'true';
  
  if (adminUnlocked) {
    return { isExpired: false, isAdmin: true, expiryDate: null, remainingMs: Infinity };
  }

  const now = Date.now();
  let targetExpiry = null;

  // 1. Check URL hash for #exp=TIMESTAMP or #token=TIMESTAMP
  const hash = window.location.hash;
  const hashMatch = hash.match(/(?:exp|token)=([0-9]+)/i);
  if (hashMatch && hashMatch[1]) {
    targetExpiry = parseInt(hashMatch[1], 10);
  }

  // 2. Check URL query parameters ?exp=TIMESTAMP
  if (!targetExpiry) {
    const urlParams = new URLSearchParams(window.location.search);
    const expParam = urlParams.get('exp') || urlParams.get('token');
    if (expParam && /^[0-9]+$/.test(expParam)) {
      targetExpiry = parseInt(expParam, 10);
    }
  }

  // 3. Fallback to global config expiry if active
  if (!targetExpiry && ACCESS_CONFIG.isExpiryActive && ACCESS_CONFIG.expiryTimestamp) {
    const parsed = new Date(ACCESS_CONFIG.expiryTimestamp).getTime();
    if (!isNaN(parsed)) {
      targetExpiry = parsed;
    }
  }

  // If no expiry is configured or active, access is granted
  if (!targetExpiry) {
    return { isExpired: false, isAdmin: false, expiryDate: null, remainingMs: Infinity };
  }

  const remainingMs = targetExpiry - now;
  const isExpired = remainingMs <= 0;

  return {
    isExpired,
    isAdmin: false,
    expiryDate: new Date(targetExpiry),
    remainingMs: Math.max(0, remainingMs)
  };
}
