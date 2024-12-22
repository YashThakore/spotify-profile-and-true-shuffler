import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { getAuthUrl } from './spotifyAuth';
import spotifyApi, { setAccessToken } from './spotify';
import TopItems from './components/TopItems';
import './App.css';
import Recent from './components/Recent';
import Playlists from './components/Playlists';
import NowPlaying from './components/NowPlaying';

function App() {
  const [user, setUser] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const renderTopItems = (items, type) => {
    return items.slice(0, 10).map((item, index) => {
      const imageUrl = type === 'artist' 
        ? (item.images?.[2]?.url || '')
        : (item.album?.images?.[2]?.url || '');

      return (
        <div key={item.id} className="top-item">
          <span className="rank">{index + 1}</span>
          {imageUrl && <img src={imageUrl} alt={item.name} />}
          <a 
            href={item.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="name"
          >
            {item.name}
          </a>
        </div>
      );
    });
  };

  const handleLogout = () => {
    setUser(null);
    setTopArtists([]);
    setTopTracks([]);
    // Clear the access token
    setAccessToken(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <div className="app">
        <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo">Spotify Stats</div>
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <nav>
            <ul>
              <li className={window.location.pathname === '/' ? 'active' : ''}>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              </li>
              <li className={window.location.pathname === '/top-artists' ? 'active' : ''}>
                <Link to="/top-artists" onClick={() => setIsMobileMenuOpen(false)}>Top Artists</Link>
              </li>
              <li className={window.location.pathname === '/top-tracks' ? 'active' : ''}>
                <Link to="/top-tracks" onClick={() => setIsMobileMenuOpen(false)}>Top Tracks</Link>
              </li>
              <li className={window.location.pathname === '/recent' ? 'active' : ''}>
                <Link to="/recent" onClick={() => setIsMobileMenuOpen(false)}>Recent</Link>
              </li>
              <li className={window.location.pathname === '/playlists' ? 'active' : ''}>
                <Link to="/playlists" onClick={() => setIsMobileMenuOpen(false)}>Playlists</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          {!user ? (
            <a href={getAuthUrl()} className="login-btn">Login with Spotify</a>
          ) : (
            <Routes>
              <Route path="/" element={
                <>
                  <section className="profile">
                    <img src={user.images?.[0]?.url} alt="Profile" />
                    <h1>{user.display_name}</h1>
                    <div className="stats">
                      <p><span>{user.followers?.total}</span> Followers</p>
                      <p><span>3</span> Following</p>
                      <p><span>65</span> Playlists</p>
                    </div>
                    <NowPlaying />
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                  </section>

                  <section className="content-grid">
                    <div className="grid-item">
                      <h2>Top Artists Past 6 Months</h2>
                      <div className="top-items-container">
                        {renderTopItems(topArtists, 'artist')}
                      </div>
                      <Link to="/top-artists" className="see-more-btn">See More</Link>
                    </div>
                    <div className="grid-item">
                      <h2>Top Tracks Past 6 Months</h2>
                      <div className="top-items-container">
                        {renderTopItems(topTracks, 'track')}
                      </div>
                      <Link to="/top-tracks" className="see-more-btn">See More</Link>
                    </div>
                  </section>
                </>
              } />
              <Route path="/top-artists" element={<TopItems type="artists" />} />
              <Route path="/top-tracks" element={<TopItems type="tracks" />} />
              <Route path="/recent" element={<Recent />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
