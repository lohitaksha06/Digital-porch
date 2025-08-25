import React, { useEffect, useRef, useState } from 'react';
import { FaCog, FaBell, FaSignOutAlt, FaWrench } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/main.css';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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
    // TODO: clear auth when backend is ready
    setOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">Digital Porch</a>
      </div>
      <div className="navbar-menu">
        <input type="text" placeholder="Search blogs, authors, or tags..." className="search-bar" />
        <button className="icon-button" aria-label="Notifications">
          <FaBell />
        </button>
        <div className="menu-wrapper" ref={menuRef}>
          <button className="icon-button" aria-label="Settings" onClick={() => setOpen((v) => !v)}>
            <FaCog />
          </button>
          {open && (
            <div className="dropdown">
              <Link className="dropdown-item" to="/settings" onClick={() => setOpen(false)}>
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
