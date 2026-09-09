import React from 'react';
import { Sun, Moon, Menu, ChevronDown, FileSpreadsheet, FileText, ExternalLink, Search } from 'lucide-react';

export default function Header({ 
  theme, 
  toggleTheme, 
  onMenuClick,
  searchQuery,
  setSearchQuery
}) {
  return (
    <header className="app-header no-print">
      <div className="header-container">
        {/* Left: Hamburger & Dashboard Label */}
        <div className="header-left">
          <button 
            className="btn-icon header-hamburger" 
            onClick={onMenuClick}
            aria-label="Toggle Menu"
          >
            <Menu size={20} />
          </button>
          
          <div className="header-section-label">
            <span className="section-title-text">DASHBOARD</span>
            <span className="header-separator">/</span>
            <span className="header-crumb">18-QADIAN</span>
          </div>
        </div>

        {/* Center: Search input matching Dsidein navbar */}
        <div className="header-center-search">
          <div className="header-search-box">
            <Search size={15} className="header-search-icon" />
            <input 
              type="text" 
              className="header-search-input"
              placeholder="Search 223 booths, villages, numbers..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search booths or villages"
            />
          </div>
        </div>

        {/* Right: Actions, Theme & Dsidein User Profile */}
        <div className="header-right">
          <a 
            href="./Qadian_Master_Booth_Analysis_AAP_INC.xlsx" 
            download="Qadian_Master_Booth_Analysis_AAP_INC.xlsx"
            className="btn-dsidein-action hide-mobile"
            title="Download Master Analysis Spreadsheet (Excel .xlsx with AAP/INC Colors)"
          >
            <FileSpreadsheet size={15} />
            <span>Master Excel</span>
          </a>

          <a 
            href="./Qadian_Master_Booth_Analysis_AAP.docx" 
            download="Qadian_Master_Booth_Analysis_AAP.docx"
            className="btn-dsidein-action hide-mobile"
            title="Download Strategic Analysis Report (Word .docx)"
          >
            <FileText size={15} />
            <span>Report (.docx)</span>
          </a>

          <a 
            href="./Qadian_Detailed_223_Boothwise_Masterplan.docx" 
            download="Qadian_Detailed_223_Boothwise_Masterplan.docx"
            className="btn-dsidein-action hide-mobile"
            title="Download Detailed 223-Booth Master Plan Document in English (Word .docx)"
          >
            <FileText size={15} />
            <span>Master Plan (EN)</span>
          </a>

          <a 
            href="./Qadian_Detailed_223_Boothwise_Masterplan_Punjabi.docx" 
            download="Qadian_Detailed_223_Boothwise_Masterplan_Punjabi.docx"
            className="btn-dsidein-action hide-mobile"
            title="Download Detailed 223-Booth Master Plan Document in Punjabi (Word .docx)"
          >
            <FileText size={15} />
            <span>ਮਾਸਟਰ ਪਲਾਨ (PA)</span>
          </a>

          {/* Theme Toggle */}
          <button 
            className="btn-icon" 
            onClick={toggleTheme} 
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Dsidein User Profile Dropdown */}
          <div className="dsidein-user-profile" title="Dsidein Command Center User">
            <div className="user-avatar-circle">
              <img 
                src="./dsidein_logo_transparent.png" 
                alt="Dsidein" 
                className="user-avatar-img" 
              />
            </div>
            <span className="user-profile-name">Dsidein</span>
            <ChevronDown size={14} className="user-chevron" />
          </div>
        </div>
      </div>
    </header>
  );
}

