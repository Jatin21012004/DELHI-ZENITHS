const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'mapData';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

client.connect().then(() => {
  console.log('Connected to MongoDB');
  const db = client.db(dbName);
  const locationsCollection = db.collection('Locations');

  // API endpoint to add a location
  app.post('/add-location', (req, res) => {
    const locationData = req.body;
    console.log('Received location data:', locationData); // Log received data

    locationsCollection.insertOne(locationData)
      .then(result => {
        console.log('Location added with id:', result.insertedId); // Log inserted ID
        res.status(200).send('Location added successfully');
      })
      .catch((err) => {
        console.error('Error adding location:', err); // Log error
        res.status(500).send('Error adding location');
      });
  });

  // API endpoint to get all locations
  app.get('/locations', (req, res) => {
    locationsCollection.find({}).toArray((err, locations) => {
      if (err) {
        console.error('Error fetching locations:', err); // Log error
        res.status(500).send('Error fetching locations');
      } else {
        res.status(200).json(locations);
      }
    });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
