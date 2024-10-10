import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null); // Store current location coordinates
    const [manualLocation, setManualLocation] = useState(null); // Store manually added location
    const [distance, setDistance] = useState(null); // Store the distance in kilometers
    const socket = useRef();

    useEffect(() => {
        // Initialize the map
        const initialMap = L.map(mapRef.current).setView([51.505, -0.09], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(initialMap);

        setMap(initialMap);

        // Socket.io setup
        socket.current = io('http://localhost:5000'); // Replace with your socket server URL

        socket.current.on("receive-location", (data) => {
            // Add marker for the received location
            const marker = L.marker([data.latitude, data.longitude]).addTo(map);
            marker.bindPopup(`Location from ${data.id}`).openPopup();
        });

        // Cleanup on component unmount
        return () => {
            initialMap.remove();
            socket.current.disconnect();
        };
    }, []);

    const sendCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude }); // Set the current location state
            socket.current.emit("send-location", { latitude, longitude });

            const marker = L.marker([latitude, longitude]).addTo(map);
            marker.bindPopup('Your Current Location').openPopup();
            map.setView([latitude, longitude], 13); // Zoom into the new marker position

            // Calculate the distance if the manual location is set
            if (manualLocation) {
                const calculatedDistance = getDistanceFromLatLonInKm(
                    latitude,
                    longitude,
                    manualLocation.latitude,
                    manualLocation.longitude
                );
                setDistance(calculatedDistance); // Set the calculated distance
            }
        }, (error) => {
            alert('Unable to retrieve your location: ' + error.message);
        });
    };

    const addLocation = () => {
        const googleMapsUrl = document.getElementById('googleMapsUrl').value;
        const latLng = extractLatLngFromUrl(googleMapsUrl);

        if (latLng) {
            const [latitude, longitude] = latLng;
            const marker = L.marker(latLng).addTo(map);
            marker.bindPopup('Manually Added Location').openPopup();
            setManualLocation({ latitude, longitude });

            map.setView(latLng, 13); // Zoom into the new marker position

            // Calculate the distance if the current location is set
            if (currentLocation) {
                const calculatedDistance = getDistanceFromLatLonInKm(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    latitude,
                    longitude
                );
                setDistance(calculatedDistance); // Set the calculated distance
            }
        } else {
            alert('Invalid Google Maps URL');
        }
    };

    // Function to extract lat/lon from Google Maps URL
    const extractLatLngFromUrl = (url) => {
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(regex);
        return match ? [parseFloat(match[1]), parseFloat(match[2])] : null;
    };

    // Haversine formula to calculate distance in kilometers
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance.toFixed(2); // Return formatted distance
    };

    // Helper function to convert degrees to radians
    const deg2rad = (deg) => deg * (Math.PI / 180);

    return (
        <>
            <div id="map" ref={mapRef} style={{ height: '600px', width: '100%' }}></div>
            <div id="input-container" style={{ margin: '20px' }}>
                <label htmlFor="googleMapsUrl">Enter Google Maps URL:</label>
                <input type="text" id="googleMapsUrl" placeholder="Paste Google Maps URL here" />
                <button onClick={addLocation} style={{ margin: '10px' }}>Add Location</button>
                <button onClick={sendCurrentLocation} style={{ margin: '10px' }}>Get Current Location</button>
                
                {/* Display the calculated distance if available */}
                {distance && (
                    <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>
                        Distance: {distance} km
                    </span>
                )}
            </div>
        </>
    );
};

export default MapPage;
