import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '2.5rem 0',
        marginTop: '4rem',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              marginBottom: '0.25rem',
            }}
          >
            CHRONICLE // FULL-STACK BLOG
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Built with Next.js, React, Mongoose, and MongoDB for Hack Club Stardance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Home
          </Link>
          <Link href="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            About
          </Link>
          <a
            href="https://stardance.hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}
          >
            Hack Club Stardance
          </a>
        </div>
      </div>
    </footer>
  );
}
