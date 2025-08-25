import React from 'react';
import '../styles/main.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <a href="/" className="menu-item active">Home</a>
        <a href="/explore" className="menu-item">Explore</a>
        <a href="/profile" className="menu-item">Profile</a>
        <a href="/settings" className="menu-item">Settings</a>
      </div>
    </aside>
  );
};

export default Sidebar;
