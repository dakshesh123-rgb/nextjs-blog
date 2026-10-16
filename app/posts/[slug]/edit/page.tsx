'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      try {
        setLoading(true);

        // Check user session
        let userObj = null;
        try {
          const authRes = await fetch('/api/auth/me');
          if (authRes.ok) {
            const authData = await authRes.json();
            userObj = authData.user;
            setCurrentUser(userObj);
          }
        } catch {
          // not authenticated
        }

        if (!userObj) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        // Fetch post to edit
        const postRes = await fetch(`/api/posts/${slug}`);
        const postData = await postRes.json();

        if (!postRes.ok) {
          throw new Error(postData.error || 'Failed to load post');
        }

        const post = postData.post;

        // Check author authorization
        const authorId = post.author?._id || post.author;
        if (String(authorId) !== String(userObj.id)) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        // Populate fields
        setTitle(post.title || '');
        setContent(post.content || '');
        setExcerpt(post.excerpt || '');
        setCoverImage(post.coverImage || '');
        setTagsInput(post.tags ? post.tags.join(', ') : '');
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'Failed to update post');
      }

      router.push(`/posts/${slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading post editor...
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingTop: '6rem', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛔</div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You must be logged in as the author of this post to edit it.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href={`/posts/${slug}`} className="btn btn-secondary">
              View Post
            </Link>
            <Link href="/login" className="btn btn-primary">
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '820px', paddingTop: '3.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href={`/posts/${slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          ← Cancel and return to post
        </Link>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
            }}
          >
            Edit Blog Post
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Modify your content and save changes to update the live MongoDB document.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Post Title <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scaling Quantum Wave Solvers on ARM64"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">
              Short Excerpt (Optional)
            </label>
            <input
              id="excerpt"
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary for previews and search cards"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage" className="form-label">
              Cover Image URL (Optional)
            </label>
            <input
              id="coverImage"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags (Comma separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="NextJS, MongoDB, React, Tutorial"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Post Content <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in plain text or markdown..."
              rows={14}
              required
              className="form-textarea"
              style={{ minHeight: '300px', lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
              {saving ? 'Saving Changes...' : 'Save & Update Post'}
            </button>
            <Link href={`/posts/${slug}`} className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
