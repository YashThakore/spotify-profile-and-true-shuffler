import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { getAuthUrl } from './spotifyAuth';
import spotifyApi, { setAccessToken } from './spotify';
import TopItems from './components/TopItems';
import './App.css';
import Recent from './components/Recent';
import Playlists from './components/Playlists';
import NowPlaying from './components/NowPlaying';
import TrueShuffle from './components/TrueShuffle';
import Modal from './components/Modal';

// Create a separate Sidebar component for cleaner code
function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">Spotify Stats</div>
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <nav>
        <ul>
          <li className={currentPath === '/' ? 'active' : ''}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
          </li>
          <li className={currentPath === '/top-artists' ? 'active' : ''}>
            <Link to="/top-artists" onClick={() => setIsMobileMenuOpen(false)}>Top Artists</Link>
          </li>
          <li className={currentPath === '/top-tracks' ? 'active' : ''}>
            <Link to="/top-tracks" onClick={() => setIsMobileMenuOpen(false)}>Top Tracks</Link>
          </li>
          <li className={currentPath === '/recent' ? 'active' : ''}>
            <Link to="/recent" onClick={() => setIsMobileMenuOpen(false)}>Recent</Link>
          </li>
          <li className={currentPath === '/playlists' ? 'active' : ''}>
            <Link to="/playlists" onClick={() => setIsMobileMenuOpen(false)}>Playlists</Link>
          </li>
          <li className={`shuffle-nav-item ${currentPath === '/true-shuffle' ? 'active' : ''}`}>
            <Link to="/true-shuffle" onClick={() => setIsMobileMenuOpen(false)}>True Shuffle</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [artistsFollowing, setArtistsFollowing] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (token) {
      setAccessToken(token);
      window.location.hash = '';

      const fetchData = async () => {
        try {
          const userData = await spotifyApi.getMe();
          console.log('Spotify User ID:', userData.id);
          setUser(userData);

          const topArtistsData = await spotifyApi.getMyTopArtists();
          setTopArtists(topArtistsData.items);

          const topTracksData = await spotifyApi.getMyTopTracks();
          setTopTracks(topTracksData.items);

          const playlistsData = await spotifyApi.getUserPlaylists();
          setPlaylists(playlistsData.items);

          const followingData = await spotifyApi.getFollowedArtists();
          setFollowingCount(followingData.artists.total);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
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
    setPlaylists([]);
    setAccessToken(null);
  };

  const fetchFollowingArtists = async () => {
    try {
      const response = await spotifyApi.getFollowedArtists({ limit: 50 });
      setArtistsFollowing(response.artists.items);
    } catch (error) {
      console.error('Error fetching followed artists:', error);
    }
  };

  const handleStatsClick = async (type) => {
    setModalType(type);
    setShowStatsModal(true);
    if (type === 'following') {
      await fetchFollowingArtists();
    }
  };

  return (
    <Router>
      <div className="app">
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

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
                      <p onClick={() => handleStatsClick('followers')} style={{ cursor: 'pointer' }}>
                        <span>{user.followers?.total}</span> Followers
                      </p>
                      <p onClick={() => handleStatsClick('following')} style={{ cursor: 'pointer' }}>
                        <span>{followingCount}</span> Following
                      </p>
                      <p><span>{playlists.length || '0'}</span> Playlists</p>
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
              <Route path="/true-shuffle" element={<TrueShuffle />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </main>
      </div>

      <Modal 
        isOpen={showStatsModal} 
        onClose={() => setShowStatsModal(false)}
        title={modalType === 'followers' ? 'About Followers' : 'Artists You Follow'}
      >
        {modalType === 'followers' ? (
          <div className="stats-info">
            <p className="stats-number">{user.followers?.total}</p>
            <p className="stats-description">
              This is the number of people following your Spotify profile. 
              Due to Spotify's privacy settings, we can't show detailed follower information.
            </p>
            <div className="stats-tip">
              <h4>Want more followers?</h4>
              <ul>
                <li>Create and share great playlists</li>
                <li>Follow other users and artists</li>
                <li>Share your Spotify profile on social media</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="followed-artists">
            {artistsFollowing.length > 0 ? (
              artistsFollowing.map(artist => (
                <div key={artist.id} className="artist-item">
                  <img 
                    src={artist.images?.[0]?.url || '/default-artist.png'} 
                    alt={artist.name}
                  />
                  <div className="artist-info">
                    <a 
                      href={artist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h3>{artist.name}</h3>
                    </a>
                    <p>{artist.followers?.total.toLocaleString()} followers</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">You're not following any artists yet.</p>
            )}
          </div>
        )}
      </Modal>
    </Router>
  );
}

export default App;
