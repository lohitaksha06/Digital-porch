import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import '../../styles/main.css';
import { authHeader } from '../../services/api';

const NewBlogPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const publish = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081';
    const res = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ title, content, tags, imageUrl: imageUrl || undefined })
    });
    if (!res.ok) { alert('Publish failed'); return; }
    navigate('/');
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {/* Sidebar removed on create page for a distraction-free editor */}
        <div className="content-area">
          <Button variant="secondary" className="back-button" onClick={() => navigate('/')}> 
            <FaArrowLeft /> Back to Home
          </Button>

          <div className="editor">
            {/* Image picker */}
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  width: '100%',
                  height: 200,
                  border: '2px dashed var(--border-color)',
                  borderRadius: 12,
                  background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden'
                }}
                onClick={() => {
                  const url = prompt('Paste an image URL');
                  if (url) setImageUrl(url);
                }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#6a1b9a', fontWeight: 600 }}>+
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: 6, color: '#6a1b9a', fontWeight: 600 }}>Add image</div>
            </div>
            <input
              className="editor-title"
              type="text"
              placeholder="Enter a captivating title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="editor-content"
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
            />
            <input
              className="editor-tags"
              type="text"
              placeholder="Add tags (comma separated, e.g., tech, life, tips)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <div className="editor-actions">
              <button className="btn secondary">Save Draft</button>
              <button className="btn primary" onClick={publish}>Publish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBlogPage;
