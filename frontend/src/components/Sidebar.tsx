import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCompass, FaUser, FaCog, FaEnvelope, FaPlus } from 'react-icons/fa';
import '../styles/main.css';
import { getUser } from '../services/api';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <Link to="/" className="menu-item active">
          <FaHome className="icon" />
          <span>Home</span>
        </Link>
        <Link to="/explore" className="menu-item">
          <FaCompass className="icon" />
          <span>Explore</span>
        </Link>
        <Link to="/messages" className="menu-item">
          <FaEnvelope className="icon" />
          <span>Messages</span>
        </Link>
        <Link to="/newblog" className="menu-item">
          <FaPlus className="icon" />
          <span>Create Blog</span>
        </Link>
        <Link to="/profile" className="menu-item">
          <FaUser className="icon" />
          <span>Profile</span>
        </Link>
      </div>
      <div className="sidebar-menu">
        {getUser()?.name && (
          <div className="sidebar-username-row">
            {(() => { const u = getUser(); const src = u?.avatarDataUrl || u?.avatarUrl; 
              return src ? <img className="avatar-sm" src={src} alt="avatar" /> : <img className="avatar-sm" src="/default-avatar.svg" alt="avatar" />; })()}
            <div className="sidebar-username">{getUser()!.name}</div>
          </div>
        )}
        <Link to="/settings" className="menu-item">
          <FaCog className="icon" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
