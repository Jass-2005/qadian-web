import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AnalyticsView({ booths, summary }) {
  // Key calculations
  const topBjpBooths = [...booths]
    .sort((a, b) => b.data_2024.bjp - a.data_2024.bjp)
    .slice(0, 5);

  const topTurnoutDrops = [...booths]
    .sort((a, b) => a.comparison.turnout_diff - b.comparison.turnout_diff)
    .slice(0, 5);

  const closest2024Booths = [...booths]
    .filter(b => b.data_2024.total > 0)
    .sort((a, b) => a.data_2024.margin - b.data_2024.margin)
    .slice(0, 5);

  return (
    <div className="insights-grid">
      {/* Card 1: Party Vote Share Shift */}
      <div className="insight-card">
        <h3>1. Vote Share Dynamics (2022 vs 2024)</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Comparing the popular vote percentages in 18-Qadian:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* INC */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-inc)' }}>INC (Congress)</span>
              <span>36.61% (2022) → <strong>35.13% (2024)</strong></span>
            </div>
            <div className="vote-bar-track">
              <div className="vote-bar-fill" style={{ width: '35.13%', background: 'var(--color-inc)' }} />
            </div>
          </div>

          {/* AAP */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-aap)' }}>AAP (Aam Aadmi Party)</span>
              <span>31.30% (2022) → <strong>32.48% (2024)</strong></span>
            </div>
            <div className="vote-bar-track">
              <div className="vote-bar-fill" style={{ width: '32.48%', background: 'var(--color-aap)' }} />
            </div>
          </div>

          {/* SAD */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-sad)' }}>SAD (Shiromani Akali Dal)</span>
              <span>26.02% (2022) → <strong>13.08% (2024)</strong></span>
            </div>
            <div className="vote-bar-track">
              <div className="vote-bar-fill" style={{ width: '13.08%', background: 'var(--color-sad)' }} />
            </div>
          </div>

          {/* BJP */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-bjp)' }}>BJP (Bharatiya Janata Party)</span>
              <span>0% (2022) → <strong>10.89% (2024)</strong></span>
            </div>
            <div className="vote-bar-track">
              <div className="vote-bar-fill" style={{ width: '10.89%', background: 'var(--color-bjp)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: The BJP Urban Phenomenon */}
      <div className="insight-card">
        <h3>2. BJP Emergence: 25 Booth Wins</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          BJP won 25 booths in 2024 (up from 0 in 2022), primarily in Dhariwal town and Qadian municipal wards:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topBjpBooths.map((b) => (
            <div 
              key={b.booth_no} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}
            >
              <div>
                <strong>#{b.booth_no}</strong> {b.village_english}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--color-bjp)' }}>
                {b.data_2024.bjp} votes ({b.data_2024.bjp_pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Razor-Thin 2024 Contests */}
      <div className="insight-card">
        <h3>3. Closest 2024 Booth Contests</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Booths decided by fewer than 5 votes:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {closest2024Booths.map((b) => (
            <div 
              key={b.booth_no} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}
            >
              <div>
                <strong>#{b.booth_no}</strong> {b.village_english}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`badge-winner ${b.data_2024.winner_party}`}>
                  {b.data_2024.winner_party}
                </span>
                <span style={{ fontWeight: 700 }}>+{b.data_2024.margin} vote</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4: Turnout Contraction */}
      <div className="insight-card">
        <h3>4. Sharpest Turnout Drops</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Total votes counted dropped by 12,427 (-9.46%) between 2022 and 2024. Booths with maximum contraction:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topTurnoutDrops.map((b) => (
            <div 
              key={b.booth_no} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}
            >
              <div>
                <strong>#{b.booth_no}</strong> {b.village_english}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--color-loss)' }}>
                {b.comparison.turnout_diff} votes ({b.comparison.turnout_pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
