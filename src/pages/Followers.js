import React, { useEffect, useState } from 'react';
import spotifyApi from '../spotify';

function Followers() {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    spotifyApi.getFollowedArtists().then(data => setFollowers(data.artists.items));
  }, []);

  return (
    <div className="section">
      <h2>Followers</h2>
      <ul>
        {followers.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Followers;
