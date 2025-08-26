"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import '../../styles/main.css';
import { saveUser } from '../../services/api';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type Profile = {
  name: string;
  gender?: string;
  dob?: string; // yyyy-mm-dd
  bio?: string;
  tags?: string; // comma separated
  avatarUrl?: string | null; // disabled feature
  email?: string;
};

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Try to load profile row
      const { data: p } = await supabase
        .from('profiles')
        .select('display_name, gender, dob, bio, tags, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      const next: Profile = {
        name: p?.display_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
        gender: p?.gender || '',
        dob: p?.dob || '',
        bio: p?.bio || '',
        tags: p?.tags || '',
        avatarUrl: p?.avatar_url || null,
        email: user.email || undefined,
      };
      setProfile(next);
    };
    load();
  }, [router, supabase]);

  const updateField = (k: keyof Profile, v: string) => setProfile(p => (p ? { ...p, [k]: v } : p));

  const onSave = async () => {
    if (!profile) return;
    setSaving(true); setStatus(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upsert to profiles table
      const payload = {
        id: user.id,
        display_name: profile.name,
        gender: profile.gender || null,
        dob: profile.dob || null,
        bio: profile.bio || null,
        tags: profile.tags || null,
        avatar_url: null as string | null, // disabled for now
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) throw error;

      // Optionally cache in local storage for Navbar/Sidebar display
      saveUser({ name: profile.name, email: profile.email || '' });
      setStatus('Saved');
    } catch (e: any) {
      setStatus(e.message || 'Save failed');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const onChangePassword = async () => {
    setStatus(null);
    if (!newPassword) return setStatus('Enter a new password');
    if (newPassword !== confirmPassword) return setStatus('Passwords do not match');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setStatus(error.message);
    else {
      setStatus('Password updated');
      setPwdOpen(false);
      setNewPassword(''); setConfirmPassword('');
    }
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!profile) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content"><Sidebar /><div className="content-area"><p>Loading…</p></div></div>
      </div>
    );
  }

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
                {/* Default circle with no image */}
                <div className="avatar-lg" style={{ background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                <input type="text" placeholder="Avatar upload disabled" value="" disabled />
                <small style={{ color: '#6b7280' }}>Avatar storage not configured. Using default.</small>
              </div>
              <div className="settings-fields">
                <label>Username</label>
                <input type="text" value={profile.name} onChange={e => updateField('name', e.target.value)} />

                <label>Gender</label>
                <select value={profile.gender || ''} onChange={e => updateField('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
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
              <Button variant="secondary" onClick={() => setPwdOpen(v => !v)}>{pwdOpen ? 'Cancel' : 'Change Password'}</Button>
              <Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
            {status && <div className="auth-error" style={{ marginTop: '1rem' }}>{status}</div>}

            {pwdOpen && (
              <div style={{ marginTop: '1rem' }}>
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <div className="editor-actions" style={{ justifyContent: 'flex-start' }}>
                  <Button onClick={onChangePassword}>Update Password</Button>
                </div>
              </div>
            )}

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
