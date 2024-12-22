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
          setProgress(response.progress_ms);
          setIsPlaying(response.is_playing);
        } else {
          // If no current track, get the last played
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
    // Fetch track data every 10 seconds
    const fetchInterval = setInterval(fetchCurrentTrack, 10000);

    // Update progress every second if track is playing
    const progressInterval = setInterval(() => {
      if (isPlaying) {
        setProgress(prev => {
          if (currentTrack && prev < currentTrack.duration_ms) {
            return prev + 1000;
          }
          return prev;
        });
      }
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(progressInterval);
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
        <img 
          src={currentTrack.album.images[2]?.url} // Using smaller image (64x64)
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
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(progress / currentTrack.duration_ms) * 100}%` }}
              ></div>
            </div>
            <div className="time-info">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(currentTrack.duration_ms)}</span>
            </div>
          </div>
        </div>
        <div className="playback-status">
          {isPlaying ? 'Now Playing' : 'Last Played'}
        </div>
      </div>
    </div>
  );
}

export default NowPlaying; 