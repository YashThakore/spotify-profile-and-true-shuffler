import React, { useState, useEffect, useRef } from 'react';
import spotifyApi from '../spotify';
import './Playlists.css';

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null); // Reference for the popup content

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

  const handlePlaylistClick = async (playlistId) => {
    try {
      const response = await spotifyApi.getPlaylistTracks(playlistId);
      setSelectedPlaylistTracks(response.items);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPlaylistTracks([]);
  };

  // Close popup when clicking outside of it
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      closePopup();
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      // Add event listener for clicks outside the popup
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Clean up the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <div className="playlists-page">
      <h1>Your Playlists</h1>
      <div className="playlists-grid">
        {playlists.map(playlist => (
          <div key={playlist.id} className="playlist-card" onClick={() => handlePlaylistClick(playlist.id)}>
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

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content" ref={popupRef}>
            <h2>Tracks in Playlist</h2>
            <button className="close-button" onClick={closePopup}>Close</button>
            <div className="track-list">
              {selectedPlaylistTracks.map(track => (
                <div key={track.track.id} className="track-item">
                  {track.track.album.images?.[0]?.url && (
                    <img 
                      src={track.track.album.images[0].url} 
                      alt={track.track.name} 
                      className="track-cover"
                    />
                  )}
                  <span className="track-info">
                    <a 
                      href={track.track.external_urls.spotify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="track-link"
                    >
                      {track.track.artists.map(artist => artist.name).join(', ')} - {track.track.name}
                    </a>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Playlists; 