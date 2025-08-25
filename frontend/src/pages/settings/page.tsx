import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import '../../styles/main.css';

const SettingsPage: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <h1>Settings</h1>
          <p className="subtitle">Profile preferences and app options will live here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
