import React from 'react';
import { X, TrendingUp, TrendingDown, Award, Users, AlertCircle, Printer } from 'lucide-react';

export default function BoothModal({ booth, onClose }) {
  if (!booth) return null;

  const d22 = booth.data_2022;
  const d24 = booth.data_2024;
  const comp = booth.comparison;

  // Safe percentage helper
  const getWidth = (votes, total) => {
    if (!total || total === 0) return '0%';
    return `${Math.min(100, Math.round((votes / total) * 100))}%`;
  };

  const handlePrintBooth = (e) => {
    e.stopPropagation();
    document.body.classList.add('printing-single-booth');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-single-booth');
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Dsidein Official PDF Watermark (Active on print) */}
        <div className="dsidein-print-watermark" aria-hidden="true">
          <img src="./dsidein_logo_transparent.png" alt="Dsidein" className="watermark-logo-img" />
          <div className="watermark-brand-name">DSIDEIN</div>
          <div className="watermark-sub-name">18-QADIAN BOOTH INTELLIGENCE</div>
          <div className="watermark-url">https://dsidein.com/qadian-2022-2024</div>
        </div>

        {/* Printable Official Banner (Shows during print) */}
        <div className="print-dossier-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="print-dossier-title">18-QADIAN ASSEMBLY SEGMENT — BOOTH DOSSIER</div>
              <div className="print-dossier-sub">
                Election Commission Data: 2022 Assembly vs 2024 Parliamentary Analysis
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#334155' }}>
              <span style={{ fontWeight: 800, color: '#002b49' }}>DSIDEIN COMMAND CENTER</span><br />
              <span>https://dsidein.com/qadian-2022-2024</span>
            </div>
          </div>
        </div>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-badges-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-badge">Booth #{booth.booth_no}</span>
              <span className={`status-badge ${comp.is_flip ? 'flipped' : 'retained'}`}>
                {comp.status_label}
              </span>
            </div>
            <h2 className="modal-village-title">{booth.village_english}</h2>
            <p className="modal-village-sub punjabi-text">
              {booth.village_punjabi}
            </p>
          </div>
          <div className="modal-header-right">
            <button 
              className="btn-print-modal no-print" 
              onClick={handlePrintBooth}
              title="Export / Print this Booth Dossier as PDF"
            >
              <Printer size={15} />
              <span>Export PDF</span>
            </button>
            <button className="modal-close no-print" onClick={onClose} aria-label="Close Modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Side-by-side Comparative Cards */}
        <div className="compare-grid">
          {/* 2022 Assembly Column */}
          <div className="year-card">
            <div className="year-title">2022 Assembly Election</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className={`badge-winner ${d22.winner_party}`}>
                {d22.winner_party} Won
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                +{d22.margin} lead
              </span>
            </div>

            {/* INC Bar */}
            <div className="vote-bar-wrap">
              <div className="vote-bar-label">
                <span>INC (Bajwa)</span>
                <span><strong>{d22.inc}</strong> ({d22.inc_pct}%)</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: getWidth(d22.inc, d22.total), background: 'var(--color-inc)' }} />
              </div>
            </div>

            {/* AAP Bar */}
            <div className="vote-bar-wrap">
              <div className="vote-bar-label">
                <span>AAP (Mahal)</span>
                <span><strong>{d22.aap}</strong> ({d22.aap_pct}%)</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: getWidth(d22.aap, d22.total), background: 'var(--color-aap)' }} />
              </div>
            </div>

            {/* SAD Bar */}
            <div className="vote-bar-wrap">
              <div className="vote-bar-label">
                <span>SAD (Sekhwan)</span>
                <span><strong>{d22.sad}</strong> ({d22.sad_pct}%)</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: getWidth(d22.sad, d22.total), background: 'var(--color-sad)' }} />
              </div>
            </div>

            {/* Total 2022 */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '12px', fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Polled:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{d22.total}</strong>
            </div>
          </div>

          {/* 2024 Lok Sabha Column */}
          <div className="year-card">
            <div className="year-title">2024 Lok Sabha Election</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className={`badge-winner ${d24.winner_party}`}>
                {d24.winner_party} Won
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                +{d24.margin} lead
              </span>
            </div>

            {/* INC Bar */}
            <div className="vote-bar-wrap">
              <div className="vote-bar-label">
                <span>INC (Randhawa)</span>
                <span><strong>{d24.inc}</strong> ({d24.inc_pct}%)</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: getWidth(d24.inc, d24.total), background: 'var(--color-inc)' }} />
              </div>
            </div>

            {/* AAP Bar */}
            <div className="vote-bar-wrap">
              <div className="vote-bar-label">
                <span>AAP (Kalsi)</span>
                <span><strong>{d24.aap}</strong> ({d24.aap_pct}%)</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: getWidth(d24.aap, d24.total), background: 'var(--color-aap)' }} />
              </div>
            </div>

            {/* BJP Bar */}
            <div className="vote-bar-wrap">
              <div className="vote-bar-label">
                <span>BJP (Babbu)</span>
                <span><strong>{d24.bjp}</strong> ({d24.bjp_pct}%)</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: getWidth(d24.bjp, d24.total), background: 'var(--color-bjp)' }} />
              </div>
            </div>

            {/* SAD Bar */}
            <div className="vote-bar-wrap">
              <div className="vote-bar-label">
                <span>SAD (Cheema)</span>
                <span><strong>{d24.sad}</strong> ({d24.sad_pct}%)</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: getWidth(d24.sad, d24.total), background: 'var(--color-sad)' }} />
              </div>
            </div>

            {/* SAD-A & Others */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              SAD(A): {d24.sada} | Others: {d24.baaki} | NOTA: {d24.nota}
            </div>

            {/* Total 2024 */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Polled:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{d24.total}</strong>
            </div>
          </div>
        </div>

        {/* Turnout & Swing Summary Card */}
        <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Turnout & Vote Shift Analysis
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Turnout Shift:</span>
              <div style={{ fontWeight: 700, color: comp.turnout_diff >= 0 ? 'var(--color-gain)' : 'var(--color-loss)' }}>
                {comp.turnout_diff > 0 ? `+${comp.turnout_diff}` : comp.turnout_diff} ({comp.turnout_pct}%)
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>INC Swing:</span>
              <div style={{ fontWeight: 700, color: comp.inc_swing >= 0 ? 'var(--color-gain)' : 'var(--color-loss)' }}>
                {comp.inc_swing >= 0 ? `+${comp.inc_swing}%` : `${comp.inc_swing}%`}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>AAP Swing:</span>
              <div style={{ fontWeight: 700, color: comp.aap_swing >= 0 ? 'var(--color-gain)' : 'var(--color-loss)' }}>
                {comp.aap_swing >= 0 ? `+${comp.aap_swing}%` : `${comp.aap_swing}%`}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>BJP Impact:</span>
              <div style={{ fontWeight: 700, color: 'var(--color-bjp)' }}>
                {comp.bjp_gain}% ({d24.bjp} votes)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
