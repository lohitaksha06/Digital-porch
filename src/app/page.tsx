"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { IMAGES } from '../assets/images';
import { getUser, type StoredUser } from '../services/api';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
  const router = useRouter();
  const supabase = createClient();
  const { user: authUser } = useAuth();
  type Blog = { id: number | string; title: string; content: string; tags?: string; createdAt: string; imageUrl?: string };
  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getUser());

    // Fetch latest blogs from Supabase
    const loadLatest = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .order('created_at', { ascending: false })
        .limit(8);
      if (!error && data) {
        setAllBlogs(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            content: p.content || '',
            createdAt: p.created_at,
          }))
        );
      } else {
        setAllBlogs([]);
      }
    };

    // Fetch blogs for the current logged-in user (if any)
    const loadMine = async () => {
      if (!authUser) {
        setMyBlogs([]);
        return;
      }
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setMyBlogs(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            content: p.content || '',
            createdAt: p.created_at,
          }))
        );
      } else {
        setMyBlogs([]);
      }
    };

    loadLatest();
    loadMine();
    // Re-run when auth user changes so "Your Blogs" updates after login/logout
  }, [supabase, authUser]);
  
  const avatarInitial = (user?.name || 'B').trim().charAt(0).toUpperCase();

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="greeting">
            {(() => { const src = user?.avatarDataUrl || user?.avatarUrl || '/default-avatar.svg'; 
              return <img className="avatar-md" src={src} alt="avatar" />; })()}
            <h1 style={{ margin: 0 }}>
              {user?.name ? `Welcome back, ${user.name}` : 'Welcome to the Digital Porch'}
            </h1>
          </div>
          <p className="subtitle">A place to share your stories and connect with others.</p>
          
          <div className="create-blog-section">
            <h2>Have a story to tell?</h2>
            <Button onClick={() => router.push('/newblog')}>Start Now</Button>
          </div>

          <h2 className="blog-section-title">Featured Blogs</h2>
          <div className="blog-feed">
            {/* Nice placeholder cards */}
            <div className="blog-post-card" onClick={() => router.push('/demo/1')}>
              <img src={IMAGES[0]} alt="Blog post" className="card-image" />
              <div className="card-content">
                <h3>The Art of Storytelling</h3>
                <p>Discover how to captivate your audience with compelling narratives.</p>
                <div className="card-footer">
                  <span>By Amelia Chen</span>
                  <span>Tags: writing, creativity</span>
                </div>
              </div>
            </div>
            <div className="blog-post-card" onClick={() => router.push('/demo/2')}>
              <img src={IMAGES[1]} alt="Blog post" className="card-image" />
              <div className="card-content">
                <h3>A Developer's Journey</h3>
                <p>From "Hello World" to scalable apps. A tale of perseverance.</p>
                <div className="card-footer">
                  <span>By Ben Carter</span>
                  <span>Tags: dev, tips</span>
                </div>
              </div>
            </div>
            <div className="blog-post-card" onClick={() => router.push('/demo/3')}>
              <img src={IMAGES[2]} alt="Blog post" className="card-image" />
              <div className="card-content">
                <h3>Mindfulness in the Digital Age</h3>
                <p>Finding balance and focus in a world of constant distractions.</p>
                <div className="card-footer">
                  <span>By Chloe Davis</span>
                  <span>Tags: life, focus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Latest from DB */}
          <section className="featured-section">
            <h2 className="section-title">Latest blogs</h2>
            <div className="featured-grid">
        {(allBlogs.length ? allBlogs : myBlogs).slice(0, 8).map((b) => (
                   <div key={b.id} className="blog-card">
                     {b.imageUrl && (
                       <img src={b.imageUrl} alt="cover" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }} />
                     )}
                    <div className="blog-card-header">
          <div className="avatar avatar-sm">{avatarInitial}</div>
                      <div className="blog-meta">
                        <div className="blog-title">{b.title}</div>
                        <div className="blog-sub">{new Date(b.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="blog-excerpt">{b.content.length > 140 ? b.content.slice(0, 140) + '…' : b.content}</p>
                    <div className="tag-row">
          {b.tags?.split(',').filter(Boolean).slice(0, 3).map((t: string) => (
                        <span key={t} className="tag">{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {!allBlogs.length && !myBlogs.length && (
                  <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm">{avatarInitial}</div>
                      <div>
                        <div className="blog-title">No blogs yet</div>
                        <div className="blog-sub">Be the first to publish</div>
                      </div>
                    </div>
                    <p className="blog-excerpt" style={{ marginTop: 8 }}>Create your first post from the New Blog page to see it here.</p>
                  </div>
                )}
              </div>
            </section>

          <h2 className="blog-section-title" style={{ marginTop: '3rem' }}>Your Blogs</h2>
          {myBlogs.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              You haven’t posted anything yet. Click “Create Blog” to publish your first post.
            </div>
          ) : (
            <div className="blog-feed">
              {myBlogs.map((b) => (
                <div className="blog-post-card" key={b.id}>
                  {b.imageUrl && (
                    <img src={b.imageUrl} alt="cover" className="card-image" />
                  )}
                  <div className="card-content">
                    <h3>{b.title}</h3>
                    <p>{(b.content || '').slice(0, 160)}{(b.content || '').length > 160 ? '…' : ''}</p>
                    <div className="card-footer">
                      <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                      <span>{b.tags}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button className="btn secondary" onClick={async () => {
                        const title = prompt('Edit title', b.title);
                        if (!title || !authUser) return;
                        const { error } = await supabase
                          .from('posts')
                          .update({ title })
                          .eq('id', b.id)
                          .eq('user_id', authUser.id);
                        if (!error) {
                          setMyBlogs((prev) => prev.map(x => x.id === b.id ? { ...x, title } : x));
                        } else {
                          alert('Update failed: ' + error.message);
                        }
                      }}>Edit</button>
                      <button className="btn secondary" onClick={async () => {
                        if (!confirm('Delete this post?') || !authUser) return;
                        const { error } = await supabase
                          .from('posts')
                          .delete()
                          .eq('id', b.id)
                          .eq('user_id', authUser.id);
                        if (!error) {
                          setMyBlogs((prev) => prev.filter(x => x.id !== b.id));
                        } else {
                          alert('Delete failed: ' + error.message);
                        }
                      }}>Delete</button>
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
}
