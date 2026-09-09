import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, ChevronRight } from 'lucide-react';

export default function BoothTable({ booths, onSelectBooth }) {
  if (booths.length === 0) {
    return (
      <div className="table-wrap" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No booths found matching your filters.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Try adjusting your search terms or filter selections.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="booth-table">
        <thead>
          <tr>
            <th style={{ width: '70px', textAlign: 'center' }}>Booth</th>
            <th>Village / Polling Station</th>
            <th>2022 Assembly Result</th>
            <th>2024 Lok Sabha Result</th>
            <th>Shift / Status</th>
            <th style={{ textAlign: 'right' }}>Turnout Trend</th>
            <th style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {booths.map((b) => {
            const w22 = b.data_2022.winner_party;
            const w24 = b.data_2024.winner_party;
            const diff = b.comparison.turnout_diff;
            const pct = b.comparison.turnout_pct;
            const isFlipped = b.comparison.is_flip;

            return (
              <tr 
                key={b.booth_no} 
                onClick={() => onSelectBooth(b)} 
                title={`Click to inspect detailed breakdown for Booth #${b.booth_no}`}
              >
                {/* Booth No */}
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  #{b.booth_no}
                </td>

                {/* Village / Polling Station */}
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {b.village_english}
                  </div>
                  <div className="punjabi-text" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {b.village_punjabi}
                  </div>
                </td>

                {/* 2022 Result */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span className={`badge-winner ${w22}`}>
                      {w22}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      +{b.data_2022.margin} lead
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    INC {b.data_2022.inc} | AAP {b.data_2022.aap} | SAD {b.data_2022.sad}
                  </div>
                </td>

                {/* 2024 Result */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span className={`badge-winner ${w24}`}>
                      {w24}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      +{b.data_2024.margin} lead
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    INC {b.data_2024.inc} | AAP {b.data_2024.aap} | BJP {b.data_2024.bjp} | SAD {b.data_2024.sad}
                  </div>
                </td>

                {/* Status Badge */}
                <td>
                  <span className={`status-badge ${isFlipped ? 'flipped' : 'retained'}`}>
                    {b.comparison.status_label}
                  </span>
                </td>

                {/* Turnout Trend */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>
                    {b.data_2024.total.toLocaleString()}
                  </div>
                  <div 
                    className={`turnout-indicator ${diff > 0 ? 'gain' : (diff < 0 ? 'drop' : '')}`}
                    style={{ justifyContent: 'flex-end' }}
                  >
                    {diff > 0 ? <ArrowUpRight size={14} /> : (diff < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />)}
                    <span>{diff > 0 ? `+${diff}` : diff} ({pct}%)</span>
                  </div>
                </td>

                {/* Arrow */}
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ChevronRight size={16} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
