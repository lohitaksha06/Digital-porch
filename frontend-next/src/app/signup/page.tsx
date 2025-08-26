"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import '../../styles/auth.css';
import { signup, saveToken, saveUser } from '../../services/api';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
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
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p>Join the community and start sharing your stories.</p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" className="auth-button" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</Button>
        </form>
        <span>
          Already have an account? <Link href="/login">Sign In</Link>
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
