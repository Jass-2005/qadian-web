import React from 'react';
import { 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  Award, 
  Filter,
  UserCheck,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function PartyHub({ 
  selectedParty, 
  setSelectedParty, 
  partyFilter, 
  setPartyFilter,
  partyStats,
  summary
}) {
  const currentStats = partyStats[selectedParty] || partyStats.AAP;

  return (
    <div className="registry-sub-controls" aria-label="Party Analytics and Filters">
      {/* 1. Main Segment Switcher Tabs */}
      <div className="party-pills-row">
        <div className="party-pill-tabs">
          {/* Complete List Button */}
          <button
            className={`party-tab-pill ${selectedParty === 'ALL' ? 'active all' : ''}`}
            onClick={() => { setSelectedParty('ALL'); setPartyFilter('ALL'); }}
            title="View complete constituency list of all 223 booths"
          >
            <Layers size={14} />
            <span className="party-tab-text">All Booths</span>
            <span className="tab-pill-count">223</span>
          </button>

          {/* AAP Analytics Button */}
          <button
            className={`party-tab-pill ${selectedParty === 'AAP' ? 'active aap' : ''}`}
            onClick={() => { setSelectedParty('AAP'); setPartyFilter('ALL'); }}
            title="Aam Aadmi Party: Sekhwan ('22) -> Shery Kalsi ('24)"
          >
            <span className="party-color-indicator aap-indicator"></span>
            <span className="party-tab-text">AAP Analytics</span>
            <span className="tab-pill-count aap-badge">81 Wins</span>
          </button>

          {/* INC Analytics Button */}
          <button
            className={`party-tab-pill ${selectedParty === 'INC' ? 'active inc' : ''}`}
            onClick={() => { setSelectedParty('INC'); setPartyFilter('ALL'); }}
            title="Congress (INC): Partap Singh Bajwa ('22) -> Sukhjinder Randhawa ('24)"
          >
            <span className="party-color-indicator inc-indicator"></span>
            <span className="party-tab-text">INC Analytics</span>
            <span className="tab-pill-count inc-badge">111 Wins</span>
          </button>

          {/* BJP Analytics Button */}
          <button
            className={`party-tab-pill ${selectedParty === 'BJP' ? 'active bjp' : ''}`}
            onClick={() => { setSelectedParty('BJP'); setPartyFilter('ALL'); }}
            title="Bharatiya Janata Party: Dinesh Singh Babbu ('24 Urban Inroads)"
          >
            <span className="party-color-indicator bjp-indicator"></span>
            <span className="party-tab-text">BJP Analytics</span>
            <span className="tab-pill-count bjp-badge">25 Wins</span>
          </button>

          {/* SAD Analytics Button */}
          <button
            className={`party-tab-pill ${selectedParty === 'SAD' ? 'active sad' : ''}`}
            onClick={() => { setSelectedParty('SAD'); setPartyFilter('ALL'); }}
            title="Shiromani Akali Dal: Guriqbal Singh Mahal ('22) -> Dr. Daljit Cheema ('24)"
          >
            <span className="party-color-indicator sad-indicator"></span>
            <span className="party-tab-text">SAD Analytics</span>
            <span className="tab-pill-count sad-badge">5 Wins</span>
          </button>
        </div>

        {/* Compact Vitals Badge Strip */}
        <div className="compact-vitals-line" title="Aggregated Constituency & Party Vitals">
          {selectedParty === 'ALL' ? (
            <>
              <div className="vital-item">
                <span className="vital-lbl">Turnout</span>
                <span className="vital-val">{summary.total_votes_2024.toLocaleString()}</span>
                <span className="vital-sub">72.1% (-9.5%)</span>
              </div>
              <span className="vital-divider" aria-hidden="true" />
              <div className="vital-item lead-inc">
                <span className="vital-lbl">INC Lead</span>
                <span className="vital-val">+3,152</span>
                <span className="vital-sub">over AAP</span>
              </div>
              <span className="vital-divider hide-mobile" aria-hidden="true" />
              <div className="vital-item hide-mobile">
                <span className="vital-lbl">Seats '24</span>
                <span className="vital-val">INC: 111 · AAP: 81 · BJP: 25 · SAD: 5</span>
              </div>
            </>
          ) : (
            <>
              <div className="vital-item">
                <span className="vital-lbl">’22 Votes</span>
                <span className="vital-val">{currentStats.votes_2022.toLocaleString()}</span>
                <span className="vital-sub">({currentStats.share_2022}%)</span>
              </div>
              <span className="vital-divider" aria-hidden="true" />
              <div className="vital-item">
                <span className="vital-lbl">’24 Votes</span>
                <span className="vital-val">{currentStats.votes_2024.toLocaleString()}</span>
                <span className="vital-sub">({currentStats.share_2024}%)</span>
              </div>
              <span className="vital-divider" aria-hidden="true" />
              <div className="vital-item">
                <span className="vital-lbl">Swing</span>
                <span className={`vital-val ${currentStats.swing >= 0 ? 'shift-gain' : 'shift-loss'}`}>
                  {currentStats.swing >= 0 ? `+${currentStats.swing}%` : `${currentStats.swing}%`}
                </span>
                <span className="vital-sub">
                  ({currentStats.vote_diff >= 0 ? `+${currentStats.vote_diff.toLocaleString()}` : currentStats.vote_diff.toLocaleString()}v)
                </span>
              </div>
              <span className="vital-divider hide-mobile" aria-hidden="true" />
              <div className="vital-item hide-mobile">
                <span className="vital-lbl">Booths</span>
                <span className="vital-val">{currentStats.booths_won_2022} → {currentStats.booths_won_2024}</span>
                <span className="vital-sub">
                  ({currentStats.booths_won_2024 - currentStats.booths_won_2022 >= 0 ? `+${currentStats.booths_won_2024 - currentStats.booths_won_2022}` : currentStats.booths_won_2024 - currentStats.booths_won_2022})
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Candidate Attribution Strip when a Party is Selected */}
      {selectedParty !== 'ALL' && (
        <div className="party-candidate-bar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--bg-surface-elevated, #f8fafc)',
          borderRadius: '8px',
          margin: '8px 0',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          fontSize: '0.8125rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedParty} Leadership:
            </span>
            <span>
              <strong>2022 Candidate:</strong> {currentStats.candidate_2022} ({currentStats.votes_2022.toLocaleString()} votes)
            </span>
            <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
            <span>
              <strong>2024 Candidate:</strong> {currentStats.candidate_2024} ({currentStats.votes_2024.toLocaleString()} votes)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-highlight" style={{
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              background: currentStats.swing >= 0 ? '#dcfce7' : '#fee2e2',
              color: currentStats.swing >= 0 ? '#166534' : '#991b1b'
            }}>
              {currentStats.swing >= 0 ? `+${currentStats.swing}% Vote Share Gain` : `${currentStats.swing}% Vote Share Drop`}
            </span>
          </div>
        </div>
      )}

      {/* 2. Category Filter Pills */}
      <div className={`category-filter-pills ${selectedParty.toLowerCase()}-mode`}>
        <div className="filter-pill-header">
          <Filter size={12} className="filter-header-icon" />
          <span className="filter-group-label">FILTER:</span>
        </div>

        {selectedParty === 'ALL' ? (
          <div className="cat-pill-group">
            <button
              className={`cat-pill-btn ${partyFilter === 'ALL' ? 'active default-active' : ''}`}
              onClick={() => setPartyFilter('ALL')}
            >
              <span>All Booths</span>
              <span className="cat-pill-num">223</span>
            </button>
            <button
              className={`cat-pill-btn inc-filter ${partyFilter === 'INC_WINS' ? 'active inc-active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'INC_WINS' ? 'ALL' : 'INC_WINS')}
            >
              <Award size={13} className="pill-icon inc-text" />
              <span>INC Won</span>
              <span className="cat-pill-num">111</span>
            </button>
            <button
              className={`cat-pill-btn aap-filter ${partyFilter === 'AAP_WINS' ? 'active aap-active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'AAP_WINS' ? 'ALL' : 'AAP_WINS')}
            >
              <Award size={13} className="pill-icon aap-text" />
              <span>AAP Won</span>
              <span className="cat-pill-num">81</span>
            </button>
            <button
              className={`cat-pill-btn bjp-filter ${partyFilter === 'BJP_WINS' ? 'active bjp-active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'BJP_WINS' ? 'ALL' : 'BJP_WINS')}
            >
              <Award size={13} className="pill-icon bjp-text" />
              <span>BJP Won</span>
              <span className="cat-pill-num">25</span>
            </button>
            <button
              className={`cat-pill-btn sad-filter ${partyFilter === 'SAD_WINS' ? 'active sad-active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'SAD_WINS' ? 'ALL' : 'SAD_WINS')}
            >
              <Award size={13} className="pill-icon sad-text" />
              <span>SAD Won</span>
              <span className="cat-pill-num">5</span>
            </button>
            <button
              className={`cat-pill-btn ${partyFilter === 'FLIPPED_ONLY' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'FLIPPED_ONLY' ? 'ALL' : 'FLIPPED_ONLY')}
              title="Only show booths that changed party between 2022 and 2024"
            >
              <Flame size={13} />
              <span>Flipped Booths</span>
              <span className="cat-pill-num">128</span>
            </button>
            <button
              className={`cat-pill-btn ${partyFilter === 'RETAINED_ONLY' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'RETAINED_ONLY' ? 'ALL' : 'RETAINED_ONLY')}
              title="Only show booths retained by the same party"
            >
              <ShieldCheck size={13} />
              <span>Retained</span>
              <span className="cat-pill-num">94</span>
            </button>
          </div>
        ) : (
          <div className="cat-pill-group">
            <button
              className={`cat-pill-btn ${partyFilter === 'ALL' ? `active ${selectedParty.toLowerCase()}-active` : ''}`}
              onClick={() => setPartyFilter('ALL')}
            >
              <span>All Booths</span>
              <span className="cat-pill-num">223</span>
            </button>
            <button
              className={`cat-pill-btn won ${partyFilter === 'WON_BOTH' ? `active ${selectedParty.toLowerCase()}-active` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'WON_BOTH' ? 'ALL' : 'WON_BOTH')}
              title={`Won in both 2022 & 2024 by ${selectedParty}`}
            >
              <ShieldCheck size={13} />
              <span>Won Both</span>
              <span className="cat-pill-num">{currentStats.won_both_count}</span>
            </button>
            <button
              className={`cat-pill-btn gained ${partyFilter === 'GAINED' ? `active ${selectedParty.toLowerCase()}-active` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'GAINED' ? 'ALL' : 'GAINED')}
              title={`Gained by ${selectedParty} in 2024 (Flip In)`}
            >
              <TrendingUp size={13} />
              <span>Gained in ’24</span>
              <span className="cat-pill-num">{currentStats.gained_count}</span>
            </button>
            <button
              className={`cat-pill-btn lost ${partyFilter === 'LOST_24' ? `active ${selectedParty.toLowerCase()}-active` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'LOST_24' ? 'ALL' : 'LOST_24')}
              title={`Won in 2022, lost in 2024 by ${selectedParty} (Flip Out)`}
            >
              <TrendingDown size={13} />
              <span>Lost in ’24</span>
              <span className="cat-pill-num">{currentStats.lost_24_count}</span>
            </button>
            <button
              className={`cat-pill-btn weak ${partyFilter === 'WEAK' ? `active ${selectedParty.toLowerCase()}-active` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'WEAK' ? 'ALL' : 'WEAK')}
              title={`Weak booth: less than 20% vote share for ${selectedParty}`}
            >
              <AlertTriangle size={13} />
              <span>Weak (&lt;20%)</span>
              <span className="cat-pill-num">{currentStats.weak_count}</span>
            </button>
            <button
              className={`cat-pill-btn deficit ${partyFilter === 'LOST_BOTH' ? `active ${selectedParty.toLowerCase()}-active` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'LOST_BOTH' ? 'ALL' : 'LOST_BOTH')}
              title={`Opponent bastions in both 2022 & 2024`}
            >
              <ShieldAlert size={13} />
              <span>Lost Both</span>
              <span className="cat-pill-num">{currentStats.lost_both_count}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
