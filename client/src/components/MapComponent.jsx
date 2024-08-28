import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent = ({ routes }) => {
  // Placeholder coordinates for Tel Aviv, Haifa, and Herzliya
  const positions = [
    { name: routes[0].name, coords: [32.0853, 34.7818] }, // Tel Aviv
    { name: routes[1].name, coords: [32.7940, 34.9896] }, // Haifa
    { name: routes[2].name, coords: [32.1663, 34.8436] }  // Herzliya
  ];

  return (
    <MapContainer center={[32.0853, 34.7818]} zoom={8} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {positions.map((pos, index) => (
        <Marker key={index} position={pos.coords}>
          <Popup>{pos.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
