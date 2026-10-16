'use client';

import { useState } from 'react';

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
}

export default function LikeButton({ slug, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    // Optimistic UI update
    setLikes((prev) => prev + 1);
    setLiked(true);

    try {
      const res = await fetch(`/api/posts/${slug}/like`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.likes !== undefined) {
        setLikes(data.likes);
      }
    } catch (err) {
      console.error('Failed to register like:', err);
      // Revert if error
      setLikes((prev) => Math.max(0, prev - 1));
      setLiked(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`btn ${liked ? 'btn-primary' : 'btn-secondary'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: liked ? 'default' : 'pointer',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
}
