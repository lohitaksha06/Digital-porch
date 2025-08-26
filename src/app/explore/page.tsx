"use client";
import React, { useMemo, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import '../../styles/main.css';
import { IMAGES } from '../../assets/images';

type Card = { id: string; title: string; sub: string; img: string };

const mk = (n: number, prefix: string): Card[] =>
  Array.from({ length: n }).map((_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${prefix} ${i + 1}`,
    sub: i % 2 ? '2 min read' : 'by @someone',
  img: IMAGES[i % IMAGES.length]
  }));

const ExplorePage: React.FC = () => {
  const topCards = useMemo(() => mk(12, 'Top Content'), []);
  const hobbyCards = useMemo(() => mk(12, 'Hobby Blog'), []);
  const yourCards = useMemo(() => mk(8, 'Your Blog'), []);

  const r1 = useRef<HTMLDivElement | null>(null);
  const r2 = useRef<HTMLDivElement | null>(null);
  const r3 = useRef<HTMLDivElement | null>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 1 | -1) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * 480, behavior: 'smooth' });
  };

  const renderRow = (title: string, cards: Card[], ref: React.RefObject<HTMLDivElement | null>) => (
    <div className="row-section">
      <div className="row-header">
        <div className="row-title">{title}</div>
      </div>
      <div className="row-scroller">
        <button className="row-arrow left" onClick={() => scroll(ref, -1)} aria-label="scroll left"><FaChevronLeft /></button>
        <div className="row-scroll" ref={ref}>
          {cards.map((c) => (
            <div key={c.id} className="blog-post-card" style={{ width: 260 }}>
              <img src={c.img} alt="card" className="card-image" />
              <div className="card-content">
                <h3 style={{ fontSize: '1.05rem' }}>{c.title}</h3>
                <div className="card-footer"><span>{c.sub}</span><span>tags</span></div>
              </div>
            </div>
          ))}
        </div>
        <button className="row-arrow right" onClick={() => scroll(ref, 1)} aria-label="scroll right"><FaChevronRight /></button>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <h1 style={{ margin: 0 }}>Explore</h1>
          <p className="subtitle">Jump into fresh posts across the porch.</p>
          {renderRow('Top Content', topCards, r1)}
          {renderRow('Hobby Blogs', hobbyCards, r2)}
          {renderRow('Your Blogs', yourCards, r3)}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;