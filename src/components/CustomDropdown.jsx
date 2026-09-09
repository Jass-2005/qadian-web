import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowDown10, ArrowUp01, TrendingUp, Award, BarChart2 } from 'lucide-react';

export default function CustomDropdown({ value, onChange, options, label = "Sort" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const getOptionIcon = (optValue) => {
    if (optValue === 'BOOTH_ASC') return <ArrowDown10 size={14} className="dropdown-opt-icon" />;
    if (optValue === 'BOOTH_DESC') return <ArrowUp01 size={14} className="dropdown-opt-icon" />;
    if (optValue === 'TURNOUT_DESC') return <TrendingUp size={14} className="dropdown-opt-icon" />;
    if (optValue === 'MARGIN_DESC') return <Award size={14} className="dropdown-opt-icon" />;
    if (optValue === 'VOTES_DESC') return <BarChart2 size={14} className="dropdown-opt-icon" />;
    if (optValue === 'VOTES_ASC') return <BarChart2 size={14} className="dropdown-opt-icon" />;
    return null;
  };

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="dropdown-trigger-icon">
          {getOptionIcon(selectedOption?.value)}
        </span>
        <span className="dropdown-trigger-text">
          {selectedOption ? selectedOption.label : label}
        </span>
        <ChevronDown 
          size={14} 
          className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="custom-dropdown-menu" role="listbox">
          <div className="dropdown-menu-header">SELECT ORDERING</div>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={isSelected}
              >
                <div className="dropdown-item-left">
                  {getOptionIcon(opt.value)}
                  <span className="dropdown-item-label">{opt.label}</span>
                </div>
                {isSelected && <Check size={14} className="dropdown-item-check" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
