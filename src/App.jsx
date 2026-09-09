import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import electionData from './data/qadian_comparison_data.json';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PartyHub from './components/PartyHub';
import BoothGrid from './components/BoothGrid';
import BoothModal from './components/BoothModal';
import CustomDropdown from './components/CustomDropdown';
import { 
  Search, 
  RotateCcw, 
  Printer, 
  MapPin, 
  Users, 
  FileSpreadsheet, 
  Compass, 
  Layers, 
  Activity, 
  CheckCircle2, 
  BarChart3,
  ExternalLink,
  ShieldAlert,
  Database,
  ClipboardList
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('light'); // Default to light theme matching Dsidein screenshot
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [selectedParty, setSelectedParty] = useState('ALL'); // 'ALL', 'AAP', 'INC'
  const [partyFilter, setPartyFilter] = useState('ALL'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('BOOTH_ASC');
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === 'DASHBOARD') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'PARTY_HUB') {
      const el = document.querySelector('.dsidein-registry-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'BOOTHS') {
      const el = document.querySelector('.booth-container');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
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

  // Sort options for CustomDropdown
  const sortOptions = useMemo(() => {
    const opts = [
      { value: 'BOOTH_ASC', label: 'Booth No. (1 → 223)' },
      { value: 'BOOTH_DESC', label: 'Booth No. (223 → 1)' },
      { value: 'TURNOUT_DESC', label: 'Highest 2024 Turnout' },
      { value: 'MARGIN_DESC', label: 'Highest 2024 Margin' },
    ];
    if (selectedParty !== 'ALL') {
      opts.push(
        { value: 'VOTES_DESC', label: `Highest ${selectedParty} Votes` },
        { value: 'VOTES_ASC', label: `Lowest ${selectedParty} Votes` }
      );
    }
    return opts;
  }, [selectedParty]);

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
      {/* 1. Left Slim Navigation Rail / Mobile Drawer */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Frame */}
      <div className="dsidein-content-frame">
        {/* Top Navigation Bar */}
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onMenuClick={() => setMobileMenuOpen(prev => !prev)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

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
          {/* Refined Minimal Page Title Bar (Replacing bulky hero banner) */}
          <section className="dashboard-title-bar">
            <div className="title-text-group">
              <div className="constituency-tag">18-QADIAN ASSEMBLY SEGMENT</div>
              <h1 className="main-title">Comparative Booth Intelligence</h1>
              <p className="main-subtitle">
                2022 Vidhan Sabha vs 2024 Lok Sabha Polling Telemetry across all 223 Polling Stations
              </p>
            </div>

            <div className="title-action-buttons">
              <a 
                href="./Qadian_Master_Booth_Analysis_AAP_INC.xlsx" 
                download="Qadian_Master_Booth_Analysis_AAP_INC.xlsx"
                className="pill-action-btn green"
                title="Download Master Analysis Spreadsheet (Excel .xlsx with AAP/INC Colors)"
              >
                <span className="pill-btn-icon"><FileSpreadsheet size={14} /></span>
                <span className="pill-btn-label">Master Excel</span>
              </a>

              <a 
                href="./Qadian_Detailed_223_Boothwise_Masterplan.pdf" 
                download="Qadian_Detailed_223_Boothwise_Masterplan.pdf"
                className="pill-action-btn purple"
                title="Download Complete 223-Booth Master Plan in English (PDF with Watermark)"
              >
                <span className="pill-btn-icon"><ClipboardList size={14} /></span>
                <span className="pill-btn-label">Master Plan (English PDF)</span>
              </a>

              <a 
                href="./Qadian_223_Boothwise_Detailed_Field_Operations_Punjabi_Revised-final.pdf" 
                download="Qadian_223_Boothwise_Detailed_Field_Operations_Punjabi_Revised-final.pdf"
                className="pill-action-btn amber"
                title="Download 223 Boothwise Detailed Field Operations Plan in Punjabi (PDF with Watermark)"
              >
                <span className="pill-btn-icon"><ClipboardList size={14} /></span>
                <span className="pill-btn-label">223 ਬੂਥ ਮਾਸਟਰ ਪਲਾਨ (ਪੰਜਾਬੀ PDF)</span>
              </a>

              <button 
                onClick={handlePrintMasterReport}
                className="pill-action-btn outline"
                title="Export Current View as PDF with Dsidein Watermark"
              >
                <span className="pill-btn-icon"><Printer size={14} /></span>
                <span className="pill-btn-label">Export PDF</span>
              </button>
            </div>
          </section>

          {/* Dsidein 4 Minimal KPI Metric Cards */}
          <section className="dsidein-kpi-grid">
            {/* KPI 1: Live Telemetry */}
            <div className="dsidein-kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-icon-pill icon-blue">
                  <Compass size={18} />
                </div>
              </div>
              <div className="kpi-label">POLLING STATIONS</div>
              <div className="kpi-value text-blue">223 Booths</div>
              <div className="kpi-sub-pill text-blue">
                ● 100% Monitored & Verified
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
                ● 72.1% Valid Polled (-9.5% vs ’22)
              </div>
            </div>

            {/* KPI 3: Congress (INC) - Saffron Orange */}
            <div className="dsidein-kpi-card inc-kpi">
              <div className="kpi-top-row">
                <div className="kpi-icon-pill icon-orange">
                  <BarChart3 size={18} />
                </div>
              </div>
              <div className="kpi-label">CONGRESS (INC)</div>
              <div className="kpi-value text-orange">41,806</div>
              <div className="kpi-sub-pill text-orange">
                ● 111 Wins (35.1% Share | +3,152 Lead)
              </div>
            </div>

            {/* KPI 4: AAP - Vibrant Blue & Yellow */}
            <div className="dsidein-kpi-card aap-kpi">
              <div className="kpi-top-row">
                <div className="kpi-icon-pill icon-blue">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="kpi-label">AAP (KALSI)</div>
              <div className="kpi-value text-blue">38,654</div>
              <div className="kpi-sub-pill text-blue">
                ● 81 Wins (32.5% Share | 63 Gains)
              </div>
            </div>
          </section>

          {/* Unified Registry Card (Styled after 'Team Progress Today' in Dsidein) */}
          <section className="dsidein-registry-card">
            {/* Card Top Title Row */}
            <div className="registry-card-header">
              <div className="registry-title-group">
                <div className="registry-title-row">
                  <h2 className="registry-title">Booth Performance Registry</h2>
                  <span className="registry-booth-count">{filteredBooths.length} Booths</span>
                </div>
                <p className="registry-subtitle">
                  Detailed booth-by-booth vote tally, turnout, winners, and margin shifts across 18-Qadian
                </p>
              </div>

              <div className="registry-header-actions">
                <button 
                  className="btn-registry-reset"
                  onClick={handleResetToCompleteList}
                  title="Reset all filters to complete view"
                >
                  <RotateCcw size={14} />
                  <span>Reset All</span>
                </button>
              </div>
            </div>

            {/* Party Selector & Category Filter Pills */}
            <PartyHub 
              selectedParty={selectedParty}
              setSelectedParty={setSelectedParty}
              partyFilter={partyFilter}
              setPartyFilter={setPartyFilter}
              partyStats={partyStats}
              summary={summary}
            />

            {/* Search & Sort Sub-Toolbar */}
            <div className="registry-toolbar">
              <div className="toolbar-search-wrap">
                <Search size={15} />
                <input
                  type="text"
                  className="toolbar-search-input"
                  placeholder={
                    selectedParty === 'ALL'
                      ? 'Search all 223 booths by number or village (e.g. 104, Fateh Nangal, ਫਤਿਹ)...'
                      : `Search ${selectedParty} performance by booth no. or village (e.g. 53, Fateh Nangal)...`
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter booths"
                />
              </div>

              <div className="toolbar-controls">
                <button
                  onClick={handlePrintMasterReport}
                  className="btn-toolbar-pdf"
                  title="Export Current Table View as PDF with Dsidein Watermark"
                >
                  <Printer size={14} />
                  <span>Export PDF</span>
                </button>

                <CustomDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                  label="Sort order"
                />
              </div>
            </div>

            {/* Booth Table / Grid */}
            <BoothGrid 
              booths={filteredBooths}
              selectedParty={selectedParty}
              partyFilter={partyFilter}
              onSelectBooth={(b) => setSelectedBooth(b)}
              onExportBoothPdf={handleExportBoothPdf}
            />
          </section>
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
