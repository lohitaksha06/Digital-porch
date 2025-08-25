import React from 'react';
import '../styles/main.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">Digital Porch</a>
      </div>
      <div className="navbar-menu">
        <input type="text" placeholder="Search..." className="search-bar" />
        <button className="nav-button">Login</button>
        <button className="nav-button primary">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
