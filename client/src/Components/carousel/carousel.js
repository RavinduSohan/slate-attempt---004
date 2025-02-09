import React from 'react';
import Slider from 'react-slick';
import './carousel.css'; 
import carouselimg01 from '../../assets/assetss (8).jpg';
import carouselimg02 from '../../assets/assetss (10).jpg';
import carouselimg03 from '../../assets/assetss (6).jpg';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = [
    { 
      src: carouselimg01, 
      alt: 'Fast Ticketing', 
      title: 'Fast Ticketing', 
      description: 'Book your train tickets quickly and easily with our streamlined process.'
    },
    { 
      src: carouselimg02, 
      alt: 'Live Train Updates', 
      title: 'Live Train Updates', 
      description: 'Get real-time updates on train schedules and delays to stay informed.'
    },
    { 
      src: carouselimg03, 
      alt: 'Travel History', 
      title: 'Travel History', 
      description: 'Access your travel history and manage your trips effortlessly.'
    },
  ];

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img src={image.src} alt={image.alt} />
            <div className="carousel-content">
              <h2>{image.title}</h2>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
