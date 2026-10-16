'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 800,
            letterSpacing: '1px',
            fontSize: '1.15rem',
            fontFamily: 'var(--font-display)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.9rem',
              height: '1.9rem',
              borderRadius: '6px',
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 900,
            }}
          >
            ⚡
          </span>
          <span>CHRONICLE</span>
          <span
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              color: 'var(--accent)',
              padding: '0.15rem 0.4rem',
              backgroundColor: 'var(--accent-light)',
              borderRadius: '4px',
            }}
          >
            v2.0
          </span>
        </Link>

        {/* Links & Auth Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: pathname === '/' ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            Blog
          </Link>

          <Link
            href="/about"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: pathname === '/about' ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            About
          </Link>

          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link href="/posts/new" className="btn btn-primary btn-sm">
                    <span>+ New Post</span>
                  </Link>

                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      padding: '0.3rem 0.6rem',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    👤 {user.name}
                  </span>

                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link href="/login" className="btn btn-secondary btn-sm">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
