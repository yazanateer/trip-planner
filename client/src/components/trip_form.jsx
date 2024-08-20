import React, {useState} from "react";

function Trip_form( {onTripData}) {

    const [country, setCountry] = useState('');
    const [typeTrip, setTypeTrip] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const trip_data = {
            country, typeTrip, 
            routes: [
                { name: 'Route 1', distance: 100, pointsOfInterest: ['Point A', 'Point B'] },
                { name: 'Route 2', distance: 120, pointsOfInterest: ['Point C', 'Point D'] },
                { name: 'Route 3', distance: 90, pointsOfInterest: ['Point E', 'Point F'] },
            ],
        };

        onTripData(trip_data);
    };



return (
    <form onSubmit={handleSubmit}>
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