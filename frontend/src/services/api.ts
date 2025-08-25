const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export type AuthResponse = {
  token: string;
  name: string;
  email: string;
};

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Signup failed');
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }
  return res.json();
}

export function saveToken(token: string) {
  if (!token) localStorage.removeItem('dp_token');
  else localStorage.setItem('dp_token', token);
}

export function clearToken() {
  localStorage.removeItem('dp_token');
}

export function getToken(): string | null {
  return localStorage.getItem('dp_token');
}

export function authHeader(): HeadersInit {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// User profile helpers
const USER_KEY = 'dp_user';
export function saveUser(u: { name: string; email: string }) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}

export function getUser(): { name: string; email: string } | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
