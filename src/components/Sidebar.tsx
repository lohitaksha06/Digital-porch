"use client";
import React from 'react';
import Link from 'next/link';
import { FaHome, FaCompass, FaUser, FaCog, FaEnvelope, FaPlus, FaMoon, FaSun } from 'react-icons/fa';
import '../styles/main.css';
import { getUser } from '../services/api';
import { useEffect, useState } from 'react';

const Sidebar: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    const saved = localStorage.getItem('dp_theme') as 'light' | 'dark' | null;
    return saved || 'light';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem('dp_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
  <Link href="/" className="menu-item active">
          <FaHome className="icon" />
          <span>Home</span>
        </Link>
  <Link href="/explore" className="menu-item">
          <FaCompass className="icon" />
          <span>Explore</span>
        </Link>
  <Link href="/messages" className="menu-item">
          <FaEnvelope className="icon" />
          <span>Messages</span>
        </Link>
  <Link href="/newblog" className="menu-item">
          <FaPlus className="icon" />
          <span>Create Blog</span>
        </Link>
  <Link href="/profile" className="menu-item">
          <FaUser className="icon" />
          <span>Profile</span>
        </Link>
      </div>
      <div className="sidebar-menu">
        <button className="menu-item" onClick={toggleTheme} style={{ background: 'transparent', border: 'none' }}>
          {theme === 'dark' ? <FaSun className="icon" /> : <FaMoon className="icon" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        {getUser()?.name && (
          <div className="sidebar-username-row">
            {(() => { const u = getUser(); const src = u?.avatarDataUrl || u?.avatarUrl; 
              return src ? <img className="avatar-sm" src={src} alt="avatar" /> : <img className="avatar-sm" src="/default-avatar.svg" alt="avatar" />; })()}
            <div className="sidebar-username">{getUser()!.name}</div>
          </div>
        )}
  <Link href="/settings" className="menu-item">
          <FaCog className="icon" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
