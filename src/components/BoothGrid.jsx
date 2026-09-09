import React, { useState } from 'react';
import { LayoutGrid, List, ArrowUpRight, ArrowDownRight, Minus, ChevronRight, Printer } from 'lucide-react';

export default function BoothGrid({ 
  booths, 
  selectedParty, 
  onSelectBooth,
  onExportBoothPdf,
  partyFilter 
}) {
  const [viewMode, setViewMode] = useState('LIST'); // 'LIST' or 'GRID'

  const isAllMode = selectedParty === 'ALL';
  const pKey = selectedParty.toLowerCase(); // 'aap' or 'inc' if not 'ALL'

  if (booths.length === 0) {
    return (
      <div className="empty-state">
        <p style={{ fontSize: '1rem', fontWeight: 600 }}>No booths match the selected criteria.</p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Try clearing the search query or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="booth-container">
      {/* List Header Bar */}
      <div className="booth-list-header">
        <div className="list-title-wrap">
          <span className="list-count-badge">{booths.length} Booths</span>
          <span className="list-filter-label">
            {isAllMode && (
              partyFilter === 'ALL' ? 'Complete Master List (All 223 Booths)' :
              partyFilter === 'INC_WINS' ? 'Booths Won by INC in 2024' :
              partyFilter === 'AAP_WINS' ? 'Booths Won by AAP in 2024' :
              partyFilter === 'BJP_WINS' ? 'Booths Won by BJP in 2024' :
              partyFilter === 'SAD_WINS' ? 'Booths Won by SAD in 2024' : 'Booths'
            )}
            {!isAllMode && (
              partyFilter === 'ALL' ? `All Booths for ${selectedParty}` :
              partyFilter === 'WON_BOTH' ? `${selectedParty} Strongholds (Won Both 2022 & 2024)` :
              partyFilter === 'GAINED' ? `${selectedParty} Gains (Won in 2024, Lost in 2022)` :
              partyFilter === 'LOST_24' ? `${selectedParty} Losses (Won in 2022, Lost in 2024)` :
              partyFilter === 'WEAK' ? `Weak Booths for ${selectedParty} (< 20% Vote Share)` :
              partyFilter === 'LOST_BOTH' ? `Booths Lost Both Times by ${selectedParty}` : 'Booths'
            )}
          </span>
        </div>

        <div className="view-toggle-btns">
          <button 
            className={`toggle-btn ${viewMode === 'LIST' ? 'active' : ''}`}
            onClick={() => setViewMode('LIST')}
            title="List View"
            aria-label="List View"
          >
            <List size={16} />
            <span>List</span>
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'GRID' ? 'active' : ''}`}
            onClick={() => setViewMode('GRID')}
            title="Grid Cards View"
            aria-label="Grid Cards View"
          >
            <LayoutGrid size={16} />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          VIEW MODE 1: CLEAN LIST TABLE
      ========================================================= */}
      {viewMode === 'LIST' && (
        <div className="clean-table-wrap">
          <table className="clean-table">
            <thead>
              {isAllMode ? (
                /* Complete List Headers */
                <tr>
                  <th style={{ width: '65px', textAlign: 'center' }}>No.</th>
                  <th>Village / Polling Station</th>
                  <th>2022 Winner</th>
                  <th>2024 Winner</th>
                  <th>Shift / Status</th>
                  <th style={{ textAlign: 'right' }}>2024 Turnout</th>
                  <th style={{ textAlign: 'right' }}>Turnout Shift</th>
                  <th style={{ width: '84px', textAlign: 'center' }}>Action</th>
                </tr>
              ) : (
                /* Party-Specific Headers */
                <tr>
                  <th style={{ width: '65px', textAlign: 'center' }}>No.</th>
                  <th>Village / Polling Station</th>
                  <th style={{ textAlign: 'right' }}>2022 ({selectedParty})</th>
                  <th style={{ textAlign: 'right' }}>2024 ({selectedParty})</th>
                  <th style={{ textAlign: 'right' }}>Shift</th>
                  <th>2022 Winner</th>
                  <th>2024 Winner</th>
                  <th>Category</th>
                  <th style={{ width: '84px', textAlign: 'center' }}>Action</th>
                </tr>
              )}
            </thead>
            <tbody>
              {booths.map((b) => {
                const w22 = b.data_2022.winner_party;
                const w24 = b.data_2024.winner_party;
                const diff = b.comparison.turnout_diff;
                const pct = b.comparison.turnout_pct;

                if (isAllMode) {
                  return (
                    <tr 
                      key={b.booth_no}
                      onClick={() => onSelectBooth(b)}
                      title={`Click to inspect Booth #${b.booth_no}`}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <span className="booth-avatar-badge">{b.booth_no}</span>
                      </td>

                      <td>
                        <div className="village-en">{b.village_english}</div>
                        <div className="village-pa punjabi-font">{b.village_punjabi}</div>
                      </td>

                      <td>
                        <span className={`mini-winner ${w22}`}>{w22}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                          +{b.data_2022.margin}
                        </span>
                      </td>

                      <td>
                        <span className={`mini-winner ${w24}`}>{w24}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                          +{b.data_2024.margin}
                        </span>
                      </td>

                      <td>
                        <span className={`cat-pill ${b.comparison.is_flip ? 'lost' : 'won'}`}>
                          {b.comparison.status_label}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {b.data_2024.total.toLocaleString()}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <span className={`diff-pill ${diff >= 0 ? 'gain' : 'loss'}`}>
                          {diff >= 0 ? `+${diff}` : diff} ({pct}%)
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            className="btn-table-pdf"
                            title={`Export Booth #${b.booth_no} as PDF with Dsidein Watermark`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onExportBoothPdf(b);
                            }}
                          >
                            <Printer size={12} />
                            <span>PDF</span>
                          </button>
                          <button
                            className="btn-table-view"
                            title={`Inspect Booth #${b.booth_no}`}
                            onClick={() => onSelectBooth(b)}
                          >
                            <span>View</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // Party-Specific Row
                const v22 = b.data_2022[pKey];
                const pct22 = b.data_2022[`${pKey}_pct`];
                const v24 = b.data_2024[pKey];
                const pct24 = b.data_2024[`${pKey}_pct`];
                const partyDiff = v24 - v22;
                const swing = (pct24 - pct22).toFixed(1);

                let catLabel = 'Lost Both';
                let catClass = 'neutral';
                if (w22 === selectedParty && w24 === selectedParty) {
                  catLabel = 'Won Both';
                  catClass = 'won';
                } else if (w22 !== selectedParty && w24 === selectedParty) {
                  catLabel = 'Gained in ’24';
                  catClass = 'gained';
                } else if (w22 === selectedParty && w24 !== selectedParty) {
                  catLabel = `Lost to ${w24}`;
                  catClass = 'lost';
                }

                if (pct24 < 20.0 && b.data_2024.total > 0) {
                  catLabel = 'Weak (<20%)';
                  catClass = 'weak';
                }

                return (
                  <tr 
                    key={b.booth_no}
                    onClick={() => onSelectBooth(b)}
                    title={`Click to inspect Booth #${b.booth_no}`}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <span className="booth-avatar-badge">{b.booth_no}</span>
                    </td>

                    <td>
                      <div className="village-en">{b.village_english}</div>
                      <div className="village-pa punjabi-font">{b.village_punjabi}</div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <strong>{v22}</strong>
                      <span className="pct-sub">({pct22}%)</span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <strong>{v24}</strong>
                      <span className="pct-sub">({pct24}%)</span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <span className={`diff-pill ${partyDiff >= 0 ? 'gain' : 'loss'}`}>
                        {partyDiff >= 0 ? `+${partyDiff}` : partyDiff} ({swing > 0 ? `+${swing}%` : `${swing}%`})
                      </span>
                    </td>

                    <td>
                      <span className={`mini-winner ${w22}`}>{w22}</span>
                    </td>

                    <td>
                      <span className={`mini-winner ${w24}`}>{w24}</span>
                    </td>

                    <td>
                      <span className={`cat-pill ${catClass}`}>{catLabel}</span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          className="btn-table-pdf"
                          title={`Export Booth #${b.booth_no} as PDF with Dsidein Watermark`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportBoothPdf(b);
                          }}
                        >
                          <Printer size={12} />
                          <span>PDF</span>
                        </button>
                        <button
                          className="btn-table-view"
                          title={`Inspect Booth #${b.booth_no}`}
                          onClick={() => onSelectBooth(b)}
                        >
                          <span>View</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 2: MINIMAL GRID CARDS
      ========================================================= */}
      {viewMode === 'GRID' && (
        <div className="grid-cards-layout">
          {booths.map((b) => {
            const w22 = b.data_2022.winner_party;
            const w24 = b.data_2024.winner_party;
            const diff = b.comparison.turnout_diff;

            if (isAllMode) {
              return (
                <div 
                  key={b.booth_no} 
                  className="booth-card"
                  onClick={() => onSelectBooth(b)}
                >
                  <div className="card-top-row">
                    <span className="card-booth-badge">#{b.booth_no}</span>
                    <span className={`cat-pill ${b.comparison.is_flip ? 'lost' : 'won'}`}>
                      {b.comparison.status_label}
                    </span>
                  </div>

                  <div className="card-village-name">{b.village_english}</div>
                  <div className="card-village-punjabi punjabi-font">{b.village_punjabi}</div>

                  <div className="card-stats-box">
                    <div className="card-stat-col">
                      <span className="card-stat-label">2022 Winner</span>
                      <span className={`mini-winner ${w22}`} style={{ marginTop: '3px' }}>
                        {w22} (+{b.data_2022.margin})
                      </span>
                      <span className="pct-sub" style={{ margin: '4px 0 0 0' }}>{b.data_2022.total} polled</span>
                    </div>

                    <div className="card-stat-col">
                      <span className="card-stat-label">2024 Winner</span>
                      <span className={`mini-winner ${w24}`} style={{ marginTop: '3px' }}>
                        {w24} (+{b.data_2024.margin})
                      </span>
                      <span className="pct-sub" style={{ margin: '4px 0 0 0' }}>{b.data_2024.total} polled</span>
                    </div>
                  </div>

                  <div className="card-footer-row">
                    <div>
                      <span className="footer-label">Turnout: </span>
                      <span className={`diff-pill ${diff >= 0 ? 'gain' : 'loss'}`}>
                        {diff >= 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                    <button
                      className="btn-card-pdf"
                      title={`Export Booth #${b.booth_no} as PDF`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportBoothPdf(b);
                      }}
                    >
                      <Printer size={12} />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              );
            }

            // Party-Specific Card
            const v22 = b.data_2022[pKey];
            const pct22 = b.data_2022[`${pKey}_pct`];
            const v24 = b.data_2024[pKey];
            const pct24 = b.data_2024[`${pKey}_pct`];
            const partyDiff = v24 - v22;

            let catLabel = 'Lost Both';
            let catClass = 'neutral';
            if (w22 === selectedParty && w24 === selectedParty) {
              catLabel = 'Won Both';
              catClass = 'won';
            } else if (w22 !== selectedParty && w24 === selectedParty) {
              catLabel = 'Gained in ’24';
              catClass = 'gained';
            } else if (w22 === selectedParty && w24 !== selectedParty) {
              catLabel = `Lost to ${w24}`;
              catClass = 'lost';
            }

            if (pct24 < 20.0 && b.data_2024.total > 0) {
              catLabel = 'Weak (<20%)';
              catClass = 'weak';
            }

            return (
              <div 
                key={b.booth_no} 
                className="booth-card"
                onClick={() => onSelectBooth(b)}
              >
                <div className="card-top-row">
                  <span className="card-booth-badge">#{b.booth_no}</span>
                  <span className={`cat-pill ${catClass}`}>{catLabel}</span>
                </div>

                <div className="card-village-name">{b.village_english}</div>
                <div className="card-village-punjabi punjabi-font">{b.village_punjabi}</div>

                <div className="card-stats-box">
                  <div className="card-stat-col">
                    <span className="card-stat-label">2022 Votes</span>
                    <strong>{v22}</strong> <span className="pct-sub">({pct22}%)</span>
                    <span className={`mini-winner ${w22}`} style={{ marginTop: '4px' }}>{w22} Won</span>
                  </div>

                  <div className="card-stat-col">
                    <span className="card-stat-label">2024 Votes</span>
                    <strong>{v24}</strong> <span className="pct-sub">({pct24}%)</span>
                    <span className={`mini-winner ${w24}`} style={{ marginTop: '4px' }}>{w24} Won</span>
                  </div>
                </div>

                <div className="card-footer-row">
                  <div>
                    <span className="footer-label">Shift: </span>
                    <span className={`diff-pill ${partyDiff >= 0 ? 'gain' : 'loss'}`}>
                      {partyDiff >= 0 ? `+${partyDiff}` : partyDiff}
                    </span>
                  </div>
                  <button
                    className="btn-card-pdf"
                    title={`Export Booth #${b.booth_no} as PDF`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onExportBoothPdf(b);
                    }}
                  >
                    <Printer size={12} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
