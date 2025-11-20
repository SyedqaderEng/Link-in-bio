import Link from 'next/link'

export const metadata = {
  title: 'Theme 3: Bold & Vibrant',
  description: 'An energetic link-in-bio page with neon colors, gradients, and animations',
}

export default function Theme3() {
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
            background: 'rgba(255, 0, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            display: 'inline-block',
            transition: 'all 0.3s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            boxShadow: '0 4px 16px rgba(255, 0, 255, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 0, 255, 0.3)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 0, 255, 0.2)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ← Back to Themes
        </Link>
      </div>
      <iframe
        src="/theme3-bold-vibrant.html"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title="Bold & Vibrant Theme"
      />
    </>
  )
}
