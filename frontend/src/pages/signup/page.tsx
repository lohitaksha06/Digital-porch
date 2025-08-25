import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/auth.css';

const SignupPage: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p>Join the community and start sharing your stories.</p>
        <form className="auth-form">
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <Button type="submit" className="auth-button">Sign Up</Button>
        </form>
        <span>
          Already have an account? <Link to="/login">Sign In</Link>
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
