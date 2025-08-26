"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Button from '../../../components/Button';
import '../../../styles/main.css';

const demos: Record<string, { title: string; content: string; tags: string[]; author: string; image: string }> = {
  '1': {
    title: 'The Art of Storytelling',
    content: 'Discover how to captivate your audience with compelling narratives. This is a playful demo post. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at pulvinar risus. Etiam vitae libero non sem egestas porta.',
    tags: ['featured', 'writing', 'creativity'],
    author: 'Amelia Chen',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1170&auto=format&fit=crop'
  },
  '2': {
    title: "A Developer's Journey",
    content: 'From "Hello World" to scalable apps — a tale of perseverance. This is only a demo :) Vivamus laoreet, nibh quis bibendum hendrerit, eros justo pretium arcu, et feugiat arcu felis vitae leo.',
    tags: ['dev', 'tips', 'journey'],
    author: 'Ben Carter',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop'
  },
  '3': {
    title: 'Mindfulness in the Digital Age',
    content: 'Finding balance and focus in a world of constant distractions. Demo post for fun. Quisque sagittis, arcu non cursus dictum, urna odio finibus sem, ac luctus massa arcu in quam.',
    tags: ['life', 'focus', 'wellness'],
    author: 'Chloe Davis',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1172&auto=format&fit=crop'
  }
};

export default function DemoBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '1';
  const demo = demos[id] || demos['1'];

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content-area">
          <Button variant="secondary" className="back-button" onClick={() => router.push('/')}>Back</Button>
          <div className="blog-post-card" style={{ maxWidth: 920, margin: '0 auto' }}>
            <img src={demo.image} alt="cover" className="card-image" />
            <div className="card-content">
              <h3>{demo.title}</h3>
              <p>{demo.content}</p>
              <div className="card-footer">
                <span>By {demo.author}</span>
                <span>
                  {demo.tags.map((t) => (
                    <span key={t} className="tag" style={{ marginLeft: 8 }}>{t}</span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
