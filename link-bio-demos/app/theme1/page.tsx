import Link from 'next/link'

export const metadata = {
  title: 'Theme 1: Glassmorphic Modern',
  description: 'A modern link-in-bio page with glassmorphic design and vibrant gradients',
}

export default function Theme1() {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <Link
          href="/"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            display: 'inline-block',
            transition: 'all 0.3s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          }}
        >
          ← Back to Themes
        </Link>
      </div>
      <iframe
        src="/theme1-glassmorphic.html"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title="Glassmorphic Modern Theme"
      />
    </>
  )
}
