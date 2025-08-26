"use client";
import React from 'react';
import Link from 'next/link';
import '../../styles/main.css';
import '../../styles/auth.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1>Development Dashboard</h1>
      <p>Use this page to easily navigate to all the pages created so far.</p>
      <div className="dashboard-links">
  <Link href="/" className="dashboard-link">Home Page</Link>
  <Link href="/login" className="dashboard-link">Login Page</Link>
  <Link href="/signup" className="dashboard-link">Sign Up Page</Link>
      </div>
    </div>
  );
};

export default DashboardPage;
