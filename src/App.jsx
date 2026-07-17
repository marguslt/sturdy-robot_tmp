import React, { useState, useEffect } from 'react';
import { parseSheetData } from './utils/csvParser';
import Leaderboard from './components/Leaderboard';
import PlayerModal from './components/PlayerModal';
import TrackComments from './components/TrackComments';

const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1reNQtxebHoXk72XMn7yTCgVLqbI2_-zDQpmm9Y3G9XM/export?format=csv';

export default function App() {
  const [data, setData] = useState({ drivers: [], tracks: [], comments: [] });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSheetData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch sheet CSV bypass cache using timestamp parameter
      const response = await fetch(`${GOOGLE_SHEETS_CSV_URL}&_=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Andmete laadimine ebaõnnestus (HTTP staatuskood: ${response.status})`);
      }
      const csvText = await response.text();
      const parsedData = parseSheetData(csvText);
      setData(parsedData);
    } catch (err) {
      console.error('Error fetching sheet data:', err);
      setError(err.message || 'Tundmatu viga Google Sheetsi andmete hankimisel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  // Calculate quick stats
  const totalDrivers = data.drivers.length;
  
  // Count how many stages have actually occurred (at least one player has points in that stage)
  const completedStagesCount = data.tracks.filter(track => 
    data.drivers.some(driver => driver.points[track] !== null && driver.points[track] !== undefined)
  ).length;

  const leader = data.drivers.find(d => d.rank === 1) || data.drivers[0];

  return (
    <div className="container">
      {/* Header section with brand and quick stats */}
      <header className="header-wrapper">
        <div className="brand-section">
          <div className="logo-icon">🏁</div>
          <div className="title-container">
            <h1>mmv-HKS 2026</h1>
            <p className="subtitle">Harrastajate kardihooaaja ametlik punktiseis ja edetabel</p>
          </div>
        </div>

        {/* Stats Grid */}
        {!loading && !error && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Sõitjaid registreeritud</span>
              <span className="stat-value">{totalDrivers}</span>
            </div>
            <div className="stat-card yellow">
              <span className="stat-label">Toimunud etappe</span>
              <span className="stat-value">{completedStagesCount} / {data.tracks.length}</span>
            </div>
            <div className="stat-card green">
              <span className="stat-label">Sarja liider</span>
              <span className="stat-value">{leader ? leader.name : '-'}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main dashboard content */}
      <main>
        {loading ? (
          <div className="loader-container">
            <div className="loader-spinner"></div>
            <p>Laadin kardihooaaja edetabelit...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-title">Viga andmete laadimisel</div>
            <p className="error-message">{error}</p>
            <button className="btn-retry" onClick={fetchSheetData}>
              Proovi uuesti
            </button>
          </div>
        ) : (
          <>
            <Leaderboard 
              drivers={data.drivers} 
              tracks={data.tracks} 
              onSelectDriver={setSelectedDriver} 
            />
            
            <TrackComments comments={data.comments} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Andmed pärinevad reaalajas{' '}
          <a href="https://docs.google.com/spreadsheets/d/1reNQtxebHoXk72XMn7yTCgVLqbI2_-zDQpmm9Y3G9XM/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
            Google Sheetsi tabelist
          </a>.
        </p>
        <p style={{ marginTop: '0.25rem', opacity: 0.6 }}>
          © {new Date().getFullYear()} mmv-HKS. Kõik õigused kaitstud.
        </p>
      </footer>

      {/* Modal for detailed player view */}
      {selectedDriver && (
        <PlayerModal 
          driver={selectedDriver} 
          tracks={data.tracks} 
          onClose={() => setSelectedDriver(null)} 
        />
      )}
    </div>
  );
}
