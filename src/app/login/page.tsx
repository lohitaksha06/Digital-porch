"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Custom components and styles
import Button from '../../components/Button';
import '../../styles/auth.css';

// Import the Supabase client instance you created earlier
import { createClient } from '@/utils/supabase/client'; // Adjust this path if needed

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use Supabase's built-in signInWithPassword function
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // Check if Supabase returned an error
      if (error) {
        // This will catch issues like "Invalid login credentials"
        throw error;
      }

      // If login is successful, Supabase handles the session automatically.
      // Now, redirect the user to the dashboard.
      // Using router.refresh() is good practice to re-fetch server components with the new auth state.
      router.refresh();
      router.push('/dashboard');

    } catch (err: any) {
      // Set the error message to be displayed to the user
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <h2>Welcome Back!</h2>
        <p>Please enter your details to sign in.</p>
        
        {/* Display the error message if it exists */}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <div style={{ marginTop: 6, marginBottom: 6, textAlign: 'right' }}>
            <button
              type="button"
              className="link"
              onClick={() => alert("This feature hasn't been made yet.")}
              style={{ background: 'none', border: 'none', color: '#6b46c1', cursor: 'pointer', padding: 0 }}
            >
              Forgot password?
            </button>
          </div>
          <Button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <span>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;