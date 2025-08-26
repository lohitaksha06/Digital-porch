"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import '../../styles/main.css';
import { API_BASE } from '../../services/api';

type Blog = { id: number; title: string; content: string; createdAt: string; imageUrl?: string; tags?: string };

const SearchPage: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get('q') || '';
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Blog[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!q.trim()) { setResults([]); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/blogs/search?q=${encodeURIComponent(q)}`);
        const data = res.ok ? await res.json() : [];
        setResults(data);
      } finally { setLoading(false); }
    };
    run();
  }, [q]);

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <h1 style={{ margin: 0 }}>Search results</h1>
          <p className="subtitle">for “{q}”</p>

          {loading ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: '1rem' }}>Searching…</div>
          ) : results.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div className="blog-title">No results found</div>
              <p className="blog-excerpt" style={{ marginTop: 8 }}>Try a different title or keyword.</p>
              <button className="btn primary" onClick={() => router.push('/')}>Go back to Home</button>
            </div>
          ) : (
            <div className="blog-feed">
              {results.map((b) => (
                <div className="blog-post-card" key={b.id}>
                  {b.imageUrl && <img src={b.imageUrl} alt="cover" className="card-image" />}
                  <div className="card-content">
                    <h3>{b.title}</h3>
                    <p>{(b.content || '').slice(0, 160)}{(b.content || '').length > 160 ? '…' : ''}</p>
                    <div className="card-footer">
                      <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                      <span>{b.tags}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;