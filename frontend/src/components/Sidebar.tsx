import React from 'react';
import { FaHome, FaCompass, FaUser, FaCog, FaEnvelope } from 'react-icons/fa';
import '../styles/main.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <a href="/" className="menu-item active">
          <FaHome className="icon" />
          <span>Home</span>
        </a>
        <a href="/explore" className="menu-item">
          <FaCompass className="icon" />
          <span>Explore</span>
        </a>
        <a href="/messages" className="menu-item">
          <FaEnvelope className="icon" />
          <span>Messages</span>
        </a>
        <a href="/profile" className="menu-item">
          <FaUser className="icon" />
          <span>Profile</span>
        </a>
      </div>
      <div className="sidebar-menu">
        <a href="/settings" className="menu-item">
          <FaCog className="icon" />
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
