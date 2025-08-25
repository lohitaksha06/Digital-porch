import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/auth.css';

const LoginPage: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back!</h2>
        <p>Please enter your details to sign in.</p>
        <form className="auth-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <Button type="submit" className="auth-button">Sign In</Button>
        </form>
        <span>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
