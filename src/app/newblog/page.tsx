"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import '../../styles/main.css';

// Import the Supabase client
import { supabase } from '../../utils/supabase/client';

const NewBlogPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get the current logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to publish a post.");
      }

      // 2. Prepare the data for insertion
      const postData = {
        user_id: user.id,
        title: title,
        content: content,
        image_url: imageUrl || null, // Use null if the imageUrl is empty
        // Convert the comma-separated string of tags into an array
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      // 3. Insert the data into the 'posts' table
      const { error: insertError } = await supabase.from('posts').insert(postData);

      if (insertError) {
        throw insertError;
      }

      // 4. If successful, redirect to the dashboard to see the new post
      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content-area">
          <Button variant="secondary" className="back-button" onClick={() => router.push('/dashboard')}> 
            <FaArrowLeft /> Back to Dashboard
          </Button>

          <div className="editor">
            {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
            
            {/* ... (your image picker JSX remains unchanged) ... */}
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  width: '100%', height: 200, border: '2px dashed var(--border-color)', borderRadius: 12,
                  background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                  <div style={{ textAlign: 'center', color: '#6a1b9a', fontWeight: 600 }}>+ Add Cover Image</div>
                )}
              </div>
            </div>

            <input
              className="editor-title" type="text" placeholder="Enter a captivating title..."
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="editor-content" placeholder="Write your thoughts here..."
              value={content} onChange={(e) => setContent(e.target.value)} rows={16}
            />
            <input
              className="editor-tags" type="text"
              placeholder="Add tags (comma separated, e.g., tech, life, tips)"
              value={tags} onChange={(e) => setTags(e.target.value)}
            />
            <div className="editor-actions">
              <Button variant="secondary" disabled>Save Draft</Button> {/* Add functionality later */}
              <Button onClick={handlePublish} disabled={loading}>
                {loading ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBlogPage;