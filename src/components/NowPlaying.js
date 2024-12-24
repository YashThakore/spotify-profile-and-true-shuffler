import React, { useState, useEffect } from 'react';
import spotifyApi from '../spotify';
import './NowPlaying.css';

function NowPlaying() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const response = await spotifyApi.getMyCurrentPlayingTrack();
        if (response && response.item) {
          setCurrentTrack(response.item);
          setProgress(response.progress_ms || 0);
          setIsPlaying(response.is_playing);
        } else {
          const recentTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
          if (recentTracks.items.length > 0) {
            setCurrentTrack(recentTracks.items[0].track);
            setProgress(0);
            setIsPlaying(false);
          }
        }
      } catch (error) {
        console.error('Error fetching current track:', error);
      }
    };

    fetchCurrentTrack();

    // Update current track data every 3 seconds
    const fetchInterval = setInterval(fetchCurrentTrack, 3000);

    return () => clearInterval(fetchInterval);
  }, []);

  // Separate useEffect for progress updates
  useEffect(() => {
    let progressInterval;

    if (isPlaying) {
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          if (currentTrack && prevProgress < currentTrack.duration_ms) {
            return prevProgress + 1000;
          } else {
            clearInterval(progressInterval);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="now-playing">
      <div className="now-playing-content">
        <div className="track-header">
          <img 
            src={currentTrack.album.images[1]?.url} 
            alt={currentTrack.name} 
            className="album-art"
          />
          <div className="track-info">
            <div className="track-details">
              <a 
                href={currentTrack.external_urls.spotify} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <h3>{currentTrack.name}</h3>
              </a>
              <p>{currentTrack.artists[0].name}</p>
            </div>
          </div>
          <div className="playback-status">
            {isPlaying ? 'Now Playing' : 'Last Played'}
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min((progress / currentTrack.duration_ms) * 100, 100)}%`
              }}
            ></div>
          </div>
          <div className="time-info">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(currentTrack.duration_ms)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NowPlaying; 