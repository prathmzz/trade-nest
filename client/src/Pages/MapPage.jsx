// MapPage.js
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [locations, setLocations] = useState([]);
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
        socket.current = io('http://your-socket-url'); // replace with your socket server URL

        // Cleanup on component unmount
        return () => {
            initialMap.remove();
            socket.current.disconnect();
        };
    }, []);

    const addLocation = () => {
        const googleMapsUrl = document.getElementById('googleMapsUrl').value;
        const latLng = extractLatLngFromUrl(googleMapsUrl);

        if (latLng) {
            const marker = L.marker(latLng).addTo(map);
            setLocations([...locations, latLng]);
            map.setView(latLng, 13); // Zoom into the new marker position
        } else {
            alert('Invalid Google Maps URL');
        }
    };

    const extractLatLngFromUrl = (url) => {
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(regex);
        return match ? [parseFloat(match[1]), parseFloat(match[2])] : null;
    };

    return (
        <>
            <div id="map" ref={mapRef} style={{ height: '600px', width: '100%' }}></div>
            <div id="input-container" style={{ margin: '20px' }}>
                <label htmlFor="googleMapsUrl">Enter Google Maps URL:</label>
                <input type="text" id="googleMapsUrl" placeholder="Paste Google Maps URL here" />
                <button onClick={addLocation}>Add Location</button>
            </div>
        </>
    );
};

export default MapPage;
