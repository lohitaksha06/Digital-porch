"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import '../../styles/auth.css';
import { login, saveToken, saveUser } from '../../services/api';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
  saveToken(res.token);
  saveUser({ name: res.name, email: res.email });
  router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <h2>Welcome Back!</h2>
        <p>Please enter your details to sign in.</p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" className="auth-button" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
        </form>
        <span>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
