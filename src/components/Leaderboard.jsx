import React, { useState } from 'react';

export default function Leaderboard({ drivers, tracks, onSelectDriver }) {
  const [sortField, setSortField] = useState('rank'); // 'rank', 'name', 'total', or trackName
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [searchQuery, setSearchQuery] = useState('');

  // Handle header sorting click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // Default to ascending for rank and name, descending for points
      setSortDirection(field === 'rank' || field === 'name' ? 'asc' : 'desc');
    }
  };

  // Filter drivers by search query
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort drivers based on state
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    let valA, valB;

    if (sortField === 'rank') {
      valA = typeof a.rank === 'number' ? a.rank : 9999;
      valB = typeof b.rank === 'number' ? b.rank : 9999;
    } else if (sortField === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortField === 'total') {
      valA = a.total;
      valB = b.total;
    } else {
      // It's a track name
      valA = a.points[sortField] !== null && a.points[sortField] !== undefined ? a.points[sortField] : -1;
      valB = b.points[sortField] !== null && b.points[sortField] !== undefined ? b.points[sortField] : -1;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    
    // Tie-breaker: sort by rank ascending or total descending
    return a.rank - b.rank;
  });

  const getSortClass = (field) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc';
  };

  return (
    <div>
      {/* Filters Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <svg 
            className="search-icon" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            id="driver-search"
            type="text"
            className="search-input"
            placeholder="Otsi sõitjat nime järgi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="update-notice">
          <span className="pulse-dot"></span>
          Reaalajas andmed Google Sheetsist
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className={getSortClass('rank')} onClick={() => handleSort('rank')}>Koht</th>
                <th className={getSortClass('name')} onClick={() => handleSort('name')}>Sõitja</th>
                {tracks.map(track => (
                  <th 
                    key={track} 
                    className={`${getSortClass(track)}`} 
                    onClick={() => handleSort(track)}
                    style={{ textAlign: 'center' }}
                  >
                    {track}
                  </th>
                ))}
                <th 
                  className={getSortClass('total')} 
                  onClick={() => handleSort('total')}
                  style={{ textAlign: 'right', paddingRight: '1.5rem' }}
                >
                  Kokku
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDrivers.length > 0 ? (
                sortedDrivers.map((driver) => {
                  const rank = driver.rank;
                  let podiumClass = '';
                  if (rank === 1) podiumClass = 'podium-gold';
                  else if (rank === 2) podiumClass = 'podium-silver';
                  else if (rank === 3) podiumClass = 'podium-bronze';

                  return (
                    <tr 
                      key={driver.id} 
                      className={`driver-row ${podiumClass}`}
                      onClick={() => onSelectDriver(driver)}
                      title="Klõpsa üksikasjaliku statistika vaatamiseks"
                    >
                      <td>
                        <span className="rank-badge">
                          {rank}
                        </span>
                      </td>
                      <td className="driver-name-cell">{driver.name}</td>
                      {tracks.map(track => {
                        const pts = driver.points[track];
                        const hasPoints = pts !== null && !isNaN(pts);
                        return (
                          <td 
                            key={track} 
                            className={`stage-score-cell ${hasPoints ? 'has-points' : ''}`}
                          >
                            {hasPoints ? pts.toFixed(1).replace('.0', '') : '-'}
                          </td>
                        );
                      })}
                      <td className="total-points-cell">
                        {driver.total.toFixed(1).replace('.0', '')}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={tracks.length + 3} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Ühtegi sõitjat ei leitud.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
