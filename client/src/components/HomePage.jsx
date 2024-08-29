import React from 'react';
import TripForm from './TripForm';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Explore Your Next Adventure in 3-Days Trip with AI</h1>
      </header>
      <section className="form-section">
        <TripForm />
      </section>
    </div>
  );
};

export default HomePage;
