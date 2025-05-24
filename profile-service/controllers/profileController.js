const Profile = require('../models/Profile');

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { bio, avatar, socialLinks } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { 
        bio, 
        avatar, 
        socialLinks,
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
