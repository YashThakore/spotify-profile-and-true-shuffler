import React, { useEffect, useState } from 'react';
import { getAuthUrl } from './spotifyAuth';
import spotifyApi, { setAccessToken } from './spotify';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (token) {
      setAccessToken(token);
      window.location.hash = '';

      spotifyApi.getMe().then(user => setUser(user));
      spotifyApi.getMyTopArtists().then(data => setTopArtists(data.items));
      spotifyApi.getMyTopTracks().then(data => setTopTracks(data.items));
    }
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">Spotify</div>
        <nav>
          <ul>
            <li className="active">Profile</li>
            <li>Top Artists</li>
            <li>Top Tracks</li>
            <li>Recent</li>
            <li>Playlists</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {!user ? (
          <a href={getAuthUrl()} className="login-btn">Login with Spotify</a>
        ) : (
          <>
            <section className="profile">
              <img src={user.images?.[0]?.url} alt="Profile" />
              <h1>{user.display_name}</h1>
              <div className="stats">
                <p><span>{user.followers?.total}</span> Followers</p>
                <p><span>3</span> Following</p>
                <p><span>65</span> Playlists</p>
              </div>
              <button className="logout-btn">Logout</button>
            </section>

            <section className="content-grid">
              <div className="grid-item">
                <h2>Top Artists of All Time</h2>
                <button className="see-more-btn">See More</button>
              </div>
              <div className="grid-item">
                <h2>Top Tracks of All Time</h2>
                <button className="see-more-btn">See More</button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
