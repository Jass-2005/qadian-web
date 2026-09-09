import React from 'react';
import { Layers, ShieldCheck, TrendingUp, TrendingDown, AlertTriangle, ShieldAlert } from 'lucide-react';

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
      {/* 1. Party Selector Pills & Quick Vitals */}
      <div className="party-pills-row">
        <div className="party-pill-tabs">
          <button
            className={`party-tab-pill ${selectedParty === 'ALL' ? 'active all' : ''}`}
            onClick={() => { setSelectedParty('ALL'); setPartyFilter('ALL'); }}
            title="View complete list of all 223 booths"
          >
            <Layers size={14} />
            <span>Complete List</span>
            <span className="tab-pill-count">223</span>
          </button>

          <button
            className={`party-tab-pill ${selectedParty === 'AAP' ? 'active aap' : ''}`}
            onClick={() => { setSelectedParty('AAP'); setPartyFilter('ALL'); }}
            title="Switch to AAP Booth Analytics (81 Wins in 2024)"
          >
            <span className="dot dot-aap"></span>
            <span>AAP Analytics</span>
            <span className="tab-pill-count">81 Wins</span>
          </button>

          <button
            className={`party-tab-pill ${selectedParty === 'INC' ? 'active inc' : ''}`}
            onClick={() => { setSelectedParty('INC'); setPartyFilter('ALL'); }}
            title="Switch to INC Booth Analytics (111 Wins in 2024)"
          >
            <span className="dot dot-inc"></span>
            <span>INC Analytics</span>
            <span className="tab-pill-count">111 Wins</span>
          </button>
        </div>

        {/* Compact Vitals Badge Line */}
        <div className="compact-vitals-line">
          {selectedParty === 'ALL' ? (
            <>
              <span className="vital-chip">
                Turnout: <strong>{summary.total_votes_2024.toLocaleString()}</strong> <small>(72.1%)</small>
              </span>
              <span className="vital-chip lead-inc">
                INC Lead: <strong>+3,152</strong>
              </span>
              <span className="vital-chip seats hide-mobile">
                INC: 111 | AAP: 81 | BJP: 25 | SAD: 5
              </span>
            </>
          ) : (
            <>
              <span className="vital-chip">
                ’22: <strong>{currentStats.votes_2022.toLocaleString()}</strong> ({currentStats.share_2022}%)
              </span>
              <span className="vital-chip">
                ’24: <strong>{currentStats.votes_2024.toLocaleString()}</strong> ({currentStats.share_2024}%)
              </span>
              <span className={`vital-chip ${currentStats.vote_diff >= 0 ? 'gain' : 'loss'}`}>
                Shift: <strong>{currentStats.vote_diff >= 0 ? `+${currentStats.vote_diff.toLocaleString()}` : currentStats.vote_diff.toLocaleString()}</strong>
              </span>
              <span className="vital-chip hide-mobile">
                Top: <strong>#{currentStats.top_booth.no}</strong> ({currentStats.top_booth.votes}v)
              </span>
            </>
          )}
        </div>
      </div>

      {/* 2. Minimal Category Filter Pills */}
      <div className="category-filter-pills">
        <span className="filter-group-label">FILTER:</span>
        {selectedParty === 'ALL' ? (
          <div className="cat-pill-group">
            <button
              className={`cat-pill-btn ${partyFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setPartyFilter('ALL')}
            >
              All Booths <span className="cat-pill-num">223</span>
            </button>
            <button
              className={`cat-pill-btn inc ${partyFilter === 'INC_WINS' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'INC_WINS' ? 'ALL' : 'INC_WINS')}
            >
              INC Won <span className="cat-pill-num">111</span>
            </button>
            <button
              className={`cat-pill-btn aap ${partyFilter === 'AAP_WINS' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'AAP_WINS' ? 'ALL' : 'AAP_WINS')}
            >
              AAP Won <span className="cat-pill-num">81</span>
            </button>
            <button
              className={`cat-pill-btn bjp ${partyFilter === 'BJP_WINS' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'BJP_WINS' ? 'ALL' : 'BJP_WINS')}
            >
              BJP Won <span className="cat-pill-num">25</span>
            </button>
            <button
              className={`cat-pill-btn sad ${partyFilter === 'SAD_WINS' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'SAD_WINS' ? 'ALL' : 'SAD_WINS')}
            >
              SAD Won <span className="cat-pill-num">5</span>
            </button>
          </div>
        ) : (
          <div className="cat-pill-group">
            <button
              className={`cat-pill-btn ${partyFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setPartyFilter('ALL')}
            >
              All Booths <span className="cat-pill-num">223</span>
            </button>
            <button
              className={`cat-pill-btn won ${partyFilter === 'WON_BOTH' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'WON_BOTH' ? 'ALL' : 'WON_BOTH')}
              title={`Won in both 2022 & 2024 by ${selectedParty}`}
            >
              <ShieldCheck size={13} />
              Won Both <span className="cat-pill-num">{currentStats.won_both_count}</span>
            </button>
            <button
              className={`cat-pill-btn gained ${partyFilter === 'GAINED' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'GAINED' ? 'ALL' : 'GAINED')}
              title={`Gained by ${selectedParty} in 2024`}
            >
              <TrendingUp size={13} />
              Gained in ’24 <span className="cat-pill-num">{currentStats.gained_count}</span>
            </button>
            <button
              className={`cat-pill-btn lost ${partyFilter === 'LOST_24' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'LOST_24' ? 'ALL' : 'LOST_24')}
              title={`Won in 2022, lost in 2024 by ${selectedParty}`}
            >
              <TrendingDown size={13} />
              Lost in ’24 <span className="cat-pill-num">{currentStats.lost_24_count}</span>
            </button>
            <button
              className={`cat-pill-btn weak ${partyFilter === 'WEAK' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'WEAK' ? 'ALL' : 'WEAK')}
              title={`Weak booth: less than 20% vote share for ${selectedParty}`}
            >
              <AlertTriangle size={13} />
              Weak (&lt;20%) <span className="cat-pill-num">{currentStats.weak_count}</span>
            </button>
            <button
              className={`cat-pill-btn deficit ${partyFilter === 'LOST_BOTH' ? 'active' : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'LOST_BOTH' ? 'ALL' : 'LOST_BOTH')}
              title={`Lost in both 2022 & 2024 by ${selectedParty}`}
            >
              <ShieldAlert size={13} />
              Lost Both <span className="cat-pill-num">{currentStats.lost_both_count}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

