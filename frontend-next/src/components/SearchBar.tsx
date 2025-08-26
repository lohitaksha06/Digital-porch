"use client";
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

type Props = {
  initial?: string;
  onSearch: (q: string) => void;
};

const SearchBar: React.FC<Props> = ({ initial = '', onSearch }) => {
  const [q, setQ] = useState(initial);
  const submit = () => onSearch(q.trim());
  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="Search blogs by title..."
        className="search-bar"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        aria-label="Search blogs"
      />
      <button className="search-icon-btn" aria-label="Search" title="Search" onClick={submit}>
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;