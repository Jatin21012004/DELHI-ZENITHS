let map;
let points = 0; // Initialize points variable
let geocoder; // Initialize geocoder variable

window.onload = function() {
  // Initialize the map only if it hasn't been initialized yet
  if (!map) {
    map = L.map('map').setView([28.7041, 77.1025], 13); // Delhi coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Initialize the geocoder
    geocoder = L.Control.Geocoder.nominatim();

    // Add a marker to the map
    L.marker([28.6139, 77.209]).addTo(map).bindPopup('Hello Delhi!').openPopup();
  } else {
    console.log('Map is already initialized');
  }
};

// Wait for the document to fully load before adding event listeners
document.addEventListener("DOMContentLoaded", function() {
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
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        map.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(map).bindPopup("You are here!").openPopup();
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });

  // Handle Location Search
  document.getElementById("searchButton").addEventListener("click", function() {
    const location = document.getElementById("locationSearch").value;
    if (location) {
      console.log("Searching for: " + location);
      
      // Use geocoder to find the location
      geocoder.geocode(location, function(results) {
        if (results && results.length > 0) {
          const latLng = results[0].center; // Get the coordinates of the first result
          map.setView(latLng, 13); // Center the map on the searched location

          // Add a marker at the searched location
          L.marker(latLng).addTo(map)
            .bindPopup("You searched for: " + location)
            .openPopup();
        } else {
          alert("Location not found. Please try again.");
        }
      });
    } else {
      alert("Please enter a location to search.");
    }
  });

  // Handle Suggest Location Form Submission
  document.getElementById("suggestLocationForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const locationName = document.getElementById("name").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const description = document.getElementById("description").value;

    if (locationName && latitude && longitude && description) {
      try {
        const response = await fetch("http://localhost:3000/add-location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: locationName,
            latitude: latitude,
            longitude: longitude,
            description: description,
          }),
        });

        if (response.ok) {
          points += 10; // Increment points by 10
          document.getElementById("pointsButton").textContent = `Points: ${points}`; // Update points display
          alert("Location suggested successfully!");
          document.getElementById("suggestLocationForm").reset(); // Reset the form after submission
        } else {
          throw new Error("Failed to suggest the location.");
        }
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Please fill in all the fields.");
    }
  });

  // Handle Login Form Submission
  document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          alert("Logged in successfully!");
          $('#loginModal').modal('hide'); // Close the modal
        } else {
          throw new Error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Please enter both email and password.");
    }
  });

  // Handle Sign-Up Form Submission
  document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // Validate input
    if (name && email && password) {
      try {
        const response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
          alert("Signed up successfully!");
          $('#signupModal').modal('hide'); // Close the modal
          // Optionally redirect or log in the user here
        } else {
          const errorData = await response.json(); // Get error message from server
          throw new Error(errorData.message || "Sign-up failed. Please try again.");
        }
      } catch (error) {
        alert(error.message); // Show error message
      }
    } else {
      alert("Please fill in all the fields."); // Prompt to fill all fields
    }
  });
});
