import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import '../../styles/main.css';

const NewBlogPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

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
              <button className="btn primary">Publish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBlogPage;
