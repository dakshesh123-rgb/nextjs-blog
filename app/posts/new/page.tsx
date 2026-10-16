'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Please provide both a title and content.');
      return;
    }

    setLoading(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim(),
          coverImage: coverImage.trim(),
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      router.push(`/posts/${data.post.slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingTop: '5rem', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>
            Authentication Required
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You need to be logged into an account to write and publish blog articles.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login" className="btn btn-primary">
              Log In
            </Link>
            <Link href="/register" className="btn btn-secondary">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '850px', paddingTop: '3.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &larr; Back to articles
        </Link>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.25rem',
            fontWeight: 800,
            marginTop: '0.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Create New Article
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Publishing as <strong>{user.name}</strong>
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.25rem',
        }}
      >
        <div className="form-group">
          <label className="form-label">Article Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Asymmetric Quantum Barrier Tunneling in Python"
            required
            className="form-input"
            style={{ fontSize: '1.1rem', fontWeight: 600 }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Short Excerpt (Optional)</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A quick 1-2 sentence preview for cards and search..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="NextJS, MongoDB, FullStack, Physics"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image URL (Optional)</label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/cover.jpg"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Article Content (Markdown supported) *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article thoughts, equations, or code here..."
            rows={14}
            required
            className="form-textarea"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.7 }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <Link href="/" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
