/**
 * Simple and robust CSV parser that handles double quotes and commas within quotes.
 */
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  const rows = [];
  
  for (let line of lines) {
    if (!line.trim()) continue;
    
    const row = [];
    let inQuotes = false;
    let currentField = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    row.push(currentField.trim());
    
    // Clean up surrounding quotes from parsed fields
    const cleanedRow = row.map(field => {
      if (field.startsWith('"') && field.endsWith('"')) {
        return field.slice(1, -1).replace(/""/g, '"').trim();
      }
      return field;
    });
    
    rows.push(cleanedRow);
  }
  
  return rows;
}

/**
 * Parses the raw Google Sheet CSV rows into structured leaderboard and comment data.
 */
export function parseSheetData(csvText) {
  const rows = parseCSV(csvText);
  
  let headerIndex = -1;
  let commentsHeaderIndex = -1;
  
  // Find where the leaderboard table starts and where comments start
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Check for the leaderboard header
    if (row.includes('Koht') && row.includes('Nimi')) {
      headerIndex = i;
    }
    
    // Check for comments section
    if (row.some(cell => cell.includes('Etapi kommentaarid'))) {
      commentsHeaderIndex = i;
    }
  }
  
  if (headerIndex === -1) {
    throw new Error('Leaderboard header not found in CSV.');
  }
  
  const headerRow = rows[headerIndex];
  
  // Dynamically identify column indices
  const rankIdx = headerRow.indexOf('Koht');
  const nameIdx = headerRow.indexOf('Nimi');
  const totalIdx = headerRow.indexOf('9 parima etapi summa');
  
  // Tracks are columns between 'Nimi' and '9 parima etapi summa'
  const trackColumns = [];
  for (let idx = nameIdx + 1; idx < totalIdx; idx++) {
    if (headerRow[idx]) {
      trackColumns.push({
        index: idx,
        name: headerRow[idx]
      });
    }
  }
  
  // 1. Extract drivers data
  const drivers = [];
  const driverEndIndex = commentsHeaderIndex !== -1 ? commentsHeaderIndex : rows.length;
  
  for (let i = headerIndex + 1; i < driverEndIndex; i++) {
    const row = rows[i];
    if (!row || row.length <= nameIdx || !row[nameIdx]) continue;
    
    // Check if it's a spacer row or if it's unrelated
    if (row[nameIdx].includes('Etapi kommentaarid') || row[nameIdx] === '') continue;
    
    const name = row[nameIdx];
    const rawRank = row[rankIdx];
    
    // Convert rank to number (handle #N/A or empty as high number)
    let rank = parseInt(rawRank, 10);
    if (isNaN(rank)) {
      rank = 999; // Placed at the end
    }
    
    // Parse total points
    const rawTotal = row[totalIdx];
    const totalPoints = parseFloat(rawTotal) || 0;
    
    // Parse points per track
    const trackPoints = {};
    let roundsPlayed = 0;
    
    trackColumns.forEach(track => {
      const rawPoints = row[track.index];
      if (rawPoints !== undefined && rawPoints !== '') {
        const pts = parseFloat(rawPoints);
        if (!isNaN(pts)) {
          trackPoints[track.name] = pts;
          roundsPlayed++;
        } else {
          trackPoints[track.name] = null;
        }
      } else {
        trackPoints[track.name] = null;
      }
    });
    
    drivers.push({
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      rank: rawRank === '#N/A' || !rawRank ? '-' : rank,
      total: totalPoints,
      points: trackPoints,
      roundsPlayed
    });
  }
  
  // Sort drivers by total score descending (or rank ascending if tied/available)
  drivers.sort((a, b) => {
    // Ranks of 999 or "-" go to the bottom
    const rankA = typeof a.rank === 'number' ? a.rank : 999;
    const rankB = typeof b.rank === 'number' ? b.rank : 999;
    
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return b.total - a.total; // Tie-breaker: total points descending
  });
  
  // Assign rank numbers if rank is missing or clean them up
  drivers.forEach((driver, idx) => {
    if (driver.rank === 999 || driver.rank === '-') {
      driver.rank = drivers.length; // Fallback rank
    }
  });
  
  // 2. Extract track comments
  const comments = [];
  if (commentsHeaderIndex !== -1) {
    for (let i = commentsHeaderIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 4) continue;
      
      // The comment rows look like: ,,,Õismäe,Comment text
      // Let's search for columns that match our track names
      const trackName = row[3];
      const commentText = row[4];
      
      if (trackName && commentText && commentText.trim() !== '') {
        comments.push({
          track: trackName.trim(),
          text: commentText.trim()
        });
      }
    }
  }
  
  return {
    drivers,
    tracks: trackColumns.map(t => t.name),
    comments
  };
}
