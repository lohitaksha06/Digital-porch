import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import '../styles/main.css';
import { getUser, fetchMyBlogs, fetchAllBlogs, type Blog } from '../services/api';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchMyBlogs().then(setMyBlogs).catch(() => setMyBlogs([]));
    fetchAllBlogs().then(setAllBlogs).catch(() => setAllBlogs([]));
  }, []);
  const user = getUser();
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
            <Button onClick={() => navigate('/newblog')}>Start Now</Button>
          </div>

          <h2 className="blog-section-title">Featured Blogs</h2>
          <div className="blog-feed">
            {/* Nice placeholder cards */}
            <div className="blog-post-card" onClick={() => navigate('/demo/1')}>
              <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1170&auto=format&fit=crop" alt="Blog post" className="card-image" />
              <div className="card-content">
                <h3>The Art of Storytelling</h3>
                <p>Discover how to captivate your audience with compelling narratives.</p>
                <div className="card-footer">
                  <span>By Amelia Chen</span>
                  <span>Tags: writing, creativity</span>
                </div>
              </div>
            </div>
            <div className="blog-post-card" onClick={() => navigate('/demo/2')}>
              <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop" alt="Blog post" className="card-image" />
              <div className="card-content">
                <h3>A Developer's Journey</h3>
                <p>From "Hello World" to scalable apps. A tale of perseverance.</p>
                <div className="card-footer">
                  <span>By Ben Carter</span>
                  <span>Tags: dev, tips</span>
                </div>
              </div>
            </div>
            <div className="blog-post-card" onClick={() => navigate('/demo/3')}>
              <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1172&auto=format&fit=crop" alt="Blog post" className="card-image" />
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
                  <div className="blog-card">
                    <div className="blog-card-header">
          <div className="avatar avatar-sm">{avatarInitial}</div>
                      <div className="blog-meta">
                        <div className="blog-title">No blogs yet</div>
                        <div className="blog-sub">Be the first to publish</div>
                      </div>
                    </div>
                    <p className="blog-excerpt">Create your first post from the New Blog page to see it here.</p>
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

export default HomePage;
