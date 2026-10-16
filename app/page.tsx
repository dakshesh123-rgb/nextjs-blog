'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  authorName: string;
  likes: number;
  views: number;
  readTime: number;
  createdAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedTag) params.append('tag', selectedTag);

      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, selectedTag]);

  // Extract all distinct tags from posts for quick filtering
  const availableTags = [
    'NextJS',
    'MongoDB',
    'React',
    'FullStack',
    'Systems',
    'Physics',
    'Philosophy',
  ];

  return (
    <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></span>
          <span>FULL-STACK MERN BLOG PLATFORM</span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            color: 'var(--text-primary)',
            maxWidth: '850px',
            margin: '0 auto 1.25rem',
          }}
        >
          Engineering ideas, code architectures &amp; computational systems.
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
          }}
        >
          A full-stack blog built with Next.js, React, Mongoose, and MongoDB. Browse articles, leave comments, register an account, and publish your own thoughts.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/posts/new" className="btn btn-primary">
            <span>Write a Post</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/about" className="btn btn-secondary">
            <span>About Architecture</span>
          </Link>
        </div>
      </section>

      {/* Search and Filters */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        availableTags={availableTags}
      />

      {/* Posts Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {selectedTag ? `Tagged: #${selectedTag}` : searchTerm ? `Search: "${searchTerm}"` : 'Latest Articles'}
          </h2>
          <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading articles...
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
              No articles found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {searchTerm || selectedTag
                ? 'Try adjusting your search terms or clearing the selected tag filter.'
                : 'There are no posts published yet. Be the first to share an article!'}
            </p>
            <Link href="/posts/new" className="btn btn-primary btn-sm">
              Publish First Post
            </Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post._id} className="post-card">
                <div className="post-card-body">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="post-card-title">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="post-card-excerpt">{post.excerpt}</p>

                  <div className="post-card-footer font-mono">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>👤 {post.authorName}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span>⏱️ {post.readTime}m read</span>
                      <span>❤️ {post.likes}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
