import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/main.css';

const HomePage: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <h1>Welcome to the Digital Porch</h1>
          <p>This is where the main blog feed will go.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
