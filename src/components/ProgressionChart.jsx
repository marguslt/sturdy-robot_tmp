import React from 'react';

export default function ProgressionChart({ points, tracks }) {
  // Calculate cumulative scores round by round
  let cumulative = 0;
  const data = [];
  
  // Starting point (0 points before first race)
  data.push({
    track: 'Start',
    value: 0
  });

  tracks.forEach(track => {
    const pts = points[track];
    // If the driver participated (value is not null), add to cumulative.
    // If they skipped, their cumulative score remains the same.
    if (pts !== null && !isNaN(pts)) {
      cumulative += pts;
    }
    data.push({
      track,
      value: cumulative
    });
  });

  // SVG Chart sizing
  const width = 600;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value for Y scaling (ensure it's at least 10 to avoid division by zero)
  const maxValue = Math.max(...data.map(d => d.value), 10);
  
  // Calculate point coordinates
  const pointsCoords = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.value / maxValue) * chartHeight;
    return {
      x,
      y,
      value: d.value,
      track: d.track
    };
  });

  // Generate SVG Path data (d attribute)
  let pathD = '';
  if (pointsCoords.length > 0) {
    pathD = `M ${pointsCoords[0].x} ${pointsCoords[0].y} ` + 
      pointsCoords.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }

  // Generate SVG Path data for the gradient fill below the line
  const fillD = pathD ? 
    `${pathD} L ${pointsCoords[pointsCoords.length - 1].x} ${paddingTop + chartHeight} L ${pointsCoords[0].x} ${paddingTop + chartHeight} Z` : 
    '';

  // Grid lines
  const gridLines = [];
  const gridTicks = 4;
  for (let i = 0; i <= gridTicks; i++) {
    const ratio = i / gridTicks;
    const y = paddingTop + chartHeight - ratio * chartHeight;
    const value = Math.round(ratio * maxValue);
    gridLines.push({ y, value });
  }

  return (
    <div className="chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Y Axis Grid Lines & Labels */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line 
              x1={paddingLeft} 
              y1={line.y} 
              x2={width - paddingRight} 
              y2={line.y} 
              className="chart-grid-line"
            />
            <text 
              x={paddingLeft - 8} 
              y={line.y + 4} 
              textAnchor="end" 
              className="chart-axis-text"
            >
              {line.value}
            </text>
          </g>
        ))}

        {/* Fill Area under the line */}
        {fillD && <path d={fillD} className="chart-line-bg" />}

        {/* The Progression Line */}
        {pathD && <path d={pathD} className="chart-line" />}

        {/* Dots, hover targets and labels */}
        {pointsCoords.map((point, index) => {
          // Don't show labels on top of every single point if there are too many,
          // but show for key points or when value changes.
          const showLabel = index === 0 || index === pointsCoords.length - 1 || 
            (index > 0 && point.value !== pointsCoords[index - 1].value);

          return (
            <g key={index}>
              {/* Point Dot */}
              <circle 
                cx={point.x} 
                cy={point.y} 
                r="4.5" 
                className="chart-dot"
              />

              {/* Point Value Text */}
              {showLabel && (
                <text 
                  x={point.x} 
                  y={point.y - 10} 
                  className="chart-label-value"
                >
                  {point.value.toFixed(1).replace('.0', '')}
                </text>
              )}

              {/* X Axis Labels (Rounds) */}
              {index > 0 && (
                <text 
                  x={point.x} 
                  y={paddingTop + chartHeight + 18} 
                  textAnchor="middle" 
                  className="chart-axis-text"
                  transform={`rotate(-15, ${point.x}, ${paddingTop + chartHeight + 18})`}
                >
                  {point.track.length > 8 ? `${point.track.slice(0, 7)}.` : point.track}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
