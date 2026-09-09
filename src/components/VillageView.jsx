import React, { useMemo, useState } from 'react';
import { Building2, Users, Award, ChevronRight } from 'lucide-react';

export default function VillageView({ booths, onSelectBooth }) {
  const [search, setSearch] = useState('');

  // Group booths by resolved village name
  const villageGroups = useMemo(() => {
    const groups = {};
    booths.forEach((b) => {
      // Normalize name for grouping
      let name = b.village_english;
      // Strip Ward No if any for broad clustering, or group by exact village
      if (name.includes('Ward No') || name.includes('Civil Line')) {
        name = 'Qadian (Town Wards)';
      } else if (name.startsWith('Dhariwal')) {
        name = 'Dhariwal (Town & Suburbs)';
      } else if (name.startsWith('Kahnuwan')) {
        name = 'Kahnuwan';
      }

      if (!groups[name]) {
        groups[name] = {
          name: name,
          punjabi: b.village_punjabi,
          booths: [],
          inc_22: 0,
          aap_22: 0,
          sad_22: 0,
          tot_22: 0,
          inc_24: 0,
          aap_24: 0,
          bjp_24: 0,
          sad_24: 0,
          tot_24: 0
        };
      }

      const g = groups[name];
      g.booths.push(b);
      g.inc_22 += b.data_2022.inc;
      g.aap_22 += b.data_2022.aap;
      g.sad_22 += b.data_2022.sad;
      g.tot_22 += b.data_2022.total;

      g.inc_24 += b.data_2024.inc;
      g.aap_24 += b.data_2024.aap;
      g.bjp_24 += b.data_2024.bjp;
      g.sad_24 += b.data_2024.sad;
      g.tot_24 += b.data_2024.total;
    });

    return Object.values(groups)
      .map((g) => {
        // Calculate cumulative winners
        const scores_22 = [('INC', g.inc_22), ('AAP', g.aap_22), ('SAD', g.sad_22)];
        const scores_24 = [('INC', g.inc_24), ('AAP', g.aap_24), ('BJP', g.bjp_24), ('SAD', g.sad_24)];
        
        let w22 = 'INC';
        let m22 = g.inc_22;
        if (g.aap_22 > m22) { w22 = 'AAP'; m22 = g.aap_22; }
        if (g.sad_22 > m22) { w22 = 'SAD'; m22 = g.sad_22; }

        let w24 = 'INC';
        let m24 = g.inc_24;
        if (g.aap_24 > m24) { w24 = 'AAP'; m24 = g.aap_24; }
        if (g.bjp_24 > m24) { w24 = 'BJP'; m24 = g.bjp_24; }
        if (g.sad_24 > m24) { w24 = 'SAD'; m24 = g.sad_24; }

        return {
          ...g,
          winner_22: w22,
          winner_24: w24,
          booth_count: g.booths.length
        };
      })
      .sort((a, b) => b.tot_24 - a.tot_24);
  }, [booths]);

  // Filter groups
  const filtered = villageGroups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.punjabi.includes(search)
  );

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Village & Town Level Aggregates</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Aggregated results combining multi-booth towns and rural village clusters ({villageGroups.length} distinct areas)
          </p>
        </div>
        <input
          type="text"
          className="search-input"
          style={{ maxWidth: '300px' }}
          placeholder="Filter town/village name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="aggregator-grid">
        {filtered.map((g) => (
          <div key={g.name} className="village-card">
            <div className="village-card-top">
              <div>
                <div className="village-title">{g.name}</div>
                <div className="village-punjabi punjabi-text">{g.punjabi}</div>
              </div>
              <span className="village-booths-count">
                {g.booth_count} {g.booth_count === 1 ? 'Booth' : 'Booths'}
              </span>
            </div>

            {/* Side by side Winner badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '12px 0', fontSize: '0.8125rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>2022 RESULT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span className={`badge-winner ${g.winner_22}`}>{g.winner_22}</span>
                  <span style={{ fontWeight: 700 }}>{g.tot_22.toLocaleString()} votes</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>2024 RESULT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span className={`badge-winner ${g.winner_24}`}>{g.winner_24}</span>
                  <span style={{ fontWeight: 700 }}>{g.tot_24.toLocaleString()} votes</span>
                </div>
              </div>
            </div>

            {/* 2024 Vote Distribution */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <strong>2024 Breakdown:</strong> INC: {g.inc_24} | AAP: {g.aap_24} | BJP: {g.bjp_24} | SAD: {g.sad_24}
            </div>

            {/* Booths Included Tags */}
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {g.booths.map((b) => (
                <button
                  key={b.booth_no}
                  onClick={() => onSelectBooth(b)}
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}
                  title={`Click to inspect Booth #${b.booth_no}`}
                >
                  #{b.booth_no}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
