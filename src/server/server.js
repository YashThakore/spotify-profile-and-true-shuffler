const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserPreferences = require('../models/UserPreferences');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/spotify-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());

// Get user preferences
app.get('/api/preferences/:spotifyId', async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ 
      spotifyId: req.params.spotifyId 
    });
    res.json(preferences || { enabledPlaylists: [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user preferences
app.post('/api/preferences/:spotifyId', async (req, res) => {
  try {
    const preferences = await UserPreferences.findOneAndUpdate(
      { spotifyId: req.params.spotifyId },
      { 
        spotifyId: req.params.spotifyId,
        enabledPlaylists: req.body.enabledPlaylists,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 