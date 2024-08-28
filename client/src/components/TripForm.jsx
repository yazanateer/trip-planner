import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TripForm = () => {
  const [country, setCountry] = useState('');
  const [tripType, setTripType] = useState('car');
  const [tripImage, setTripImage] = useState(null);
  const [zonesText, setZonesText] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTripImage(null);
    setZonesText('');
    setCoordinates([]);

    try {
      // Request to generate the zones description
      const zonesResponse = await fetch('http://localhost:5000/generate-zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country, tripType }),
      });

      if (!zonesResponse.ok) {
        throw new Error('Failed to generate zones');
      }

      const zonesData = await zonesResponse.json();
      const zonesText = zonesData.zones.join('\n');
      setZonesText(zonesText);

      // Extracting the coordinates
      const extractedCoordinates = extractCoordinates(zonesText);
      setCoordinates(extractedCoordinates);

      // Request to generate the image
      const imageResponse = await fetch('http://localhost:5000/generate-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country, tripType }),
      });

      if (!imageResponse.ok) {
        throw new Error('Failed to generate trip');
      }

      const imageData = await imageResponse.json();
      setTripImage(imageData.imageUrl);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractCoordinates = (text) => {
    const coordinatePairs = [];
    const regex = /([0-9]+\.[0-9]+)° N, ([0-9]+\.[0-9]+)° E/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      coordinatePairs.push([parseFloat(match[1]), parseFloat(match[2])]);
    }

    return coordinatePairs;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type of Trip:</label>
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            <option value="car">Car</option>
            <option value="bicycle">Bicycle</option>
          </select>
        </div>
        <button type="submit">Generate Trip</button>
      </form>

      {loading && <p>Generating trip...</p>}
      {error && <p>Error: {error}</p>}

      {tripImage && (
        <div>
          <h2>Trip Image</h2>
          <img src={tripImage} alt="Generated trip" style={{ width: '100%', maxWidth: '512px' }} />
        </div>
      )}

      {zonesText && (
        <div>
          <h2>Trip Description</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {zonesText}
          </pre>
        </div>
      )}

      {coordinates.length > 0 && (
        <div>
          <h2>Map of the Trip</h2>
          <MapContainer style={{ height: "400px", width: "100%" }} center={coordinates[0]} zoom={10}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={coordinates} color="blue" />
            {coordinates.map((coordinate, index) => (
              <Marker key={index} position={coordinate}>
                <Popup>
                  Point {index + 1}: {coordinate[0]}, {coordinate[1]}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default TripForm;
