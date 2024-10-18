let map;
let points = 0; // Initialize points variable
let userMarker; // To store the marker for searched location
let currentLocation = null; // Store current user location
let searchedLocation = null; // Store searched location

window.onload = function() {
  if (!map) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3ViaGFtcHJlZXQiLCJhIjoiY2toY2IwejF1MDdodzJxbWRuZHAweDV6aiJ9.Ys8MP5kVTk5P9V2TDvnuDg'; // Replace with your Mapbox access token

    // Initialize the Mapbox map
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', 
      center: [77.2090, 28.6139], // Longitude, Latitude for Delhi
      zoom: 12 // Initial zoom level
    });

    // Add navigation control (zoom buttons)
    map.addControl(new mapboxgl.NavigationControl());

    // Add GeolocateControl (Locate Me)
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false // Optional: Hides the accuracy circle
    });

    // Add the GeolocateControl to the map
    map.addControl(geolocateControl);

    // Listen for the 'geolocate' event to zoom in to the user's location
    geolocateControl.on('geolocate', function(e) {
      currentLocation = [e.coords.longitude, e.coords.latitude];
      map.flyTo({
        center: currentLocation,
        zoom: 15, // Set the zoom level when the location is found
        essential: true // Ensures smooth animation
      });

      // If there's an existing marker, remove it first
      if (userMarker) {
        userMarker.remove();
      }

      // Add a new marker at the user's location
      userMarker = new mapboxgl.Marker()
        .setLngLat(currentLocation)
        .setPopup(new mapboxgl.Popup().setHTML('You are here!'))
        .addTo(map);
    });

    // Initialize the Mapbox Geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, 
      language: 'en',
      placeholder: 'Search for a place',
      mapboxgl: mapboxgl
    });

    // Add the geocoder to the map
    map.addControl(geocoder);

    // Initialize the directions control
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving'
    });

    // Handle the "Get Directions" button click
    document.getElementById('get-directions').addEventListener('click', function() {
      if (currentLocation && searchedLocation) {
        directions.setOrigin(currentLocation); // Current user location
        directions.setDestination(searchedLocation); // Searched location
        map.addControl(directions, 'top-left'); // Show the directions control
      } else {
        alert('Unable to get directions. Please ensure your current location is available.');
      }
    });

    // Listen for the result event from the geocoder
    geocoder.on('result', function(e) {
      searchedLocation = e.result.geometry.coordinates;

      // Fly to the searched location
      map.flyTo({
        center: searchedLocation,
        zoom: 15
      });

      // If there's an existing marker, remove it first
      if (userMarker) {
        userMarker.remove();
      }

      // Add a new marker at the searched location
      userMarker = new mapboxgl.Marker()
        .setLngLat(searchedLocation)
        .setPopup(new mapboxgl.Popup().setHTML('You searched for: ' + e.result.text))
        .addTo(map);
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

    // Location Search Autocomplete
    $('#searchBox').on('input', function () {
      const query = $(this).val();
      if (query.length > 2) {
        $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`, function (data) {
          $('#suggestions').empty();
          if (data.features.length > 0) {
            data.features.forEach(location => {
              $('#suggestions').append(`<li class="suggestion-item" data-lat="${location.geometry.coordinates[1]}" data-lon="${location.geometry.coordinates[0]}">${location.place_name}</li>`);
            });
            $('#suggestions').show();
          } else {
            $('#suggestions').hide();
          }
        });
      } else {
        $('#suggestions').hide();
      }
    });

    // Handle suggestion click
    $('#suggestions').on('click', '.suggestion-item', function () {
      const lat = $(this).data('lat');
      const lon = $(this).data('lon');
      $('#searchBox').val($(this).text());
      $('#suggestions').hide();

      // Fly to the selected suggestion
      map.flyTo({
        center: [lon, lat],
        zoom: 15
      });

      // If there's an existing marker, remove it first
      if (userMarker) {
        userMarker.remove();
      }

      // Add a new marker at the selected suggestion location
      userMarker = new mapboxgl.Marker()
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setHTML('You selected: ' + $(this).text()))
        .addTo(map);

      searchedLocation = [lon, lat]; // Store searched location for directions
    });

    // Hide suggestions when clicking outside
    $(document).click(function (event) {
      if (!$(event.target).closest('#suggestions').length) {
        $('#suggestions').hide();
      }
    });
  }
};
