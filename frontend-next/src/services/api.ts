export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8081';

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
  if (typeof window === 'undefined') return;
  if (!token) localStorage.removeItem('dp_token');
  else localStorage.setItem('dp_token', token);
}

export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('dp_token');
}

export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('dp_token') : null;
}

export function authHeader(): HeadersInit {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// User profile helpers
const USER_KEY = 'dp_user';
export type StoredUser = {
  name: string;
  email: string;
  avatarDataUrl?: string; // base64 data URL
  avatarUrl?: string; // optional URL
  gender?: string;
  about?: string;
  preferences?: string[];
};

export function saveUser(u: Partial<StoredUser>) {
  if (typeof window === 'undefined') return;
  const prev = getUser();
  const next: StoredUser = { name: prev?.name || '', email: prev?.email || '', ...prev, ...u } as StoredUser;
  localStorage.setItem(USER_KEY, JSON.stringify(next));
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearUser() {
  if (typeof window !== 'undefined') localStorage.removeItem(USER_KEY);
}

export type Blog = { id: number; title: string; content: string; tags?: string; createdAt: string; imageUrl?: string };
export async function fetchMyBlogs(): Promise<Blog[]> {
  const res = await fetch(`${API_BASE}/api/blogs/me`, { headers: { ...authHeader() } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAllBlogs(): Promise<Blog[]> {
  const res = await fetch(`${API_BASE}/api/blogs`);
  if (!res.ok) return [];
  return res.json();
}
