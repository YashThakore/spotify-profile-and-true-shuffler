const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  spotifyId: {
    type: String,
    required: true,
    unique: true
  },
  enabledPlaylists: [{
    playlistId: String,
    playlistName: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema); 