import React from 'react';
import MapComponent from './MapComponent';

const TripDisplay = ({ tripData }) => {
  if (!tripData || !tripData.routes) {
    return <p>No trip data available.</p>;
  }

  return (
    <div>
      <h2>Generated Trip</h2>
      <p>Country: {tripData.country}</p>
      <p>Type of Trip: {tripData.tripType}</p>
      {tripData.routes.map((route, index) => (
        <div key={index}>
          <h3>Day {index + 1}: {route.name}</h3>
          <p>Description: {route.description}</p>
          <p>Distance: {route.distance} km</p>
          <p>Points of Interest: {route.pointsOfInterest.join(', ')}</p>
        </div>
      ))}

      {tripData.imageUrl && (
        <img src={tripData.imageUrl} alt="Generated scenery" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '20px' }} />
      )}

      <h3>Map of the Route</h3>
      <MapComponent routes={tripData.routes} />
    </div>
  );
};

export default TripDisplay;
