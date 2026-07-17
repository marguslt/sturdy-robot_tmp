import React from 'react';
import ProgressionChart from './ProgressionChart';

export default function PlayerModal({ driver, tracks, onClose }) {
  if (!driver) return null;

  // Calculate statistics
  const scoreValues = Object.values(driver.points).filter(val => val !== null && !isNaN(val));
  const maxScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
  const avgScore = scoreValues.length > 0 ? (driver.total / scoreValues.length) : 0;

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isTop3 = typeof driver.rank === 'number' && driver.rank <= 3;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} aria-label="Sulge aken">
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-title-row">
            <h2>{driver.name}</h2>
            <div className={`modal-rank-badge ${isTop3 ? 'top-3' : ''}`}>
              {driver.rank}. KOHT
            </div>
          </div>
        </div>

        <div className="modal-body">
          {/* Key Stats Grid */}
          <div className="modal-stats-grid">
            <div className="modal-stat-box">
              <div className="modal-stat-title">Kokku punktid</div>
              <div className="modal-stat-value highlight">
                {driver.total.toFixed(1).replace('.0', '')}
              </div>
            </div>
            <div className="modal-stat-box">
              <div className="modal-stat-title">Toimunud etappe</div>
              <div className="modal-stat-value">
                {driver.roundsPlayed} / {tracks.length}
              </div>
            </div>
            <div className="modal-stat-box">
              <div className="modal-stat-title">Keskmine / Parim etapp</div>
              <div className="modal-stat-value" style={{ fontSize: '1.1rem' }}>
                {avgScore.toFixed(1).replace('.0', '')} / {maxScore.toFixed(1).replace('.0', '')}
              </div>
            </div>
          </div>

          {/* SVG Progression Line Chart */}
          <div>
            <h3 className="chart-container-title">
              📈 Punktide kumulatiivne progresseerumine
            </h3>
            <ProgressionChart points={driver.points} tracks={tracks} />
          </div>

          {/* Detailed Points Breakdown Grid */}
          <div>
            <h3 className="modal-breakdown-title">🏁 Etappide detailne punktiseis</h3>
            <div className="breakdown-grid">
              {tracks.map(track => {
                const pts = driver.points[track];
                const hasPoints = pts !== null && !isNaN(pts);
                return (
                  <div key={track} className="breakdown-card">
                    <span className="breakdown-track">{track}</span>
                    <span className={`breakdown-points ${hasPoints ? 'has-points' : ''}`}>
                      {hasPoints ? `${pts.toFixed(1).replace('.0', '')} p` : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
