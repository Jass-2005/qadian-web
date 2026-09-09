import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import electionData from './data/qadian_comparison_data.json';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PartyHub from './components/PartyHub';
import BoothGrid from './components/BoothGrid';
import BoothModal from './components/BoothModal';
import { 
  Search, 
  RotateCcw, 
  Printer, 
  MapPin, 
  Users, 
  FileSpreadsheet, 
  FileText, 
  Compass, 
  Layers, 
  Activity, 
  CheckCircle2, 
  BarChart3,
  ExternalLink,
  ShieldAlert,
  Database
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('light'); // Default to light theme matching Dsidein screenshot
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [selectedParty, setSelectedParty] = useState('ALL'); // 'ALL', 'AAP', 'INC'
  const [partyFilter, setPartyFilter] = useState('ALL'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('BOOTH_ASC');
  const [selectedBooth, setSelectedBooth] = useState(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const { summary, booths } = electionData;

  // Pre-calculated stats for AAP & INC
  const partyStats = useMemo(() => {
    const sortedAap = [...booths].sort((a, b) => b.data_2024.aap - a.data_2024.aap);
    const sortedInc = [...booths].sort((a, b) => b.data_2024.inc - a.data_2024.inc);

    return {
      AAP: {
        votes_2022: 41125,
        share_2022: 31.30,
        votes_2024: 38654,
        share_2024: 32.48,
        vote_diff: -2471,
        won_both_count: 18,
        gained_count: 63,
        lost_24_count: 39,
        weak_count: 31,
        lost_both_count: 103,
        top_booth: {
          no: sortedAap[0].booth_no,
          name: sortedAap[0].village_english,
          votes: sortedAap[0].data_2024.aap
        }
      },
      INC: {
        votes_2022: 48116,
        share_2022: 36.61,
        votes_2024: 41806,
        share_2024: 35.13,
        vote_diff: -6310,
        won_both_count: 69,
        gained_count: 42,
        lost_24_count: 56,
        weak_count: 21,
        lost_both_count: 56,
        top_booth: {
          no: sortedInc[0].booth_no,
          name: sortedInc[0].village_english,
          votes: sortedInc[0].data_2024.inc
        }
      }
    };
  }, [booths]);

  // Filtering & Sorting
  const filteredBooths = useMemo(() => {
    let result = [...booths];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(b => 
        b.booth_no.toString() === q ||
        b.village_english.toLowerCase().includes(q) ||
        b.village_punjabi.includes(q) ||
        b.exact_name_punjabi.includes(q)
      );
    }

    // 2. Filter logic based on mode
    if (selectedParty === 'ALL') {
      if (partyFilter === 'INC_WINS') {
        result = result.filter(b => b.data_2024.winner_party === 'INC');
      } else if (partyFilter === 'AAP_WINS') {
        result = result.filter(b => b.data_2024.winner_party === 'AAP');
      } else if (partyFilter === 'BJP_WINS') {
        result = result.filter(b => b.data_2024.winner_party === 'BJP');
      } else if (partyFilter === 'SAD_WINS') {
        result = result.filter(b => b.data_2024.winner_party === 'SAD');
      }
    } else {
      // Party-specific mode (AAP or INC)
      const pKey = selectedParty.toLowerCase();
      if (partyFilter !== 'ALL') {
        result = result.filter(b => {
          const w22 = b.data_2022.winner_party;
          const w24 = b.data_2024.winner_party;
          const pct24 = b.data_2024[`${pKey}_pct`];

          if (partyFilter === 'WON_BOTH') {
            return w22 === selectedParty && w24 === selectedParty;
          }
          if (partyFilter === 'GAINED') {
            return w22 !== selectedParty && w24 === selectedParty;
          }
          if (partyFilter === 'LOST_24') {
            return w22 === selectedParty && w24 !== selectedParty;
          }
          if (partyFilter === 'WEAK') {
            return pct24 < 20.0 && b.data_2024.total > 0;
          }
          if (partyFilter === 'LOST_BOTH') {
            return w22 !== selectedParty && w24 !== selectedParty;
          }
          return true;
        });
      }
    }

    // 3. Sorting
    result.sort((a, b) => {
      const pKey = selectedParty === 'ALL' ? 'inc' : selectedParty.toLowerCase();
      switch (sortBy) {
        case 'BOOTH_DESC':
          return b.booth_no - a.booth_no;
        case 'VOTES_DESC':
          return b.data_2024[pKey] - a.data_2024[pKey];
        case 'VOTES_ASC':
          return a.data_2024[pKey] - b.data_2024[pKey];
        case 'TURNOUT_DESC':
          return b.data_2024.total - a.data_2024.total;
        case 'MARGIN_DESC':
          return b.data_2024.margin - a.data_2024.margin;
        case 'BOOTH_ASC':
        default:
          return a.booth_no - b.booth_no;
      }
    });

    return result;
  }, [booths, selectedParty, partyFilter, searchQuery, sortBy]);

  // Reset all filters
  const handleResetToCompleteList = () => {
    setSelectedParty('ALL');
    setPartyFilter('ALL');
    setSearchQuery('');
    setSortBy('BOOTH_ASC');
  };

  // Export Single Booth to PDF
  const handleExportBoothPdf = (booth) => {
    setSelectedBooth(booth);
    setTimeout(() => {
      document.body.classList.add('printing-single-booth');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-single-booth');
      }, 1000);
    }, 150);
  };

  // Export Filtered View / Master List to PDF
  const handlePrintMasterReport = () => {
    document.body.classList.remove('printing-single-booth');
    window.print();
  };

  return (
    <div className="dsidein-app-root">
      {/* 1. Left Slim Navigation Rail */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Content Frame */}
      <div className="dsidein-content-frame">
        {/* Top Navigation Bar */}
        <Header theme={theme} toggleTheme={toggleTheme} onMenuClick={() => {}} />

        {/* Dsidein Official PDF Watermark (Active on all PDF exports & printing) */}
        <div className="dsidein-print-watermark" aria-hidden="true">
          <img src="./dsidein_logo_transparent.png" alt="Dsidein" className="watermark-logo-img" />
          <div className="watermark-brand-name">DSIDEIN</div>
          <div className="watermark-sub-name">FIELD INTELLIGENCE & TELEMETRY</div>
          <div className="watermark-url">https://dsidein.com/qadian-2022-2024</div>
        </div>

        {/* Print Master Report Header (Visible only on print) */}
        <div className="print-report-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '15pt', fontWeight: 800, color: '#002b49' }}>
                18-QADIAN ASSEMBLY SEGMENT (GURDASPUR PC)
              </div>
              <div style={{ fontSize: '10pt', color: '#475569', marginTop: '2px' }}>
                Comparative Booth Intelligence: 2022 Assembly vs 2024 Lok Sabha Polling
              </div>
              <div style={{ fontSize: '8.5pt', color: '#64748b', marginTop: '4px' }}>
                Active Filter: {selectedParty === 'ALL' ? 'Complete Master List' : `${selectedParty} Segment`} | Total Booths: {filteredBooths.length} of 223
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#334155' }}>
              <span style={{ fontWeight: 800, color: '#002b49' }}>DSIDEIN COMMAND CENTER</span><br />
              <span>https://dsidein.com/qadian-2022-2024</span>
            </div>
          </div>
        </div>

        {/* Scrollable Main Dashboard Area */}
        <main className="dsidein-main-body">
          {/* Hero Welcome Header (Matching Dsidein Command Center) */}
          <section className="dsidein-hero-banner">
            <div className="hero-text-wrap">
              <h1 className="hero-title">
                Welcome back, <span className="hero-highlight">Dsidein!</span>
              </h1>
              <p className="hero-subtitle">
                Your election analytics command center for 18-Qadian (2022 Assembly vs 2024 Lok Sabha).
              </p>
            </div>

            <div className="hero-actions-wrap">
              <button 
                className="hero-btn-green"
                onClick={() => handleResetToCompleteList()}
                title="View Live Map and All 223 Booths"
              >
                <Compass size={16} />
                <span>Live Map (223 Booths)</span>
              </button>

              <button 
                className="hero-btn-blue"
                onClick={() => setSelectedParty(prev => prev === 'ALL' ? 'AAP' : prev === 'AAP' ? 'INC' : 'ALL')}
                title="Toggle Constituency Party Hierarchy"
              >
                <Layers size={16} />
                <span>Constituency Hierarchy</span>
              </button>
            </div>
          </section>

          {/* Quick Actions Control Panel */}
          <section className="quick-actions-section">
            <div className="section-mini-heading">QUICK ACTIONS CONTROL PANEL</div>
            <div className="quick-actions-grid">
              <button 
                className="quick-action-card"
                onClick={handleResetToCompleteList}
                title="Show all 223 booths"
              >
                <div className="quick-icon-wrap icon-green">
                  <Compass size={18} />
                </div>
                <span className="quick-action-text">Live Map (223)</span>
              </button>

              <button 
                className="quick-action-card"
                onClick={() => setSelectedParty(prev => prev === 'AAP' ? 'INC' : 'AAP')}
                title="Switch Party Intelligence (AAP / INC)"
              >
                <div className="quick-icon-wrap icon-blue">
                  <Users size={18} />
                </div>
                <span className="quick-action-text">Party Hub ({selectedParty})</span>
              </button>

              <a 
                href="./Qadian_Master_Booth_Analysis_AAP_INC.xlsx" 
                download="Qadian_Master_Booth_Analysis_AAP_INC.xlsx"
                className="quick-action-card"
                title="Download Master Excel Spreadsheet with color coding"
              >
                <div className="quick-icon-wrap icon-teal">
                  <FileSpreadsheet size={18} />
                </div>
                <span className="quick-action-text">Master Excel</span>
              </a>

              <a 
                href="./Qadian_Master_Booth_Analysis_AAP.docx" 
                download="Qadian_Master_Booth_Analysis_AAP.docx"
                className="quick-action-card"
                title="Download Strategic Analysis Report (Word .docx)"
              >
                <div className="quick-icon-wrap icon-purple">
                  <FileText size={18} />
                </div>
                <span className="quick-action-text">Report (.docx)</span>
              </a>

              <button 
                className="quick-action-card"
                onClick={handlePrintMasterReport}
                title="Export Filtered Table as PDF with Dsidein Watermark"
              >
                <div className="quick-icon-wrap icon-orange">
                  <Printer size={18} />
                </div>
                <span className="quick-action-text">Export PDF</span>
              </button>

              <button 
                className="quick-action-card"
                onClick={handleResetToCompleteList}
                title="Reset all filters to complete view"
              >
                <div className="quick-icon-wrap icon-rose">
                  <RotateCcw size={18} />
                </div>
                <span className="quick-action-text">Reset All</span>
              </button>
            </div>
          </section>

          {/* Dsidein KPI Metric Cards */}
          <section className="dsidein-kpi-grid">
            {/* KPI 1: Live Status */}
            <div className="dsidein-kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-icon-pill icon-blue">
                  <Compass size={18} />
                </div>
              </div>
              <div className="kpi-label">LIVE TRACKING MAP</div>
              <div className="kpi-value text-blue">Active</div>
              <div className="kpi-sub-pill text-blue">
                ● Real-time Telemetry: 223 Booths
              </div>
            </div>

            {/* KPI 2: Total Turnout */}
            <div className="dsidein-kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-icon-pill icon-orange">
                  <Activity size={18} />
                </div>
              </div>
              <div className="kpi-label">2024 VALID VOTES</div>
              <div className="kpi-value">118,991</div>
              <div className="kpi-sub-pill text-orange">
                ● 72.1% Valid Polled (vs 131,418 in ’22)
              </div>
            </div>

            {/* KPI 3: Congress (INC) */}
            <div className="dsidein-kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-icon-pill icon-green">
                  <BarChart3 size={18} />
                </div>
              </div>
              <div className="kpi-label">CONGRESS (INC)</div>
              <div className="kpi-value text-green">41,806</div>
              <div className="kpi-sub-pill text-green">
                ● 111 Wins (35.1% Vote Share | +3,152 Lead)
              </div>
            </div>

            {/* KPI 4: AAP */}
            <div className="dsidein-kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-icon-pill icon-purple">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="kpi-label">AAP (KALSI)</div>
              <div className="kpi-value text-purple">38,654</div>
              <div className="kpi-sub-pill text-purple">
                ● 81 Wins (32.5% Vote Share | 63 Gains)
              </div>
            </div>
          </section>

          {/* Party Intelligence Hub (Category Filters for AAP & INC) */}
          <PartyHub 
            selectedParty={selectedParty}
            setSelectedParty={setSelectedParty}
            partyFilter={partyFilter}
            setPartyFilter={setPartyFilter}
            partyStats={partyStats}
            summary={summary}
          />

          {/* Search & Sort Toolbar */}
          <div className="search-toolbar">
            <div className="search-field-wrap">
              <Search size={16} />
              <input
                type="text"
                className="search-field"
                placeholder={
                  selectedParty === 'ALL'
                    ? 'Search all 223 booths by number or village name (e.g. 104, Fateh Nangal, ਫਤਿਹ)...'
                    : `Search ${selectedParty} performance by booth no. or village (e.g. 53, Fateh Nangal, ਫਤਿਹ)...`
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Export View as PDF */}
              <button
                onClick={handlePrintMasterReport}
                className="toggle-btn btn-export-master"
                style={{ padding: '8px 12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 600 }}
                title="Print or Export Current Filtered Table as PDF with Dsidein Watermark"
              >
                <Printer size={14} />
                <span>Export List PDF</span>
              </button>

              {/* Reset / Complete List Button */}
              <button
                onClick={handleResetToCompleteList}
                className="toggle-btn"
                style={{ padding: '8px 12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}
                title="Show all 223 booths and reset filters"
              >
                <RotateCcw size={14} />
                <span>Show All 223</span>
              </button>

              {/* Sort Dropdown */}
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort Booths"
              >
                <option value="BOOTH_ASC">Sort: Booth No. (1 → 223)</option>
                <option value="BOOTH_DESC">Sort: Booth No. (223 → 1)</option>
                <option value="TURNOUT_DESC">Highest 2024 Turnout</option>
                <option value="MARGIN_DESC">Highest 2024 Margin</option>
                {selectedParty !== 'ALL' && (
                  <>
                    <option value="VOTES_DESC">Highest {selectedParty} Votes</option>
                    <option value="VOTES_ASC">Lowest {selectedParty} Votes</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Booth List / Grid */}
          <BoothGrid 
            booths={filteredBooths}
            selectedParty={selectedParty}
            partyFilter={partyFilter}
            onSelectBooth={(b) => setSelectedBooth(b)}
            onExportBoothPdf={handleExportBoothPdf}
          />
        </main>
      </div>

      {/* Booth Inspector Modal */}
      {selectedBooth && (
        <BoothModal 
          booth={selectedBooth}
          onClose={() => setSelectedBooth(null)}
        />
      )}
    </div>
  );
}
