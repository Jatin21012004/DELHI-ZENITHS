window.onload = function() {
  // Initialize the map and set its view to a specific location (India's center) with zoom level
  var map = L.map('map').setView([20.5937, 78.9629], 5);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);

  // Define a default icon for "Chai Tapri" (Leaflet default icon)
  var chaiTapriIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png', // Default marker icon
    iconSize: [25, 41], // Default size
    iconAnchor: [12, 41], // Icon anchor
    popupAnchor: [1, -34] // Popup anchor
  });

  // Hardcoded "Chai Tapri" locations in India
  var chaiTapris = [
    { name: "Kadak Chai - Delhi", lat: 28.6139, lon: 77.2090 },
    { name: "Tapri Chai - Jaipur", lat: 26.9124, lon: 75.7873 },
    { name: "Mumbai Street Chai", lat: 19.0760, lon: 72.8777 },
    { name: "Kolkatta Famous Chai", lat: 22.5726, lon: 88.3639 },
    { name: "Chennai Masala Chai", lat: 13.0827, lon: 80.2707 }
  ];

  // Create a marker cluster group
  var markers = L.markerClusterGroup();

  // Add "Chai Tapri" markers to the marker cluster group
  chaiTapris.forEach(function(spot) {
    var marker = L.marker([spot.lat, spot.lon], { icon: chaiTapriIcon })
      .bindPopup(`<b>${spot.name}</b><br>Famous Chai Tapri`);
    markers.addLayer(marker);
  });

  // Add the marker cluster group to the map
  map.addLayer(markers);

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
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        map.setView([lat, lon], 13);
        L.marker([lat, lon], { icon: chaiTapriIcon }).addTo(map).bindPopup("You are here! Enjoy Chai nearby!").openPopup();
      });
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
            L.marker([lat, lon], { icon: chaiTapriIcon }).addTo(map).bindPopup(`Location: ${query}`).openPopup();
          } else {
            alert("Location not found.");
          }
        })
        .catch(error => alert("Error fetching location data."));
    } else {
      alert("Please enter a location.");
    }
  });
};
