// Define the locationMarker icon globally
var locationMarker = L.icon({
  iconUrl: 'locationMarker.png', // Replace with the path to your custom icon image
  iconSize: [32, 32], // Adjust size as needed
  iconAnchor: [16, 32], // Anchor point for the icon (half of width, full height)
  popupAnchor: [0, -32] // Popup anchor relative to the icon
});

window.onload = function() {
  // Check if the map is already initialized
  if (window.map) {
    return;
  }

  // Initialize the map
  window.map = L.map('map').setView([28.6139, 77.209], 12); // Set initial view to Delhi

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Create a marker cluster group
  var markers = L.markerClusterGroup();

  // Function to add a marker to the map
  function addMarker(location) {
    var marker = L.marker([location.lat, location.lon], { icon: locationMarker })
      .bindPopup(`<b>${location.name}</b><br>Famous Chai Tapri<br><a href="https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}" target="_blank">View on Google Maps</a>`);
    markers.addLayer(marker);
  }

  // Fetch and display predefined locations
  fetch('/locations')
    .then(response => response.json())
    .then(data => {
      data.forEach(location => addMarker(location));
      map.addLayer(markers);
    })
    .catch(error => console.error('Error fetching locations:', error));

  // Add zoom controls
  document.getElementById('zoomIn').addEventListener('click', function() {
    map.zoomIn();
  });

  document.getElementById('zoomOut').addEventListener('click', function() {
    map.zoomOut();
  });

  // Geolocation: Locate user on the map
  document.getElementById('locateMe').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          map.setView([lat, lon], 13);
          L.marker([lat, lon], { icon: locationMarker }).addTo(map)
            .bindPopup("You've arrived at this spot, ready to uncover its hidden gems!")
            .openPopup();
        },
        function(error) {
          console.error('Error occurred while fetching location:', error);
          alert('Error occurred while fetching location.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });

  // Search for a location using Nominatim (OpenStreetMap's geocoding service)
  document.getElementById('searchButton').addEventListener('click', function() {
    var query = document.getElementById('locationSearch').value;
    if (query) {
      var url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            map.setView([lat, lon], 13);
            L.marker([lat, lon], { icon: locationMarker }).addTo(map)
              .bindPopup(`Location: ${query}`)
              .openPopup();
          } else {
            alert("Location not found.");
          }
        })
        .catch(error => alert("Error fetching location data."));
    } else {
      alert("Please enter a location.");
    }
  });

  // Handle form submission
  document.getElementById('suggestLocationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var nameElement = document.getElementById('name');
    var latitudeElement = document.getElementById('latitude');
    var longitudeElement = document.getElementById('longitude');
    var descriptionElement = document.getElementById('description');

    if (nameElement && latitudeElement && longitudeElement && descriptionElement) {
      var locationName = nameElement.value;
      var latitude = latitudeElement.value;
      var longitude = longitudeElement.value;
      var description = descriptionElement.value;

      fetch('http://127.0.0.1:3000/add-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: locationName,
          lat: latitude,
          lon: longitude,
          description: description
        })
      })
      .then(response => response.text())
      .then(data => {
        alert(data);
        var suggestModal = bootstrap.Modal.getInstance(document.getElementById('suggestModal'));
        suggestModal.hide();
        document.getElementById('suggestLocationForm').reset();
      })
      .catch(error => {
        console.error('Error submitting location:', error);
        alert('Error submitting location');
      });
    } else {
      console.error('One or more form elements are missing.');
      alert('Form elements are missing.');
    }
  });
};