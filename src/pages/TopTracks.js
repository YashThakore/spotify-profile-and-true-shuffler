import React, { useEffect, useState } from 'react';
import spotifyApi from '../spotify';

function TopTracks() {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    spotifyApi.getMyTopTracks().then(data => setTopTracks(data.items));
  }, []);

  return (
    <div className="section">
      <h2>Top Tracks</h2>
      <ul>
        {topTracks.map(track => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopTracks;
