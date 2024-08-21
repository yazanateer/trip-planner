import React, {useState} from "react";

function Trip_form( {onTripData}) {

    const [country, setCountry] = useState('');
    const [typeTrip, setTypeTrip] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          const response = await fetch('/api/get-trip-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ country, typeTrip }),
          });
    
          const trip_data = await response.json();
          onTripData(trip_data);
        } catch (error) {
          console.error('Error fetching trip data:', error);
        }
    };



return (
    <form onSubmit={handleSubmit}>
   <h2>Choose how you want your trip to be</h2>
        <label>
            Country: 
            <input type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)} required />
        </label>
        <label>
            Type of Trip: 
            <select value={typeTrip}
            onChange={(e) => setTypeTrip(e.target.value)} required >
            <option value="choose.."></option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            </select>
        </label>
        <button type="submit">get an suggestion for a trip</button>
    </form>
)

}
export default Trip_form;