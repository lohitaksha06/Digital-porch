"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Custom components and styles
import Button from '../../components/Button';
import '../../styles/auth.css';
import { IMAGES } from '../../assets/images';

// Import the Supabase client instance
import { supabase } from '../../utils/supabase/client'; // Adjust this path if needed

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    // Basic DOB sanity check: must not be in the future and year >= 1900
    if (dob) {
      const d = new Date(dob);
      const today = new Date();
      if (d > today || d.getFullYear() < 1900) {
        setError('Please enter a valid date of birth');
        setLoading(false);
        return;
      }
    }

    try {
      // Use Supabase's signUp method
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // Pass extra data to be stored in the 'profiles' table
          data: {
            full_name: name,
            gender: gender,
            date_of_birth: dob,
          }
        }
      });

      // Check if Supabase returned an error
      if (error) {
        throw error;
      }

      // Handle the case where email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
         setSuccessMessage('Signup successful! Please check your email to verify your account.');
      } else {
        // This case is for when email confirmation is disabled.
        // The user is logged in immediately.
        router.refresh();
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup.');
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
          
          {/* Display error or success messages */}
          {error && <div className="auth-error">{error}</div>}
          {successMessage && <div className="auth-success">{successMessage}</div>}

          <form className="auth-form" onSubmit={handleSignup}>
            <div className="grid-2">
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <select value={gender} onChange={e => setGender(e.target.value)} aria-label="Gender">
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option> {/* Adjusted from Non-binary to match DB constraint */}
                <option>Prefer not to say</option>
              </select>
            </div>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <div className="grid-2">
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
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