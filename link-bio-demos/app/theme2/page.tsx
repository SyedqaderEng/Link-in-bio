import Link from 'next/link'

export const metadata = {
  title: 'Theme 2: Minimalist Calm',
  description: 'A calm, minimalist link-in-bio page with neutral colors and clean typography',
}

export default function Theme2() {
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
            background: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '1px solid #E8E3DD',
            color: '#2D2D2D',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            display: 'inline-block',
            transition: 'all 0.3s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#2D2D2D'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#E8E3DD'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ← Back to Themes
        </Link>
      </div>
      <iframe
        src="/theme2-minimalist.html"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title="Minimalist Calm Theme"
      />
    </>
  )
}
