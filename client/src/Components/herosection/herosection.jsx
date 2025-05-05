import React from 'react';
import './herosection.css';
import heroimage01 from '../../assets/asset  (5).jpg';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <img src={heroimage01} alt="Train" className="hero-image" />
      <div className="hero-text">
        <h2>Welcome to the Future of Railway Travel</h2>
        <p>Efficient, convenient, and secure travel solutions with Consistent Communication and real-time tracking.</p>
      </div>
    </div>
  );
};

export default HeroSection;
