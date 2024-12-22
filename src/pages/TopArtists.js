import React, { useEffect, useState } from 'react';
import spotifyApi from '../spotify';

function TopArtists() {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    spotifyApi.getMyTopArtists().then(data => setTopArtists(data.items));
  }, []);

  return (
    <div className="section">
      <h2>Top Artists</h2>
      <ul>
        {topArtists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopArtists;
