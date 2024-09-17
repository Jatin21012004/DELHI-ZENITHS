document.getElementById('locationForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    var name = document.getElementById('name').value;
    var lat = document.getElementById('lat').value;
    var lon = document.getElementById('lon').value;
  
    fetch('/add-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, lat: parseFloat(lat), lon: parseFloat(lon) })
    })
      .then(response => response.text())
      .then(result => {
        alert(result);
        window.location.href = 'index.html'; // Redirect back to map
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit location');
      });
  });
    