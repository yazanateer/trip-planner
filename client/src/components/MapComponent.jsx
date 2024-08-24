import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ routeData }) => {
  useEffect(() => {
    const map = L.map('map').setView([routeData[0].lat, routeData[0].lng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    routeData.forEach((point, index) => {
      L.marker([point.lat, point.lng])
        .addTo(map)
        .bindPopup(`<b>Day ${index + 1}</b><br>${point.name}`)
        .openPopup();
    });

    const routeLine = routeData.map((point) => [point.lat, point.lng]);
    L.polyline(routeLine, { color: 'blue' }).addTo(map);

    return () => {
      map.remove();
    };
  }, [routeData]);

  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
};

export default MapComponent;
