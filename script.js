mapboxgl.accessToken = "pk.eyJ1Ijoic3ViaGFtcHJlZXQiLCJhIjoiY2toY2IwejF1MDdodzJxbWRuZHAweDV6aiJ9.Ys8MP5kVTk5P9V2TDvnuDg";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
});

function successLocation(position) {
    setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
    setupMap([-2.24, 53.48]); // Default location if geolocation fails
}

function setupMap(center) {
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: center,
        zoom: 15
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    });

    map.addControl(directions, "top-left");

    // Generate random bathroom locations
    const bathrooms = generateRandomPoints(center, 20);

    // Add markers to the map with custom bathroom icons
    bathrooms.forEach(bathroom => {
        new mapboxgl.Marker({
            color: "#FF0000", // Optional: Default color if using an image
            icon: "path/to/your/bathroom-icon.png" // URL or path to your bathroom icon
        })
            .setLngLat([bathroom.lng, bathroom.lat])
            .setPopup(new mapboxgl.Popup().setText(bathroom.name)) // optional: add a popup with the name
            .addTo(map);
    });
}

// Function to generate random points around a center location
function generateRandomPoints(center, numPoints) {
    const [lng, lat] = center;
    const radius = 0.01; // Approximate radius in degrees (about 1 km)

    const points = [];
    for (let i = 0; i < numPoints; i++) {
        const offsetLng = (Math.random() - 0.5) * 2 * radius;
        const offsetLat = (Math.random() - 0.5) * 2 * radius;

        const newLng = lng + offsetLng;
        const newLat = lat + offsetLat;

        points.push({
            lng: newLng,
            lat: newLat,
            name: `Bathroom ${i + 1}`
        });
    }
    return points;
}
