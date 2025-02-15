import React from 'react';
import './navbarr.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>SLATE on Railway</h1>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li className="dropdown">
          <a href="#services">Services</a>
          <div className="dropdown-content">
            <a href="#tickets">E-Tickets</a>
            <a href="#tracking">Live Train Tracking</a>
          </div>
        </li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
