import React, { useState, useEffect } from 'react';
import spotifyApi from '../spotify';
import './TopItems.css';

function TopItems({ type }) {
  const [items, setItems] = useState([]);
  const [timeRange, setTimeRange] = useState('long_term');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await (type === 'artists' 
          ? spotifyApi.getMyTopArtists({ limit: 50, time_range: timeRange })
          : spotifyApi.getMyTopTracks({ limit: 50, time_range: timeRange }));
        setItems(response.items);
      } catch (error) {
        console.error('Error fetching top items:', error);
      }
    };

    fetchItems();
  }, [type, timeRange]);

  return (
    <div className="top-items-page">
      <h1>Top {type === 'artists' ? 'Artists' : 'Tracks'}</h1>
      
      <div className="time-range-filters">
        <button 
          className={timeRange === 'short_term' ? 'active' : ''} 
          onClick={() => setTimeRange('short_term')}
        >
          Last 4 Weeks
        </button>
        <button 
          className={timeRange === 'medium_term' ? 'active' : ''} 
          onClick={() => setTimeRange('medium_term')}
        >
          Last 6 Months
        </button>
        <button 
          className={timeRange === 'long_term' ? 'active' : ''} 
          onClick={() => setTimeRange('long_term')}
        >
          All Time
        </button>
      </div>

      <div className="items-list">
        {items.map((item, index) => (
          <div key={item.id} className="item-card">
            <span className="rank">{index + 1}</span>
            <img 
              src={type === 'artists' ? item.images[1]?.url : item.album.images[1]?.url} 
              alt={item.name}
            />
            <div className="item-info">
              <a 
                href={item.external_urls.spotify} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <h3>{item.name}</h3>
              </a>
              {type === 'tracks' && <p>{item.artists[0].name}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopItems; 