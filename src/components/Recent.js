import React, { useState, useEffect } from 'react';
import spotifyApi from '../spotify';
import './Recent.css';

function Recent() {
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        setLoading(true);
        const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
        console.log('Recent tracks response:', response);
        setRecentTracks(response.items);
        setError(null);
      } catch (error) {
        console.error('Error fetching recent tracks:', error);
        setError('Failed to load recently played tracks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTracks();
  }, []);

  if (loading) {
    return (
      <div className="recent-page">
        <h1>Recently Played</h1>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-page">
        <h1>Recently Played</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="recent-page">
      <h1>Recently Played</h1>
      {recentTracks.length === 0 ? (
        <p className="no-tracks">No recently played tracks found</p>
      ) : (
        <div className="recent-tracks">
          {recentTracks.map((item, index) => (
            <div key={`${item.track.id}-${item.played_at}`} className="track-item">
              <img 
                src={item.track.album?.images?.[1]?.url || ''} 
                alt={item.track.name}
              />
              <div className="track-info">
                <a 
                  href={item.track.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <h3>{item.track.name}</h3>
                </a>
                <p>{item.track.artists[0].name}</p>
                <span className="played-at">
                  {new Date(item.played_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recent; 