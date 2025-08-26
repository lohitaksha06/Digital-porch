"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import '../../styles/main.css';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // If auth is done loading and there's no user, redirect to login
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener in AuthProvider will handle the state update
    router.push('/'); // Redirect to home after sign out
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return null; // or a message telling them they are being redirected
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content-area" style={{ maxWidth: '600px', margin: 'auto' }}>
          <h1>Profile</h1>
          <p>You are logged in with the following email address:</p>
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '1rem 0' }}>
            {user.email}
          </p>
          <Button onClick={handleSignOut} variant="primary">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;