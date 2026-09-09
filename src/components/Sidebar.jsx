import React from 'react';
import { LayoutDashboard, MapPin, Users, FileSpreadsheet, Map, Shield, ExternalLink } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="dsidein-sidebar no-print">
      {/* Top Logo */}
      <div className="sidebar-logo-wrap">
        <a 
          href="https://dsidein.com/qadian-2022-2024" 
          title="Dsidein Command Center — https://dsidein.com/qadian-2022-2024"
          className="sidebar-brand-link"
        >
          <img 
            src="./dsidein_logo_transparent.png" 
            alt="Dsidein Logo" 
            className="sidebar-dsidein-logo" 
          />
        </a>
      </div>

      {/* Navigation Icons */}
      <nav className="sidebar-nav">
        <button 
          className={`sidebar-nav-btn ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
          onClick={() => setActiveTab('DASHBOARD')}
          title="Analytics Dashboard"
        >
          <div className="active-rail-indicator" />
          <LayoutDashboard size={20} />
        </button>

        <button 
          className={`sidebar-nav-btn ${activeTab === 'PARTY_HUB' ? 'active' : ''}`}
          onClick={() => setActiveTab('PARTY_HUB')}
          title="Party Intelligence Hub"
        >
          <Users size={20} />
        </button>

        <button 
          className={`sidebar-nav-btn ${activeTab === 'BOOTHS' ? 'active' : ''}`}
          onClick={() => setActiveTab('BOOTHS')}
          title="223 Booths Explorer"
        >
          <MapPin size={20} />
        </button>

        <a 
          href="./Qadian_Master_Booth_Analysis_AAP_INC.xlsx" 
          download="Qadian_Master_Booth_Analysis_AAP_INC.xlsx"
          className="sidebar-nav-btn"
          title="Master Excel Spreadsheet (.xlsx)"
        >
          <FileSpreadsheet size={20} />
        </a>

        <a 
          href="https://dsidein.com" 
          target="_blank" 
          rel="noreferrer"
          className="sidebar-nav-btn"
          title="Dsidein Platform — dsidein.com"
        >
          <ExternalLink size={18} />
        </a>
      </nav>

      {/* Bottom Profile Avatar */}
      <div className="sidebar-bottom">
        <div className="sidebar-avatar" title="Dsidein Command Center">
          <img 
            src="./dsidein_logo_transparent.png" 
            alt="Dsidein User" 
            style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
          />
        </div>
      </div>
    </aside>
  );
}
