import React from 'react';
import { Award, Users, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function KPIBanner({ summary }) {
  const diffVotes = summary.turnout_diff.toLocaleString();
  const diffPct = summary.turnout_pct;

  return (
    <section className="kpi-grid" aria-label="Election Highlights and Summary Metrics">
      {/* Total Turnout Shift */}
      <article className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-label">Voter Turnout Shift</span>
          <Users size={16} className="text-secondary" />
        </div>
        <div className="kpi-value">{summary.total_votes_2024.toLocaleString()}</div>
        <div className="kpi-sub">
          <span style={{ color: 'var(--color-loss)', fontWeight: 700 }}>
            {diffVotes} ({diffPct}%)
          </span>
          <span>vs 2022 ({summary.total_votes_2022.toLocaleString()})</span>
        </div>
      </article>

      {/* 2022 Result */}
      <article className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-label">2022 Assembly Winner</span>
          <Award size={16} style={{ color: 'var(--color-inc)' }} />
        </div>
        <div className="kpi-value" style={{ color: 'var(--color-inc)' }}>INC (Bajwa)</div>
        <div className="kpi-sub">
          <span>Won by +6,991 lead over AAP</span>
        </div>
        <div className="seats-pill-box">
          <span className="seat-tag seat-inc">INC: {summary.booths_won_2022.INC}</span>
          <span className="seat-tag seat-aap">AAP: {summary.booths_won_2022.AAP}</span>
          <span className="seat-tag seat-sad">SAD: {summary.booths_won_2022.SAD}</span>
        </div>
      </article>

      {/* 2024 Result */}
      <article className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-label">2024 Lok Sabha Lead</span>
          <Award size={16} style={{ color: 'var(--color-inc)' }} />
        </div>
        <div className="kpi-value" style={{ color: 'var(--color-inc)' }}>INC (Randhawa)</div>
        <div className="kpi-sub">
          <span>Won by +3,152 lead over AAP</span>
        </div>
        <div className="seats-pill-box">
          <span className="seat-tag seat-inc">INC: {summary.booths_won_2024.INC}</span>
          <span className="seat-tag seat-aap">AAP: {summary.booths_won_2024.AAP}</span>
          <span className="seat-tag seat-bjp">BJP: {summary.booths_won_2024.BJP}</span>
          <span className="seat-tag seat-sad">SAD: {summary.booths_won_2024.SAD}</span>
        </div>
      </article>

      {/* Key Shift Dynamic */}
      <article className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-label">Booth Dynamics</span>
          <CheckCircle2 size={16} className="text-secondary" />
        </div>
        <div className="kpi-value">
          <span style={{ color: 'var(--color-bjp)' }}>+25</span> BJP Gains
        </div>
        <div className="kpi-sub">
          <span>Retained: INC (69), AAP (18)</span>
        </div>
        <div className="seats-pill-box">
          <span className="seat-tag" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            SAD: -36 Booths
          </span>
          <span className="seat-tag seat-aap">
            AAP: +24 Booths
          </span>
        </div>
      </article>
    </section>
  );
}
