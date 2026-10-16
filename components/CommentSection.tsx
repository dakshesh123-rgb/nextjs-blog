'use client';

import { useState, useEffect } from 'react';

interface CommentItem {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  slug: string;
  currentUserName?: string;
}

export default function CommentSection({ slug, currentUserName }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [authorName, setAuthorName] = useState(currentUserName || '');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName.trim() || 'Curious Reader',
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      setContent('');
      fetchComments();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-color)' }}>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
        }}
      >
        Discussion ({comments.length})
      </h3>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {!currentUserName && (
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Ada Lovelace"
              className="form-input"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Add to the conversation</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your perspective or ask a question..."
            rows={3}
            required
            className="form-textarea"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="btn btn-primary"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem' }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  💬 {comment.authorName}
                </span>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
