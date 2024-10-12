const Location = require('../models/locationModel');

// Add Location logic
exports.addLocation = async (req, res) => {
  try {
    // Destructure properties from req.body
    const { name, latitude, longitude, description } = req.body;

    // Validate input
    if (!name || !latitude || !longitude || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new Location instance
    const location = new Location({ name, latitude, longitude, description });

    // Save to the database
    await location.save();
    res.status(201).json({ message: 'Location added successfully', location });
  } catch (error) {
    console.error('Error adding location:', error); // Log error details for debugging
    res.status(500).json({ message: 'Error adding location', error: error.message });
  }
};
