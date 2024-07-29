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

let map;
let markers = [];

function setupMap(center) {
    map = new mapboxgl.Map({
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

    // Create category buttons
    createCategoryButtons();
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
            name: `Location ${i + 1}`
        });
    }
    return points;
}

// Function to create category buttons with icons
function createCategoryButtons() {
    const categories = [
        { name: "Restaurants", icon: "fas fa-utensils", color: "#FF6347" },
        { name: "Bathrooms", icon: "fas fa-restroom", color: "#1E90FF" },
        { name: "Things to Do", icon: "fas fa-futbol", color: "#32CD32" },
        { name: "Museums", icon: "fas fa-landmark", color: "#FFD700" },
        { name: "Transit", icon: "fas fa-bus", color: "#8A2BE2" },
        { name: "ATMs", icon: "fas fa-money-check-alt", color: "#FF4500" }
    ];
    
    const container = document.createElement("div");
    container.id = "buttons-container";
    container.style.position = "absolute";
    container.style.top = "10px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.zIndex = "1";
    container.style.display = "flex";
    container.style.gap = "10px";

    categories.forEach(category => {
        const button = document.createElement("button");
        button.className = "category-button";
        button.innerHTML = `<i class="${category.icon}"></i> ${category.name}`;
        button.style.backgroundColor = "#fff";
        button.style.border = `2px solid ${category.color}`;
        button.style.borderRadius = "20px";
        button.style.padding = "10px 20px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = lightenDarkenColor(category.color, 40);
        });
        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "#fff";
        });
        button.addEventListener("click", () => {
            clearMarkers();
            const center = map.getCenter().toArray(); // Get the current center of the map
            const points = generateRandomPoints(center, 20);
            points.forEach(point => {
                const marker = new mapboxgl.Marker({
                    element: createIconElement(category.icon, category.color)
                })
                .setLngLat([point.lng, point.lat])
                .setPopup(new mapboxgl.Popup().setText(point.name))
                .addTo(map);
                markers.push(marker);
            });
        });
        container.appendChild(button);
    });

    document.body.appendChild(container);
}

// Function to clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => marker.remove());
    markers = [];
}

// Utility function to lighten or darken a color
function lightenDarkenColor(col, amt) {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0x00FF) + amt;
    let b = (num & 0x0000FF) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    return (usePound ? "#" : "") + (r.toString(16).padStart(2, "0")) + (g.toString(16).padStart(2, "0")) + (b.toString(16).padStart(2, "0"));
}

// Function to create a custom icon element for markers
function createIconElement(iconClass, color) {
    const iconContainer = document.createElement("div");
    iconContainer.style.backgroundColor = "#f9f9f9"; // off-white background
    iconContainer.style.border = `2px solid ${color}`;
    iconContainer.style.borderRadius = "50%";
    iconContainer.style.width = "30px";
    iconContainer.style.height = "30px";
    iconContainer.style.display = "flex";
    iconContainer.style.alignItems = "center";
    iconContainer.style.justifyContent = "center";

    const icon = document.createElement("i");
    icon.className = iconClass;
    icon.style.color = "black"; // default icon color
    icon.style.fontSize = "16px"; // slightly smaller icon

    iconContainer.appendChild(icon);
    return iconContainer;
}
