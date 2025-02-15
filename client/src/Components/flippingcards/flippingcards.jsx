import React from 'react';
import './flippingcards.css';
import flippingimage01 from '../../assets/asset  (1).jpg';
import flippingimage02 from '../../assets/asset  (2).jpg';
import flippingimage03 from '../../assets/asset  (3).jpg';

const FlippingCards = () => {
  const features = [
    { src: flippingimage01, description: 'Fast Ticketing' },
    { src: flippingimage02, description: 'Live Train Updates' },
    { src: flippingimage03, description: 'Travel History' },
  ];

  return (
    <div className="flipping-cards-section">
      {features.map((feature, index) => (
        <div className="flip-card" key={index}>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={feature.src} alt={feature.description} />
            </div>
            <div className="flip-card-back">
              <p>{feature.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlippingCards;
