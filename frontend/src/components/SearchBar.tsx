import React, { useState } from 'react';

type Props = {
  initial?: string;
  onSearch: (q: string) => void;
};

const SearchBar: React.FC<Props> = ({ initial = '', onSearch }) => {
  const [q, setQ] = useState(initial);
  const submit = () => onSearch(q.trim());
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        placeholder="Search blogs by title..."
        className="search-bar"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
      />
      <button className="nav-button primary" onClick={submit}>Go</button>
    </div>
  );
};

export default SearchBar;