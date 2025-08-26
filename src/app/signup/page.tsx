"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import '../../styles/auth.css';
import { signup, saveToken, saveUser } from '../../services/api';
import { IMAGES } from '../../assets/images';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Basic DOB sanity check: must not be in the future and year >= 1900
      if (dob) {
        const d = new Date(dob);
        const today = new Date();
        if (d > today || d.getFullYear() < 1900) {
          throw new Error('Please enter a valid date of birth');
        }
      }
      const res = await signup(name, email, password);
  saveToken(res.token);
  saveUser({ name: res.name, email: res.email });
  router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-layout">
        <div className="auth-side" aria-hidden>
          <img className="auth-side-img primary" src={IMAGES[0]} alt="signup art" />
          <img className="auth-side-img secondary" src={IMAGES[3]} alt="creative" />
          <img className="auth-side-img tertiary" src={IMAGES[5]} alt="stories" />
        </div>
        <div className="auth-card">
        <h2>Create an Account</h2>
        <p>Join the community and start sharing your stories.</p>
        {error && <div className="auth-error">{error}</div>}
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="grid-2">
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <select value={gender} onChange={e => setGender(e.target.value)} aria-label="Gender">
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <div className="grid-2">
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="auth-button" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</Button>
          </form>
          <span>
            Already have an account? <Link href="/login">Sign In</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
