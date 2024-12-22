import React, { useEffect, useState } from 'react';
import spotifyApi, { setAccessToken } from '../spotify';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');
    if (token) {
      setAccessToken(token);
      spotifyApi.getMe().then(user => setUser(user));
    }
  }, []);

  return (
    <div className="profile">
      {user && (
        <>
          <img src={user.images?.[0]?.url} alt="Profile" />
          <h1>{user.display_name}</h1>
          <div className="stats">
            <p><span>{user.followers?.total}</span> Followers</p>
            <p><span>3</span> Following</p>
            <p><span>65</span> Playlists</p>
          </div>
          <button className="logout-btn">Logout</button>
        </>
      )}
    </div>
  );
}

export default Profile;
