import React, { useState, useEffect } from 'react';
import spotifyApi from '../spotify';
import './TrueShuffle.css';

function TrueShuffle() {
  const [playlists, setPlaylists] = useState([]);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

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

  const toggleFAQ = () => {
    setIsFAQOpen(!isFAQOpen);
  };

  return (
    <div className="true-shuffle-page">
      <div className="header">
        <h1>True Shuffle Playlists</h1>
        <button className="faq-button" onClick={toggleFAQ}>FAQ</button>
      </div>
      <div className="playlist-list">
        {playlists.map(playlist => (
          <div key={playlist.id} className="playlist-item">
            <label className="playlist-checkbox">
              <input type="checkbox" />
              <div className="checkbox-custom"></div>
              <div className="playlist-info">
                {playlist.images?.[0]?.url ? (
                  <img 
                    src={playlist.images[0].url} 
                    alt={playlist.name}
                  />
                ) : (
                  <div className="true-shuffle-playlist-default-image">
                    <span>{getInitials(playlist.name)}</span>
                  </div>
                )}
                <div className="playlist-details">
                  <h3>{playlist.name}</h3>
                  <p>{playlist.tracks.total} tracks</p>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {isFAQOpen && (
        <div className="faq-modal">
          <div className="faq-content">
            <h2>How True Shuffle Works</h2>
            <p>
              True Shuffle allows you to select specific playlists for a unique listening experience. Once you choose the playlists you want to include, True Shuffle will automatically create a new random shuffle of songs each time you play that playlist.
            </p>
            <p>
              Please note that while using True Shuffle, you will not be able to click on individual songs within the playlist. Instead, you can add songs to your queue. Clicking on a song from the playlist will restart the shuffle, so be sure to add songs to your queue for uninterrupted listening.
            </p>
            <button className="close-faq" onClick={toggleFAQ}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default TrueShuffle; 