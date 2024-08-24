import React, { useState } from 'react';
import TripDisplay from './TripDisplay';

const TripForm = () => {
  const [country, setCountry] = useState('');
  const [tripType, setTripType] = useState('car');
  const [tripData, setTripData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace with your API call to the backend to generate the trip
    const response = await fetch('http://localhost:5000/generate-trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country, tripType }),
    });

    const data = await response.json();
    setTripData(data);
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

      {tripData && <TripDisplay tripData={tripData} />}
    </div>
  );
};

export default TripForm;
