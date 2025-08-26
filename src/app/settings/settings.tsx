"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import '../../styles/main.css';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext'; // Use the central Auth context

// This type now perfectly matches the database columns
type Profile = {
  display_name: string;
  gender: string;
  dob: string;
  bio: string;
  tags: string;
};

const SettingsPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth(); // Use context for user state
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const loadProfile = async () => {
        const { data: p, error } = await supabase
          .from('profiles')
          .select('display_name, gender, dob, bio, tags')
          .eq('id', user.id)
          .single(); // .single() is better here

        if (p) {
          setProfile({
            display_name: p.display_name || user.email?.split('@')[0] || '',
            gender: p.gender || '',
            dob: p.dob || '',
            bio: p.bio || '',
            tags: p.tags || '',
          });
        } else {
          // If no profile exists yet, create a default state
          setProfile({
            display_name: user.email?.split('@')[0] || '',
            gender: '', dob: '', bio: '', tags: '',
          });
        }
      };
      loadProfile();
    }
  }, [user, isAuthLoading, router, supabase]);

  const updateField = (k: keyof Profile, v: string) => setProfile(p => (p ? { ...p, [k]: v } : p));

  const onSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    setStatus(null);

    const payload = {
      id: user.id,
      display_name: profile.display_name,
      gender: profile.gender || null,
      dob: profile.dob || null,
      bio: profile.bio || null,
      tags: profile.tags || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(payload);

    if (error) {
      setStatus({ type: 'error', message: `Save failed: ${error.message}` });
    } else {
      setStatus({ type: 'success', message: 'Saved successfully!' });
    }
    setSaving(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const onChangePassword = async () => {
    setStatus(null);
    if (!newPassword) return setStatus({ type: 'error', message: 'Enter a new password' });
    if (newPassword.length < 6) return setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
    if (newPassword !== confirmPassword) return setStatus({ type: 'error', message: 'Passwords do not match' });

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setTimeout(() => setStatus(null), 3000);
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isAuthLoading || !profile) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content"><Sidebar /><div className="content-area"><p>Loading…</p></div></div>
      </div>
    );
  }

  // --- Your JSX is preserved below, with only functional changes ---
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <h1>Settings</h1>
          <div className="settings-card">
            <div className="settings-row">
              <div className="avatar-upload">
                <div className="avatar-lg" style={{ background: '#e5e7eb' }} />
                <small style={{ color: '#6b7280' }}>Avatar (default)</small>
              </div>
              <div className="settings-fields">
                <label>Username</label>
                <input type="text" value={profile.display_name} onChange={e => updateField('display_name', e.target.value)} />

                <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                  <label style={{ marginBottom: -4 }}>Change Password</label>
                  <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <div>
                    <Button variant="secondary" onClick={onChangePassword}>Update Password</Button>
                  </div>
                </div>

                <label>Gender</label>
                <select value={profile.gender || ''} onChange={e => updateField('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <label>Date of birth</label>
                <input type="date" value={profile.dob || ''} onChange={e => updateField('dob', e.target.value)} />

                <label>Tags (comma separated)</label>
                <input type="text" value={profile.tags || ''} onChange={e => updateField('tags', e.target.value)} placeholder="e.g., tech, life, tips" />
              </div>
            </div>

            <label>Bio</label>
            <textarea rows={5} value={profile.bio || ''} onChange={e => updateField('bio', e.target.value)} />

            <div className="editor-actions">
              {/* This is the main Save Changes button from your design */}
              <Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>

            {/* Status message appears here */}
            {status && (
              <div className={status.type === 'success' ? 'auth-success' : 'auth-error'} style={{ marginTop: '1rem' }}>
                {status.message}
              </div>
            )}

            {/* Log out button from your design */}
            <div className="editor-actions" style={{ marginTop: '1rem', justifyContent: 'flex-start' }}>
              <Button variant="secondary" onClick={onLogout}>Log out</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;