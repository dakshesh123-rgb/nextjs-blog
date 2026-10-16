'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';

interface PostDetail {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  author: string;
  authorName: string;
  likes: number;
  views: number;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      try {
        setLoading(true);
        // Load current user
        try {
          const authRes = await fetch('/api/auth/me');
          if (authRes.ok) {
            const authData = await authRes.json();
            setCurrentUser(authData.user || null);
          }
        } catch {
          setCurrentUser(null);
        }

        // Load post
        const res = await fetch(`/api/posts/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch post');
        }

        setPost(data.post);
      } catch (err: any) {
        setError(err.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete post');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Could not delete post');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Loading post...</div>
        <div style={{ fontSize: '0.875rem' }}>Fetching from MongoDB</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ maxWidth: '600px', padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>Post Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {error || 'The post you are looking for does not exist or has been removed.'}
          </p>
          <Link href="/" className="btn btn-primary">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor =
    currentUser &&
    (String(post.author) === String(currentUser.id) ||
      String((post.author as any)?._id) === String(currentUser.id));

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="container" style={{ maxWidth: '840px', paddingTop: '3rem', paddingBottom: '5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ← Back to all posts
        </Link>
      </div>

      {/* Header tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Title */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
        }}
      >
        {post.title}
      </h1>

      {/* Author and Metadata Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '1.75rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              border: '1px solid rgba(249, 115, 22, 0.25)',
            }}
          >
            {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.authorName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem' }}>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{post.readTime || 1} min read</span>
              <span>•</span>
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>

        {/* Authorized author actions */}
        {isAuthor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href={`/posts/${post.slug}/edit`}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Post
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-danger btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div
          style={{
            width: '100%',
            maxHeight: '440px',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2.5rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Excerpt callout */}
      {post.excerpt && (
        <div
          style={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            borderLeft: '3px solid var(--accent)',
            paddingLeft: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {post.excerpt}
        </div>
      )}

      {/* Post Content Body */}
      <div
        style={{
          color: 'var(--text-primary)',
          fontSize: '1.05rem',
          lineHeight: 1.8,
          marginBottom: '3.5rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {post.content}
      </div>

      {/* Engagement bar (Likes & Share) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '3.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LikeButton slug={post.slug} initialLikes={post.likes || 0} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Enjoyed this post? Give it a thumbs up!
          </span>
        </div>

        <button
          onClick={handleShare}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {copied ? 'Copied Link! ✓' : 'Share'}
        </button>
      </div>

      {/* Author Bio Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '3.5rem',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.4rem',
            border: '2px solid rgba(249, 115, 22, 0.3)',
            flexShrink: 0,
          }}
        >
          {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Written by {post.authorName}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Published on this full-stack Next.js + MongoDB publication platform.
          </div>
        </div>
      </div>

      {/* Discussion comments thread */}
      <CommentSection slug={post.slug} currentUserName={currentUser?.name} />
    </article>
  );
}
