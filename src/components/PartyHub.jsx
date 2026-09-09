import React from 'react';
import { Layers, ShieldCheck, TrendingUp, TrendingDown, AlertTriangle, ShieldAlert, Award, Filter } from 'lucide-react';

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
      {/* 1. Main Segment Switcher Tabs & Live Summary */}
      <div className="party-pills-row">
        <div className="party-pill-tabs">
          {/* Complete List Button */}
          <button
            className={`party-tab-pill ${selectedParty === 'ALL' ? 'active all' : ''}`}
            onClick={() => { setSelectedParty('ALL'); setPartyFilter('ALL'); }}
            title="View complete list of all 223 booths"
          >
            <Layers size={15} />
            <span className="party-tab-text">Complete List</span>
            <span className="tab-pill-count">223</span>
          </button>

          {/* AAP Analytics Button: AAP Blue & Yellow */}
          <button
            className={`party-tab-pill ${selectedParty === 'AAP' ? 'active aap' : ''}`}
            onClick={() => { setSelectedParty('AAP'); setPartyFilter('ALL'); }}
            title="Switch to AAP Booth Analytics (Blue & Yellow)"
          >
            <span className="party-color-indicator aap-indicator"></span>
            <span className="party-tab-text">AAP Analytics</span>
            <span className="tab-pill-count aap-badge">81 Wins</span>
          </button>

          {/* INC Analytics Button: INC Orange */}
          <button
            className={`party-tab-pill ${selectedParty === 'INC' ? 'active inc' : ''}`}
            onClick={() => { setSelectedParty('INC'); setPartyFilter('ALL'); }}
            title="Switch to INC Booth Analytics (Saffron Orange)"
          >
            <span className="party-color-indicator inc-indicator"></span>
            <span className="party-tab-text">INC Analytics</span>
            <span className="tab-pill-count inc-badge">111 Wins</span>
          </button>
        </div>

        {/* Compact Vitals Badge Strip */}
        <div className="compact-vitals-line" title="Aggregated Constituency & Party Vitals">
          {selectedParty === 'ALL' ? (
            <>
              <div className="vital-item">
                <span className="vital-lbl">Turnout</span>
                <span className="vital-val">{summary.total_votes_2024.toLocaleString()}</span>
                <span className="vital-sub">72.1%</span>
              </div>
              <span className="vital-divider" aria-hidden="true" />
              <div className="vital-item lead-inc">
                <span className="vital-lbl">INC Lead</span>
                <span className="vital-val">+3,152</span>
              </div>
              <span className="vital-divider hide-mobile" aria-hidden="true" />
              <div className="vital-item hide-mobile">
                <span className="vital-lbl">Wins</span>
                <span className="vital-val">INC: 111 · AAP: 81 · BJP: 25 · SAD: 5</span>
              </div>
            </>
          ) : (
            <>
              <div className="vital-item">
                <span className="vital-lbl">’22 Votes</span>
                <span className="vital-val">{selectedParty === 'AAP' ? '41,125' : '48,116'}</span>
                <span className="vital-sub">({selectedParty === 'AAP' ? '31.3%' : '36.6%'})</span>
              </div>
              <span className="vital-divider" aria-hidden="true" />
              <div className="vital-item">
                <span className="vital-lbl">’24 Votes</span>
                <span className="vital-val">{selectedParty === 'AAP' ? '38,654' : '41,806'}</span>
                <span className="vital-sub">({selectedParty === 'AAP' ? '32.5%' : '35.1%'})</span>
              </div>
              <span className="vital-divider" aria-hidden="true" />
              <div className="vital-item">
                <span className="vital-lbl">Net Shift</span>
                <span className="vital-val shift-loss">{selectedParty === 'AAP' ? '-2,471' : '-6,310'}</span>
              </div>
              <span className="vital-divider hide-mobile" aria-hidden="true" />
              <div className="vital-item hide-mobile">
                <span className="vital-lbl">Top Booth</span>
                <span className="vital-val">#{currentStats.top_booth.no}</span>
                <span className="vital-sub">({currentStats.top_booth.votes}v)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Enhanced Category Filter Pills */}
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
          </div>
        ) : (
          <div className="cat-pill-group">
            <button
              className={`cat-pill-btn ${partyFilter === 'ALL' ? `active ${selectedParty === 'AAP' ? 'aap-active' : 'inc-active'}` : ''}`}
              onClick={() => setPartyFilter('ALL')}
            >
              <span>All Booths</span>
              <span className="cat-pill-num">223</span>
            </button>
            <button
              className={`cat-pill-btn won ${partyFilter === 'WON_BOTH' ? `active ${selectedParty === 'AAP' ? 'aap-active' : 'inc-active'}` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'WON_BOTH' ? 'ALL' : 'WON_BOTH')}
              title={`Won in both 2022 & 2024 by ${selectedParty}`}
            >
              <ShieldCheck size={13} />
              <span>Won Both</span>
              <span className="cat-pill-num">{currentStats.won_both_count}</span>
            </button>
            <button
              className={`cat-pill-btn gained ${partyFilter === 'GAINED' ? `active ${selectedParty === 'AAP' ? 'aap-active' : 'inc-active'}` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'GAINED' ? 'ALL' : 'GAINED')}
              title={`Gained by ${selectedParty} in 2024`}
            >
              <TrendingUp size={13} />
              <span>Gained in ’24</span>
              <span className="cat-pill-num">{currentStats.gained_count}</span>
            </button>
            <button
              className={`cat-pill-btn lost ${partyFilter === 'LOST_24' ? `active ${selectedParty === 'AAP' ? 'aap-active' : 'inc-active'}` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'LOST_24' ? 'ALL' : 'LOST_24')}
              title={`Won in 2022, lost in 2024 by ${selectedParty}`}
            >
              <TrendingDown size={13} />
              <span>Lost in ’24</span>
              <span className="cat-pill-num">{currentStats.lost_24_count}</span>
            </button>
            <button
              className={`cat-pill-btn weak ${partyFilter === 'WEAK' ? `active ${selectedParty === 'AAP' ? 'aap-active' : 'inc-active'}` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'WEAK' ? 'ALL' : 'WEAK')}
              title={`Weak booth: less than 20% vote share for ${selectedParty}`}
            >
              <AlertTriangle size={13} />
              <span>Weak (&lt;20%)</span>
              <span className="cat-pill-num">{currentStats.weak_count}</span>
            </button>
            <button
              className={`cat-pill-btn deficit ${partyFilter === 'LOST_BOTH' ? `active ${selectedParty === 'AAP' ? 'aap-active' : 'inc-active'}` : ''}`}
              onClick={() => setPartyFilter(partyFilter === 'LOST_BOTH' ? 'ALL' : 'LOST_BOTH')}
              title={`Lost in both 2022 & 2024 by ${selectedParty}`}
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


