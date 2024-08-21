import React from "react";
import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function trip_map( { trip_data}) {
    return (

        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }}>

        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {trip_data.routes.map((route, index) => (
        <Marker key={index} position={[51.505, -0.09]}>
            <Popup>
            <strong>{route.name}</strong><br />
            Distance: {route.distance} km<br />
            Interest points: {route.pointsOfInterest.join(', ')}
          </Popup>
        </Marker>
      ))}
      </MapContainer>

    )
}

export default trip_map;