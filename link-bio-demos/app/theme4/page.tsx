import Link from 'next/link'

export const metadata = {
  title: 'Theme 4: Nature-Inspired',
  description: 'An organic link-in-bio page with earthy tones and natural aesthetics',
}

export default function Theme4() {
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
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '2px solid #2D5016',
            color: '#2D5016',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            display: 'inline-block',
            transition: 'all 0.3s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            boxShadow: '0 4px 16px rgba(45, 80, 22, 0.15)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#2D5016'
            e.currentTarget.style.color = '#E8D5C4'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
            e.currentTarget.style.color = '#2D5016'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ← Back to Themes
        </Link>
      </div>
      <iframe
        src="/theme4-nature-earthy.html"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title="Nature-Inspired Theme"
      />
    </>
  )
}
