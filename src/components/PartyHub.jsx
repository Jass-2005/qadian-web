import React from 'react';
import { Layers, ShieldCheck, TrendingUp, TrendingDown, AlertTriangle, ShieldAlert, Award } from 'lucide-react';

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
    <section className="party-hub-wrap" aria-label="Party Analytics Hub">
      {/* Top Switcher Row */}
      <div className="party-switcher-row">
        <div className="party-nav-group">
          {/* Complete List Button */}
          <button
            className={`party-nav-btn ${selectedParty === 'ALL' ? 'active all' : ''}`}
            onClick={() => { setSelectedParty('ALL'); setPartyFilter('ALL'); }}
          >
            <Layers size={16} />
            <strong>Complete List</strong>
            <span className="party-badge">All 223 Booths</span>
          </button>

          {/* AAP Analysis Button */}
          <button
            className={`party-nav-btn ${selectedParty === 'AAP' ? 'active aap' : ''}`}
            onClick={() => { setSelectedParty('AAP'); setPartyFilter('ALL'); }}
          >
            <span className="dot dot-aap"></span>
            <strong>AAP Analysis</strong>
            <span className="party-badge">81 Wins in ’24</span>
          </button>

          {/* INC Analysis Button */}
          <button
            className={`party-nav-btn ${selectedParty === 'INC' ? 'active inc' : ''}`}
            onClick={() => { setSelectedParty('INC'); setPartyFilter('ALL'); }}
          >
            <span className="dot dot-inc"></span>
            <strong>INC Analysis</strong>
            <span className="party-badge">111 Wins in ’24</span>
          </button>
        </div>

        {/* Vital Stats Strip */}
        {selectedParty === 'ALL' ? (
          <div className="party-vital-strip">
            <div className="vital-item">
              <span className="vital-label">Total Votes:</span>
              <strong>{summary.total_votes_2024.toLocaleString()}</strong>
              <span className="vital-sub">(-9.46% vs ’22)</span>
            </div>
            <div className="vital-divider" />
            <div className="vital-item">
              <span className="vital-label">INC Lead:</span>
              <strong style={{ color: 'var(--color-inc)' }}>+3,152 votes</strong>
            </div>
            <div className="vital-divider" />
            <div className="vital-item">
              <span className="vital-label">Party Seats:</span>
              <span>INC: 111 | AAP: 81 | BJP: 25 | SAD: 5</span>
            </div>
          </div>
        ) : (
          <div className="party-vital-strip">
            <div className="vital-item">
              <span className="vital-label">2022 Votes:</span>
              <strong>{currentStats.votes_2022.toLocaleString()}</strong>
              <span className="vital-sub">({currentStats.share_2022}%)</span>
            </div>
            <div className="vital-divider" />
            <div className="vital-item">
              <span className="vital-label">2024 Votes:</span>
              <strong>{currentStats.votes_2024.toLocaleString()}</strong>
              <span className="vital-sub">({currentStats.share_2024}%)</span>
            </div>
            <div className="vital-divider" />
            <div className="vital-item">
              <span className="vital-label">Net Shift:</span>
              <strong style={{ color: currentStats.vote_diff >= 0 ? 'var(--status-won)' : 'var(--status-lost)' }}>
                {currentStats.vote_diff >= 0 ? `+${currentStats.vote_diff.toLocaleString()}` : currentStats.vote_diff.toLocaleString()}
              </strong>
            </div>
            <div className="vital-divider" />
            <div className="vital-item">
              <span className="vital-label">Top Booth:</span>
              <strong title={currentStats.top_booth.name}>
                #{currentStats.top_booth.no} ({currentStats.top_booth.votes} votes)
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Category Cards */}
      {selectedParty === 'ALL' ? (
        /* Complete List Mode: Quick Overview Cards */
        <div className="category-cards-grid">
          <button
            className={`cat-card ${partyFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setPartyFilter('ALL')}
          >
            <div className="cat-card-top">
              <span className="cat-icon deficit"><Layers size={16} /></span>
              <span className="cat-count">223</span>
            </div>
            <div className="cat-title">All 223 Booths</div>
            <div className="cat-desc">Complete constituency master list</div>
          </button>

          <button
            className={`cat-card ${partyFilter === 'INC_WINS' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'INC_WINS' ? 'ALL' : 'INC_WINS')}
          >
            <div className="cat-card-top">
              <span className="cat-icon won"><Award size={16} /></span>
              <span className="cat-count">111</span>
            </div>
            <div className="cat-title">INC Wins in 2024</div>
            <div className="cat-desc">41,806 votes (35.13% share)</div>
          </button>

          <button
            className={`cat-card ${partyFilter === 'AAP_WINS' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'AAP_WINS' ? 'ALL' : 'AAP_WINS')}
          >
            <div className="cat-card-top">
              <span className="cat-icon weak"><Award size={16} /></span>
              <span className="cat-count">81</span>
            </div>
            <div className="cat-title">AAP Wins in 2024</div>
            <div className="cat-desc">38,654 votes (32.48% share)</div>
          </button>

          <button
            className={`cat-card ${partyFilter === 'BJP_WINS' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'BJP_WINS' ? 'ALL' : 'BJP_WINS')}
          >
            <div className="cat-card-top">
              <span className="cat-icon gained"><Award size={16} /></span>
              <span className="cat-count">25</span>
            </div>
            <div className="cat-title">BJP Wins in 2024</div>
            <div className="cat-desc">12,959 votes (Urban Dhariwal/Qadian)</div>
          </button>

          <button
            className={`cat-card ${partyFilter === 'SAD_WINS' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'SAD_WINS' ? 'ALL' : 'SAD_WINS')}
          >
            <div className="cat-card-top">
              <span className="cat-icon gained"><Award size={16} /></span>
              <span className="cat-count">5</span>
            </div>
            <div className="cat-title">SAD Wins in 2024</div>
            <div className="cat-desc">15,568 votes across Qadian</div>
          </button>
        </div>
      ) : (
        /* Party-Specific 5 Category Cards (AAP or INC) */
        <div className="category-cards-grid">
          {/* 1. Won Both Times */}
          <button
            className={`cat-card ${partyFilter === 'WON_BOTH' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'WON_BOTH' ? 'ALL' : 'WON_BOTH')}
          >
            <div className="cat-card-top">
              <span className="cat-icon won"><ShieldCheck size={16} /></span>
              <span className="cat-count">{currentStats.won_both_count}</span>
            </div>
            <div className="cat-title">Won Both Times</div>
            <div className="cat-desc">Consistent strongholds in 2022 & 2024</div>
          </button>

          {/* 2. Gained in 2024 */}
          <button
            className={`cat-card ${partyFilter === 'GAINED' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'GAINED' ? 'ALL' : 'GAINED')}
          >
            <div className="cat-card-top">
              <span className="cat-icon gained"><TrendingUp size={16} /></span>
              <span className="cat-count">{currentStats.gained_count}</span>
            </div>
            <div className="cat-title">Gained in 2024</div>
            <div className="cat-desc">Lost in 2022, flipped to {selectedParty} in 2024</div>
          </button>

          {/* 3. Lost in 2024 */}
          <button
            className={`cat-card ${partyFilter === 'LOST_24' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'LOST_24' ? 'ALL' : 'LOST_24')}
          >
            <div className="cat-card-top">
              <span className="cat-icon lost"><TrendingDown size={16} /></span>
              <span className="cat-count">{currentStats.lost_24_count}</span>
            </div>
            <div className="cat-title">Lost in 2024</div>
            <div className="cat-desc">Won in 2022, but lost to rivals in 2024</div>
          </button>

          {/* 4. Weak Booths */}
          <button
            className={`cat-card ${partyFilter === 'WEAK' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'WEAK' ? 'ALL' : 'WEAK')}
          >
            <div className="cat-card-top">
              <span className="cat-icon weak"><AlertTriangle size={16} /></span>
              <span className="cat-count">{currentStats.weak_count}</span>
            </div>
            <div className="cat-title">Weak Booths</div>
            <div className="cat-desc">Low vote share (&lt; 20% of polled votes)</div>
          </button>

          {/* 5. Lost Both Times */}
          <button
            className={`cat-card ${partyFilter === 'LOST_BOTH' ? 'active' : ''}`}
            onClick={() => setPartyFilter(partyFilter === 'LOST_BOTH' ? 'ALL' : 'LOST_BOTH')}
          >
            <div className="cat-card-top">
              <span className="cat-icon deficit"><ShieldAlert size={16} /></span>
              <span className="cat-count">{currentStats.lost_both_count}</span>
            </div>
            <div className="cat-title">Lost Both Times</div>
            <div className="cat-desc">Never led in either 2022 or 2024</div>
          </button>
        </div>
      )}
    </section>
  );
}
