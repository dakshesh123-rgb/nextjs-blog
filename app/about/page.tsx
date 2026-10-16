import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '4rem', maxWidth: '850px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span
          className="font-mono"
          style={{
            color: 'var(--accent)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '1px',
          }}
        >
          // ABOUT THE PLATFORM
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginTop: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          Engineering the Chronicle Blog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Chronicle is a full-stack blogging system built from scratch to meet and exceed the Hack Club Stardance challenge requirements using modern React, Next.js App Router, Mongoose, and MongoDB.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
            🛠️ Full-Stack Technology Stack
          </h2>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>
              <strong>Frontend Framework:</strong> Next.js 14 with React 18, utilizing the Next.js App Router for server and client components.
            </li>
            <li>
              <strong>Database &amp; Modeling:</strong> MongoDB managed via Mongoose 8 with global connection caching for serverless environments.
            </li>
            <li>
              <strong>Authentication Engine:</strong> Secure custom account system with bcrypt password hashing and HTTP-only JWT session cookies.
            </li>
            <li>
              <strong>Original Styling:</strong> Pure CSS design using custom CSS variables (Obsidian dark &amp; warm paper light themes) with zero bloated UI libraries.
            </li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
            🚀 Extended Features Implemented (&gt;3 from the Guide)
          </h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <strong>1. Instant Global Search &amp; Tag Filters:</strong> Real-time filtering across titles, excerpts, and tags on the homepage.
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <strong>2. Interactive Likes &amp; Reaction Counter:</strong> Optimistic UI upvote engine that persists like counts directly in MongoDB.
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <strong>3. Comments &amp; Discussion Threads:</strong> Community comments system supporting both registered user attribution and reader participation.
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <strong>4. Dynamic Theme Switcher:</strong> Dark and light mode toggle with local storage persistence and smooth CSS transitions.
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <strong>5. Human-Readable Slugs &amp; Reading Time:</strong> Automatic SEO slug generation (`/posts/[slug]`) and estimated reading time calculation.
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
            🔒 Security &amp; Safe Development
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            No secrets, API keys, or database credentials are ever committed to the repository. The project uses `.env.local` for local secrets, provides a documented `.env.example`, and enforces strict `.gitignore` rules.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/" className="btn btn-primary">
          Browse Blog Articles
        </Link>
        <Link href="/register" className="btn btn-secondary">
          Create an Account
        </Link>
      </div>
    </div>
  );
}
