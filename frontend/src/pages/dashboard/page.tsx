import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/main.css';
import '../../styles/auth.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1>Development Dashboard</h1>
      <p>Use this page to easily navigate to all the pages created so far.</p>
      <div className="dashboard-links">
        <Link to="/" className="dashboard-link">Home Page</Link>
        <Link to="/login" className="dashboard-link">Login Page</Link>
        <Link to="/signup" className="dashboard-link">Sign Up Page</Link>
      </div>
    </div>
  );
};

export default DashboardPage;
