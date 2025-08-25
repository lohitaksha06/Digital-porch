import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import '../../styles/main.css';

const NewBlogPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
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
