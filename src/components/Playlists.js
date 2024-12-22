import React, { useState, useEffect } from 'react';
import spotifyApi from '../spotify';
import './Playlists.css';

function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await spotifyApi.getUserPlaylists();
        setPlaylists(response.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="playlists-page">
      <h1>Your Playlists</h1>
      <div className="playlists-grid">
        {playlists.map(playlist => (
          <div key={playlist.id} className="playlist-card">
            {playlist.images?.[0]?.url ? (
              <img 
                src={playlist.images[0].url} 
                alt={playlist.name}
              />
            ) : (
              <div className="playlist-default-image">
                <span>{getInitials(playlist.name)}</span>
              </div>
            )}
            <div className="playlist-info">
              <h3>{playlist.name}</h3>
              <p>{playlist.tracks?.total || 0} tracks</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlists; 