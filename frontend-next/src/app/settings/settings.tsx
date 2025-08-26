"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import '../../styles/main.css';
import { authHeader, getUser, saveUser, StoredUser } from '../../services/api';

type Profile = StoredUser & { avatarUrl?: string; preferences?: string[] };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8081';

const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(getUser() as Profile | null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // refresh from backend
    fetch(`${API_BASE}/api/user/me`, { headers: { ...authHeader() } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: any) => {
        const pref = typeof data.preferences === 'string' ? data.preferences.split(',').map((s: string) => s.trim()).filter(Boolean) : (data.preferences || []);
        const merged: Profile = { ...(getUser() as any), ...data, preferences: pref } as Profile;
        setProfile(merged);
        saveUser({ name: merged.name, email: merged.email, avatarUrl: merged.avatarUrl });
      })
      .catch(() => {/* ignore if not logged */});
  }, []);

  const updateField = (k: keyof Profile, v: string) => setProfile(p => p ? { ...p, [k]: v } as Profile : p);

  const onSave = async () => {
    if (!profile) return;
    setSaving(true); setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/api/user/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          name: profile.name,
          avatarUrl: profile.avatarUrl || '',
          about: profile.about || '',
          gender: profile.gender || '',
          preferences: (profile.preferences || []).join(',')
        })
      });
      if (!res.ok) throw new Error('Save failed');
  saveUser({ name: profile.name, email: profile.email, avatarUrl: profile.avatarUrl });
      setStatus('Saved');
    } catch (e: any) {
      setStatus(e.message || 'Save failed');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 2000);
    }
  };

  if (!profile) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content"><Sidebar /><div className="content-area"><p>Please login to manage settings.</p></div></div>
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
                <img className="avatar-lg" src={profile.avatarUrl || 'https://i.pravatar.cc/120'} alt="avatar" />
                <input type="url" placeholder="Avatar image URL" value={profile.avatarUrl || ''} onChange={e => updateField('avatarUrl', e.target.value)} />
              </div>
              <div className="settings-fields">
                <label>Display name</label>
                <input type="text" value={profile.name} onChange={e => updateField('name', e.target.value)} />
                <label>Gender</label>
                <select value={profile.gender || ''} onChange={e => updateField('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
                <label>Blog preferences (comma separated)</label>
                <input type="text" value={(profile.preferences || []).join(',')} onChange={e => updateField('preferences', e.target.value.split(',').map(s => s.trim()).filter(Boolean) as any)} />
              </div>
            </div>
            <label>About</label>
            <textarea rows={5} value={profile.about || ''} onChange={e => updateField('about', e.target.value)} />

            <div className="editor-actions">
              <Button variant="secondary" onClick={() => setPwdOpen(v => !v)}>{pwdOpen ? 'Cancel' : 'Change Password'}</Button>
              <Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
            {status && <div className="auth-error" style={{ marginTop: '1rem' }}>{status}</div>}
            {pwdOpen && (
              <div style={{ marginTop: '1rem' }}>
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <div className="editor-actions" style={{ justifyContent: 'flex-start' }}>
                  <Button onClick={async () => {
                    setStatus(null);
                    try {
                      const res = await fetch(`${API_BASE}/api/user/change-password`, {
                        method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() },
                        body: JSON.stringify({ currentPassword, newPassword })
                      });
                      if (!res.ok) throw new Error('Change password failed');
                      setStatus('Password updated'); setPwdOpen(false); setCurrentPassword(''); setNewPassword('');
                    } catch (e: any) { setStatus(e.message || 'Change password failed'); }
                  }}>Update Password</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
