import React from 'react';
import { Sun, Moon, Menu, ChevronDown, Search } from 'lucide-react';

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

        {/* Right: Theme & Dsidein User Profile */}
        <div className="header-right">

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

