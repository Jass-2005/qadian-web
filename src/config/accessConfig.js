/**
 * ACCESS & EXPIRATION CONFIGURATION
 * ============================================================================
 * Local Timezone: Indian Standard Time (IST, UTC+05:30)
 * ============================================================================
 */

export const ACCESS_CONFIG = {
  // If true, visiting the base link without an #exp= or ?exp= token shows NOTHING
  blockBaseLink: true,

  // If true, expired links also show NOTHING instead of any details
  showBlankWhenExpired: true,

  // Set to true to enforce the expiration date & time below
  isExpiryActive: true,

  // Default fallback timestamp (past time = expired immediately)
  expiryTimestamp: "2026-09-23T17:00:00+05:30",

  // Master Admin Passcode:
  // If locked, open #admin or press Alt+A to enter this passcode
  adminPasscode: "qadian2026",

  // Title and message displayed on the Expired Screen (if showBlankWhenExpired is false)
  title: "Temporary Access Expired",
  subtitle: "18-Qadian Assembly Election Analytics Portal",
  message: "The scheduled review window for this temporary link has concluded.",
  contactNote: "If you need renewed or extended access, please contact the administrator."
};

/**
 * Helper to check whether the current visitor is authorized
 * - Base link without token => showNothing: true
 * - Expired link => showNothing: true
 * - Valid active token link => granted until expiry
 * - Admin logged in => granted permanently
 */
export function checkAccessStatus() {
  // Check if admin is already unlocked in this browser session
  const adminUnlocked = sessionStorage.getItem('qadian_admin_unlocked') === 'true' ||
                        localStorage.getItem('qadian_admin_unlocked') === 'true';
  
  if (adminUnlocked) {
    return { isExpired: false, isAdmin: true, showNothing: false, expiryDate: null, remainingMs: Infinity };
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

  // 3. If NO token was provided in the URL:
  if (!targetExpiry) {
    if (ACCESS_CONFIG.blockBaseLink) {
      // BASE LINK: SHOW NOTHING!
      return { 
        isExpired: true, 
        isAdmin: false, 
        showNothing: true, 
        isBaseLink: true, 
        expiryDate: null, 
        remainingMs: 0 
      };
    }

    // Fallback to global config expiry if active
    if (ACCESS_CONFIG.isExpiryActive && ACCESS_CONFIG.expiryTimestamp) {
      const parsed = new Date(ACCESS_CONFIG.expiryTimestamp).getTime();
      if (!isNaN(parsed)) {
        targetExpiry = parsed;
      }
    }
  }

  // If still no expiry, default to blocking base link
  if (!targetExpiry) {
    return { isExpired: true, isAdmin: false, showNothing: true, isBaseLink: true, expiryDate: null, remainingMs: 0 };
  }

  const remainingMs = targetExpiry - now;
  const isExpired = remainingMs <= 0;

  return {
    isExpired,
    isAdmin: false,
    showNothing: isExpired && ACCESS_CONFIG.showBlankWhenExpired,
    isBaseLink: false,
    expiryDate: new Date(targetExpiry),
    remainingMs: Math.max(0, remainingMs)
  };
}
