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
            <p>Distance: {route.distance} km</p>
            <p>Points of Interest: {route.pointsOfInterest.join(', ')}</p>
          </div>
        ))}
        
        {tripData.imageUrl && (
          <img src={tripData.imageUrl} alt="Generated scenery" />
        )}
      </div>
    );
  };
  
export default TripDisplay;
