import React, { useState } from 'react';
import { X, Printer, Target, Download, FileText } from 'lucide-react';

export default function BoothModal({ booth, onClose }) {
  const [mpLang, setMpLang] = useState('PA');
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
          <div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

            {/* Sekhwan Bar (2022 Assembly) */}
            <div className="vote-bar-wrap">
              <div className="vote-bar-label">
                <span>Sekhwan</span>
                <span><strong>{d22.sad}</strong> ({d22.sad_pct}%)</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: getWidth(d22.sad, d22.total), background: 'var(--color-sekhwan, #7c3aed)' }} />
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

            {/* SAD Bar (2024 Parliamentary) */}
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
        <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
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

        {/* =========================================================
            BOOTH-SPECIFIC DETAILED MASTER PLAN & FIELD STRATEGY
        ========================================================= */}
        {booth.masterplan && (
          <div className="modal-masterplan-box">
            {/* Masterplan Header with Bilingual Toggle & Category Badge */}
            <div className="masterplan-header">
              <div className="masterplan-title-wrap">
                <div className="masterplan-icon-badge">
                  <Target size={16} />
                </div>
                <div>
                  <h3 className="masterplan-title">
                    {mpLang === 'PA' ? '223 ਬੂਥ ਵਿਸਥਾਰਤ ਮਾਸਟਰ ਪਲਾਨ (Field Operations)' : '223-Booth Strategic Master Plan'}
                  </h3>
                  <p className="masterplan-sub">
                    {mpLang === 'PA' ? 'ਮੈਦਾਨੀ ਕਾਰਵਾਈਆਂ ਅਤੇ ਪਬਲਿਕ ਇਸ਼ੂ ਪਲਾਨ' : 'Field Ground Directive & 90-Day Action Roadmap'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="mp-lang-switch no-print" role="group" aria-label="Masterplan language">
                  <button
                    className={`mp-lang-btn ${mpLang === 'PA' ? 'active' : ''}`}
                    onClick={() => setMpLang('PA')}
                    type="button"
                  >
                    ਪੰਜਾਬੀ
                  </button>
                  <button
                    className={`mp-lang-btn ${mpLang === 'EN' ? 'active' : ''}`}
                    onClick={() => setMpLang('EN')}
                    type="button"
                  >
                    English
                  </button>
                </div>

                <span className={`masterplan-cat-badge ${
                  booth.masterplan.category_type && booth.masterplan.category_type.includes('AAP Retained') ? 'aap-won' :
                  booth.masterplan.category_type && booth.masterplan.category_type.includes('Gain') ? 'aap-gain' :
                  booth.masterplan.category_type && booth.masterplan.category_type.includes('Reversal') ? 'aap-lost' :
                  booth.masterplan.category_type && booth.masterplan.category_type.includes('INC') ? 'inc-won' : 'neutral'
                }`}>
                  {booth.masterplan.category_type || 'Field Operations'}
                </span>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="masterplan-metrics-strip">
              <div className="mp-metric-item">
                <span className="mp-metric-label">AAP Swing:</span>
                <strong className={`mp-metric-val ${booth.masterplan.aap_swing && booth.masterplan.aap_swing.startsWith('+') ? 'gain' : 'loss'}`}>
                  {booth.masterplan.aap_swing}
                </strong>
              </div>
              <div className="mp-metric-item">
                <span className="mp-metric-label">Turnout Movement:</span>
                <strong className="mp-metric-val">
                  {booth.masterplan.turnout_delta}
                </strong>
              </div>
              <div className="mp-metric-item">
                <span className="mp-metric-label">Cycle Directive:</span>
                <strong className="mp-metric-val">90-Day Field Ops</strong>
              </div>
            </div>

            {/* Field Status Diagnosis */}
            <div className="masterplan-status-card">
              <div className="mp-card-label">
                <span>{mpLang === 'PA' ? 'ਮੈਦਾਨੀ ਸਥਿਤੀ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ' : 'Field Diagnosis & Ground Reality'}</span>
              </div>
              <p className={`mp-status-text ${mpLang === 'PA' ? 'punjabi-font' : ''}`}>
                {mpLang === 'PA' && booth.masterplan.detailed_status_pa
                  ? booth.masterplan.detailed_status_pa
                  : booth.masterplan.detailed_status}
              </p>
            </div>

            {/* Action Roadmap */}
            <div className="masterplan-actions-card">
              <div className="mp-card-label">
                <span>{mpLang === 'PA' ? 'ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਮੈਦਾਨੀ ਕਾਰਵਾਈਆਂ (Field Operations)' : 'Recommended Step-by-Step Field Actions'}</span>
                <span className="mp-steps-count">
                  ({(mpLang === 'PA' && booth.masterplan.action_steps_pa ? booth.masterplan.action_steps_pa : booth.masterplan.action_steps || []).length} Steps)
                </span>
              </div>
              <div className="mp-steps-list">
                {(mpLang === 'PA' && booth.masterplan.action_steps_pa ? booth.masterplan.action_steps_pa : booth.masterplan.action_steps || []).map((step, idx) => {
                  const cleanStep = typeof step === 'string' ? step.replace(/^\d+[\)\.]\s*/, '') : step;
                  return (
                    <div key={idx} className="mp-step-item">
                      <span className="mp-step-num">{idx + 1}</span>
                      <span className={`mp-step-text ${mpLang === 'PA' ? 'punjabi-font' : ''}`}>{cleanStep}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Download Complete Master Plan Docx */}
            <div className="masterplan-download-row no-print">
              <a 
                href="./Qadian_223_Boothwise_Detailed_Field_Operations_Punjabi_Revised-final.docx" 
                download="Qadian_223_Boothwise_Detailed_Field_Operations_Punjabi_Revised-final.docx"
                className="btn-download-masterplan pa"
                title="Download 223-Booth Detailed Field Operations Plan in Punjabi (Word .docx)"
              >
                <Download size={14} />
                <span>223 ਬੂਥ ਮਾਸਟਰ ਪਲਾਨ (ਪੰਜਾਬੀ .docx)</span>
              </a>

              <a 
                href="./Qadian_Detailed_223_Boothwise_Masterplan.docx" 
                download="Qadian_Detailed_223_Boothwise_Masterplan.docx"
                className="btn-download-masterplan en"
                title="Download 223-Booth Master Plan Document in English (Word .docx)"
              >
                <Download size={14} />
                <span>Master Plan (English .docx)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
