import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  winner22Filter,
  setWinner22Filter,
  winner24Filter,
  setWinner24Filter,
  sortBy,
  setSortBy,
  totalCount
}) {
  const quickFilters = [
    { id: 'ALL', label: `All Booths (${totalCount})` },
    { id: 'RETAINED_INC', label: 'Retained INC (69)' },
    { id: 'RETAINED_AAP', label: 'Retained AAP (18)' },
    { id: 'FLIPPED_TO_BJP', label: 'Flipped to BJP (25)' },
    { id: 'FLIPPED_TO_AAP', label: 'Flipped to AAP (63)' },
    { id: 'FLIPPED_TO_INC', label: 'Flipped to INC (42)' },
    { id: 'SAD_LOST', label: 'SAD Lost Booths (36)' },
  ];

  return (
    <nav className="toolbar-container" aria-label="Booth Search and Filter Toolbar">
      {/* Top Search & Dropdowns Row */}
      <div className="toolbar-row">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search booth number, village (e.g. 104, Fateh Nangal, ਫਤਿਹ ਨੰਗਲ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-selects">
          {/* 2022 Winner Filter */}
          <select
            className="filter-select"
            value={winner22Filter}
            onChange={(e) => setWinner22Filter(e.target.value)}
            aria-label="Filter by 2022 Winner"
          >
            <option value="ALL">2022 Winner: All</option>
            <option value="INC">2022: INC Won</option>
            <option value="AAP">2022: AAP Won</option>
            <option value="SAD">2022: SAD Won</option>
          </select>

          {/* 2024 Winner Filter */}
          <select
            className="filter-select"
            value={winner24Filter}
            onChange={(e) => setWinner24Filter(e.target.value)}
            aria-label="Filter by 2024 Winner"
          >
            <option value="ALL">2024 Winner: All</option>
            <option value="INC">2024: INC Won</option>
            <option value="AAP">2024: AAP Won</option>
            <option value="BJP">2024: BJP Won</option>
            <option value="SAD">2024: SAD Won</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort Booths"
          >
            <option value="BOOTH_ASC">Sort: Booth (1 → 223)</option>
            <option value="BOOTH_DESC">Sort: Booth (223 → 1)</option>
            <option value="MARGIN_24_DESC">Highest 2024 Margin</option>
            <option value="TURNOUT_24_DESC">Highest 2024 Turnout</option>
            <option value="TURNOUT_DIFF_DESC">Turnout Gain (Top)</option>
            <option value="TURNOUT_DIFF_ASC">Turnout Drop (Top)</option>
            <option value="BJP_GAIN_DESC">Highest BJP Gain</option>
            <option value="INC_SWING_DESC">Highest INC Swing</option>
            <option value="AAP_SWING_DESC">Highest AAP Swing</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="filter-pills-row" role="tablist" aria-label="Status Quick Filters">
        {quickFilters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={activeFilter === f.id}
            className={`filter-pill ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
