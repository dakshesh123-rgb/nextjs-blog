import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="container"
      style={{
        maxWidth: '640px',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 2rem',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: '2rem',
            marginBottom: '1.5rem',
            fontWeight: 800,
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '460px',
            margin: '0 auto 2rem',
          }}
        >
          The article or page you are looking for doesn't exist, has been removed, or the link may be mistyped.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            ← Back to Homepage
          </Link>
          <Link href="/about" className="btn btn-secondary">
            About This Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
