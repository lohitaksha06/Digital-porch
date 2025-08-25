import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import '../styles/main.css';

const HomePage: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <h1>Welcome to the Digital Porch</h1>
          <p className="subtitle">A place to share your stories and connect with others.</p>
          
          <div className="create-blog-section">
            <h2>Have a story to tell?</h2>
            <Button>Start Now</Button>
          </div>

          <h2 className="blog-section-title">Featured Blogs</h2>
          <div className="blog-feed">
            {/* Placeholder Blog Posts */}
            <div className="blog-post-card">
              <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Blog post" className="card-image" />
              <div className="card-content">
                <h3>The Art of Storytelling</h3>
                <p>Discover how to captivate your audience with compelling narratives.</p>
                <div className="card-footer">
                  <span>By Amelia Chen</span>
                  <span>June 12, 2024</span>
                </div>
              </div>
            </div>
            <div className="blog-post-card">
              <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Blog post" className="card-image" />
              <div className="card-content">
                <h3>A Developer's Journey</h3>
                <p>From "Hello World" to building scalable applications. A tale of perseverance.</p>
                <div className="card-footer">
                  <span>By Ben Carter</span>
                  <span>May 28, 2024</span>
                </div>
              </div>
            </div>
            <div className="blog-post-card">
              <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80" alt="Blog post" className="card-image" />
              <div className="card-content">
                <h3>Mindfulness in the Digital Age</h3>
                <p>Finding balance and focus in a world of constant distractions.</p>
                <div className="card-footer">
                  <span>By Chloe Davis</span>
                  <span>April 15, 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
