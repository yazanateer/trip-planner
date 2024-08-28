import React, { useState } from 'react';

const TripForm = () => {
  const [country, setCountry] = useState('');
  const [tripType, setTripType] = useState('car');
  const [tripImage, setTripImage] = useState(null);
  const [zonesText, setZonesText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTripImage(null);
    setZonesText('');

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
      setZonesText(zonesData.zones.join('\n'));

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
    </div>
  );
};

export default TripForm;
