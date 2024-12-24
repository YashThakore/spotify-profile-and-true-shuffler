import React, { useState, useEffect } from 'react';
import spotifyApi from '../spotify';
import './Recent.css';

function Recent() {
  const [recentTracks, setRecentTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch current playing track
      const currentResponse = await spotifyApi.getMyCurrentPlayingTrack();
      
      // Fetch recent tracks with after parameter
      const recentResponse = await spotifyApi.getMyRecentlyPlayedTracks({ 
        limit: 50,
        after: Date.now() - 24 * 60 * 60 * 1000 // Get tracks from last 24 hours
      });

      // Update current track if playing
      if (currentResponse && currentResponse.item) {
        setCurrentTrack({
          track: currentResponse.item,
          is_playing: currentResponse.is_playing,
          played_at: new Date().toISOString()
        });

        // Filter out current track from recent tracks
        const filteredTracks = recentResponse.items.filter(
          item => item.track.id !== currentResponse.item.id
        );
        setRecentTracks(filteredTracks);
      } else {
        setCurrentTrack(null);
        setRecentTracks(recentResponse.items);
      }

      setError(null);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setError('Failed to load tracks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 seconds for more frequent updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const played = new Date(timestamp);
    const diffInSeconds = Math.floor((now - played) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return played.toLocaleString();
    }
  };

  const renderTrackItem = (item, isCurrentlyPlaying = false) => {
    const trackData = isCurrentlyPlaying ? item.track : item.track;
    const timestamp = isCurrentlyPlaying ? 'Now Playing' : formatTimestamp(item.played_at);

    return (
      <div 
        key={`${trackData.id}-${item.played_at}`} 
        className={`track-item ${isCurrentlyPlaying ? 'now-playing' : ''}`}
      >
        <img 
          src={trackData.album?.images?.[2]?.url || ''} 
          alt={trackData.name}
        />
        <div className="track-info">
          <div className="track-details">
            <a 
              href={trackData.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <h3>{trackData.artists[0].name} - {trackData.name}</h3>
            </a>
          </div>
          <span className="played-at">{timestamp}</span>
        </div>
      </div>
    );
  };

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
      <div className="recent-tracks">
        {currentTrack && renderTrackItem(currentTrack, true)}
        {recentTracks.map((item) => renderTrackItem(item))}
      </div>
    </div>
  );
}

export default Recent; 