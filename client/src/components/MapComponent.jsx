import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ zones }) => {
  return (
    <MapContainer style={{ height: "400px", width: "100%" }} center={[32.0853, 34.7818]} zoom={8}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {zones.map((zone, index) => (
        <Marker key={index} position={[zone.latitude, zone.longitude]}>
          <Popup>
            <b>{zone.name}</b><br />
            Distance: {zone.distance}<br />
            Description: {zone.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
