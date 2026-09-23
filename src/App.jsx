import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import electionData from './data/qadian_comparison_data.json';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PartyHub from './components/PartyHub';
import BoothGrid from './components/BoothGrid';
import BoothModal from './components/BoothModal';
import CustomDropdown from './components/CustomDropdown';
import ExpiredScreen from './components/ExpiredScreen';
import AccessBanner from './components/AccessBanner';
import ShareModal from './components/ShareModal';
import AdminPanel from './components/AdminPanel';
import { checkAccessStatus } from './config/accessConfig';
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

  // Access Control & Expiration State
  const [accessStatus, setAccessStatus] = useState(() => checkAccessStatus());
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(() => 
    window.location.hash.toLowerCase() === '#admin'
  );
  const [simulationMode, setSimulationMode] = useState(null); // 'warning' | 'expired' | null
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const handleAccessCheck = () => {
      setIsAdminPanelOpen(window.location.hash.toLowerCase() === '#admin');
      setAccessStatus(checkAccessStatus());
    };
    window.addEventListener('hashchange', handleAccessCheck);
    window.addEventListener('popstate', handleAccessCheck);
    return () => {
      window.removeEventListener('hashchange', handleAccessCheck);
      window.removeEventListener('popstate', handleAccessCheck);
    };
  }, []);

  // Support hidden Alt+A hotkey to open Admin Console
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminPanelOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdminUnlock = () => {
    setAccessStatus({ isExpired: false, isAdmin: true, expiryDate: null, remainingMs: Infinity });
  };



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

  // Dynamic stats calculation for all parties directly from verified data
  const partyStats = useMemo(() => {
    const sortedAap = [...booths].sort((a, b) => (b.data_2024.aap || 0) - (a.data_2024.aap || 0));
    const sortedInc = [...booths].sort((a, b) => (b.data_2024.inc || 0) - (a.data_2024.inc || 0));
    const sortedSad = [...booths].sort((a, b) => (b.data_2024.sad || 0) - (a.data_2024.sad || 0));
    const sortedBjp = [...booths].sort((a, b) => (b.data_2024.bjp || 0) - (a.data_2024.bjp || 0));

    const calcParty = (pCode, cand22, cand24, sortedList) => {
      const pKey = pCode.toLowerCase();
      const v22 = summary?.party_votes_2022?.[pCode] || (pCode === 'BJP' ? 0 : 0);
      const s22 = summary?.party_shares_2022?.[pCode] || 0.0;
      const v24 = summary?.party_votes_2024?.[pCode] || 0;
      const s24 = summary?.party_shares_2024?.[pCode] || 0.0;
      const diff = v24 - v22;
      const swing = Number((s24 - s22).toFixed(2));

      return {
        code: pCode,
        candidate_2022: cand22,
        candidate_2024: cand24,
        votes_2022: v22,
        share_2022: s22,
        votes_2024: v24,
        share_2024: s24,
        vote_diff: diff,
        swing: swing,
        booths_won_2022: summary?.booths_won_2022?.[pCode] || 0,
        booths_won_2024: summary?.booths_won_2024?.[pCode] || 0,
        won_both_count: booths.filter(b => b.categories?.[pCode] === 'WON_BOTH').length,
        gained_count: booths.filter(b => b.categories?.[pCode] === 'GAINED').length,
        lost_24_count: booths.filter(b => b.categories?.[pCode] === 'LOST_24').length,
        weak_count: booths.filter(b => b.categories?.[pCode] === 'WEAK').length,
        lost_both_count: booths.filter(b => b.categories?.[pCode] === 'LOST_BOTH').length,
        top_booth: {
          no: sortedList[0]?.booth_no || 0,
          name: sortedList[0]?.village_english || '',
          votes: sortedList[0]?.data_2024[pKey] || 0
        }
      };
    };

    return {
      AAP: calcParty('AAP', 'Jagroop Singh Sekhwan', 'Amansher Singh Shery Kalsi', sortedAap),
      INC: calcParty('INC', 'Partap Singh Bajwa', 'Sukhjinder Singh Randhawa', sortedInc),
      SAD: calcParty('SAD', 'Guriqbal Singh Mahal', 'Dr. Daljit Singh Cheema', sortedSad),
      BJP: calcParty('BJP', 'Did Not Contest', 'Dinesh Singh Babbu', sortedBjp)
    };
  }, [booths, summary]);

  // Filtering & Sorting
  const filteredBooths = useMemo(() => {
    let result = [...booths];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const qNum = q.replace(/^#|^booth\s*/i, '').trim();
      result = result.filter(b => 
        b.booth_no.toString() === q ||
        b.booth_no.toString() === qNum ||
        b.village_english.toLowerCase().includes(q) ||
        b.village_punjabi.includes(q) ||
        b.exact_name_punjabi.includes(q) ||
        (b.booth_name_official && b.booth_name_official.toLowerCase().includes(q))
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
      } else if (partyFilter === 'FLIPPED_ONLY') {
        result = result.filter(b => b.comparison.is_flip);
      } else if (partyFilter === 'RETAINED_ONLY') {
        result = result.filter(b => !b.comparison.is_flip);
      }
    } else {
      // Party-specific mode (AAP, INC, SAD, BJP)
      const pKey = selectedParty.toLowerCase();
      if (partyFilter !== 'ALL') {
        result = result.filter(b => {
          const w22 = b.data_2022.winner_party;
          const w24 = b.data_2024.winner_party;
          const pct24 = b.data_2024[`${pKey}_pct`] || 0;

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

  // Render hidden Admin Console if #admin route or opened via Alt+A / double-click
  if (isAdminPanelOpen) {
    return (
      <AdminPanel 
        onClose={() => {
          setIsAdminPanelOpen(false);
          if (window.location.hash.toLowerCase() === '#admin') {
            window.location.hash = '';
          }
        }}
        onSimulateLastMinute={() => {
          setIsAdminPanelOpen(false);
          setSimulationMode('warning');
          setTimeout(() => setSimulationMode(null), 60000);
        }}
        onSimulateExpired={() => {
          setIsAdminPanelOpen(false);
          setSimulationMode('expired');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // If access is expired (or in expired simulation mode) and visitor is not admin, show ExpiredScreen
  if (simulationMode === 'expired' || (accessStatus.isExpired && !accessStatus.isAdmin)) {
    return (
      <ExpiredScreen 
        expiryDate={accessStatus.expiryDate}
        onAdminUnlock={() => {
          setSimulationMode(null);
          handleAdminUnlock();
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="dsidein-app-root">
      {/* Active Expiration Warning Pill / Banner (Only shown in final 60 seconds) */}
      {(accessStatus.expiryDate || simulationMode === 'warning') && !accessStatus.isAdmin && (
        <AccessBanner 
          expiryDate={simulationMode === 'warning' ? new Date(Date.now() + 45000) : accessStatus.expiryDate} 
          onExpire={() => setAccessStatus(prev => ({ ...prev, isExpired: true }))}
          isAdmin={accessStatus.isAdmin}
        />
      )}

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
          onOpenAdmin={() => setIsAdminPanelOpen(true)}
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
                href="./Qadian_223_Boothwise_Detailed_Field_Operations_PURE_ENGLISH.pdf" 
                download="Qadian_223_Boothwise_Detailed_Field_Operations_PURE_ENGLISH.pdf"
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
              <div className="kpi-label">AAP (SHERY KALSI)</div>
              <div className="kpi-value text-blue">38,654</div>
              <div className="kpi-sub-pill text-blue">
                ● 81 Wins (32.5% Share | +40 Booth Gain)
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

      {/* Share Modal Dialog */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />
    </div>
  );
}

