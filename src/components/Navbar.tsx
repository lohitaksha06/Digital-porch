"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FaCog, FaBell, FaSignOutAlt, FaWrench } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../styles/main.css';
import { clearToken, clearUser } from '../services/api';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const logout = () => {
  clearToken();
  clearUser();
    setOpen(false);
  router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
    <Link href="/">Digital Porch</Link>
      </div>
      <div className="navbar-menu">
  <SearchBar onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)} />
        <button className="icon-button" aria-label="Notifications">
          <FaBell />
        </button>
        <div className="menu-wrapper" ref={menuRef}>
          <button className="icon-button" aria-label="Settings" onClick={() => setOpen((v) => !v)}>
            <FaCog />
          </button>
          {open && (
            <div className="dropdown">
      <Link className="dropdown-item" href="/settings" onClick={() => setOpen(false)}>
                <FaWrench />
                <span>Settings</span>
              </Link>
              <button className="dropdown-item" onClick={logout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
