require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserPreferences = require('./models/UserPreferences');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
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
    console.error('Error fetching preferences:', error);
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
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 