import React, { useEffect } from 'react';

/**
 * BlankScreen Component
 * -------------------------------------------------------------
 * Rendered when the base link is accessed without a valid token
 * or when an access link has expired.
 * Displays completely blank output with zero data in the DOM.
 */
export default function BlankScreen({ onSecretAdminTrigger }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (onSecretAdminTrigger) onSecretAdminTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSecretAdminTrigger]);

  return (
    <main 
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-primary, #0b0f17)',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    />
  );
}
