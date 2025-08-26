"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import '../../styles/main.css';

// Import the client-side Supabase client and our new auth hook
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';

const NewBlogPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth(); // Use the auth hook
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('google.com');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Protect the page: redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const handlePublish = async () => {
    if (!user) {
      setError("You must be logged in to publish a post.");
      return;
    }
    if (!title) {
      setError("Title is required.");
      return;
    }

    setLoading(true);
    setError(null);

    const postData = {
      user_id: user.id,
      title: title,
      content: content,
    };

    const { error: insertError } = await supabase.from('posts').insert(postData);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/dashboard'); // Redirect to the blog feed on success
    }
  };

  // Show a loading state while checking auth
  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

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
            {/* ... your form JSX remains the same ... */}
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