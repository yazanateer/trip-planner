import React, { useState } from 'react';
import Trip_form from './components/trip_form';
import './App.css'


function App() {

const [Trip_data, setTripData] = useState(null);
const handleTripData = (data) => {
  setTripData(data);
};
  

  return (
    <div className='home_page'>
      <header>
        <h1>3 Days Trip Arount The World</h1>
      </header>

      <main>
        <Trip_form onTripData={handleTripData} />
        {Trip_data }
      </main>
    </div>
  );
}

export default App;
