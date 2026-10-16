'use client';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTag: string;
  onTagSelect: (tag: string) => void;
  availableTags: string[];
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedTag,
  onTagSelect,
  availableTags,
}: SearchBarProps) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Search Bar Input */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search blog posts by title, keywords, or topics..."
          className="form-input"
          style={{
            paddingLeft: '2.75rem',
            fontSize: '1rem',
            height: '3.25rem',
            borderRadius: 'var(--radius-lg)',
          }}
        />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Tag Filtering Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <span
          className="font-mono"
          style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}
        >
          FILTER:
        </span>
        <button
          onClick={() => onTagSelect('')}
          className={`btn btn-sm ${selectedTag === '' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
        >
          All Posts
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag === selectedTag ? '' : tag)}
            className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
