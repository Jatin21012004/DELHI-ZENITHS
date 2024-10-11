let map;

window.onload = function() {
  if (!map) {  // Check if map is already initialized
    map = L.map('map').setView([28.7041, 77.1025], 13);  // Initialize the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  } else {
    console.log('Map is already initialized');
  }

  // Optionally add a marker
  L.marker([28.6139, 77.209]).addTo(map).bindPopup('Hello Delhi!').openPopup();
};
// Wait for the document to fully load
document.addEventListener("DOMContentLoaded", function() {

  // Initialize the map
  var map = L.map('map').setView([28.6139, 77.2090], 12); // Coordinates for Delhi

  // Add a colorful map tile layer (CartoDB Voyager)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, © CartoDB'
  }).addTo(map);

  // Add marker for Delhi and popup
  var marker = L.marker([28.6139, 77.2090]).addTo(map);
  marker.bindPopup('<b>Delhi</b><br>This is the capital city of India.').openPopup();

  // Zoom In functionality
  document.getElementById("zoomIn").addEventListener("click", function() {
    map.zoomIn();
  });

  // Zoom Out functionality
  document.getElementById("zoomOut").addEventListener("click", function() {
    map.zoomOut();
  });

  // Locate Me functionality (uses browser's geolocation)
  document.getElementById("locateMe").addEventListener("click", function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        map.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(map).bindPopup("You are here!").openPopup();
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });

  // Handle Location Search
  document.getElementById("searchButton").addEventListener("click", function() {
    var location = document.getElementById("locationSearch").value;
    if (location) {
      // You could integrate a search API to find the location. For simplicity, we'll just log it.
      console.log("Searching for: " + location);
      alert("Search functionality is yet to be implemented. You searched for: " + location);
    } else {
      alert("Please enter a location to search.");
    }
  });

  // Handle Suggest Location Form Submission
  document.getElementById("suggestLocationForm").addEventListener("submit", function(e) {
    e.preventDefault();

    var locationName = document.getElementById("name").value;
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    var description = document.getElementById("description").value;

    if (locationName && latitude && longitude && description) {
      // Send data to the server
      $.post("/add-location", {
        name: locationName,
        latitude: latitude,
        longitude: longitude,
        description: description
      }, function(response) {
        alert("Location suggested successfully!");
        // Reset the form after submission
        document.getElementById("suggestLocationForm").reset();
      }).fail(function() {
        alert("Failed to suggest the location.");
      });
    } else {
      alert("Please fill in all the fields.");
    }
  });

  // Handle Login Form Submission
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    if (email && password) {
      // Send login data to the server
      $.post("/login", { email: email, password: password }, function(response) {
        alert("Logged in successfully!");
        // Close the modal
        $('#loginModal').modal('hide');
      }).fail(function() {
        alert("Login failed. Please check your credentials.");
      });
    } else {
      alert("Please enter both email and password.");
    }
  });

  // Handle Sign-Up Form Submission
  document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    var name = document.getElementById("signupName").value;
    var email = document.getElementById("signupEmail").value;
    var password = document.getElementById("signupPassword").value;

    if (name && email && password) {
      // Send sign-up data to the server
      $.post("/signup", { name: name, email: email, password: password }, function(response) {
        alert("Signed up successfully!");
        // Close the modal
        $('#signupModal').modal('hide');
      }).fail(function() {
        alert("Sign-up failed. Please try again.");
      });
    } else {
      alert("Please fill in all the fields.");
    }
  });

});
