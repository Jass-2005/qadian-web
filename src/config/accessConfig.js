/**
 * ACCESS & EXPIRATION CONFIGURATION
 * Open access enabled - No expiration, no timer.
 */

export const ACCESS_CONFIG = {
  blockBaseLink: false,
  showBlankWhenExpired: false,
  isExpiryActive: false,
  expiryTimestamp: null,
  adminPasscode: "123@JQA"
};

export function checkAccessStatus() {
  return { 
    isExpired: false, 
    isAdmin: true, 
    showNothing: false, 
    isBaseLink: false, 
    expiryDate: null, 
    remainingMs: Infinity 
  };
}
