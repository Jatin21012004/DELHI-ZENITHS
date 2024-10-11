const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userController = require('./Controllers/userController');
const locationController = require('./Controllers/locationController');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mapData')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/signup', userController.signup);
app.post('/login', userController.login);
app.post('/add-location', locationController.addLocation);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
