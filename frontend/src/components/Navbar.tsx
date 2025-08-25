import React from 'react';
import { FaCog, FaBell } from 'react-icons/fa';
import '../styles/main.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">Digital Porch</a>
      </div>
      <div className="navbar-menu">
        <input type="text" placeholder="Search blogs, authors, or tags..." className="search-bar" />
        <button className="icon-button">
          <FaBell />
        </button>
        <button className="icon-button">
          <FaCog />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
