const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-follow-read'
];

export const getAuthUrl = () => {
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = "https://spotifyprofileandshuffle.vercel.app/callback";
  
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
};
  