import Link from 'next/link'

export default function Home() {
  const themes = [
    {
      id: 'theme1',
      name: 'Glassmorphic Modern',
      description: 'Translucent cards with blur effects, vibrant gradient background, modern premium feel',
      target: 'Tech creators, designers, modern brands',
      colors: 'Purple to Pink Gradient',
      preview: '/theme1',
      image: '🎨'
    },
    {
      id: 'theme2',
      name: 'Minimalist Calm',
      description: 'Neutral color palette, maximum whitespace, simple typography',
      target: 'Wellness, lifestyle, coaches',
      colors: 'Creams, Whites, Soft Grays',
      preview: '/theme2',
      image: '🧘'
    },
    {
      id: 'theme3',
      name: 'Bold & Vibrant',
      description: 'Bright gradients, neon colors, animated elements, energetic playful vibe',
      target: 'Musicians, artists, entertainers',
      colors: 'Neon + Dark Mode',
      preview: '/theme3',
      image: '🎵'
    },
    {
      id: 'theme4',
      name: 'Nature-Inspired',
      description: 'Earthy tones, organic shapes, calm authentic feel',
      target: 'Eco brands, artisans, handmade sellers',
      colors: 'Greens, Browns, Sand',
      preview: '/theme4',
      image: '🌿'
    }
  ]

  return (
    <main style={{
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)'
          }}>
            Link-in-Bio Demo Themes
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Choose from 4 professionally designed themes based on 2024-2025 design trends.
            Click any theme to see a live preview.
          </p>
        </div>

        {/* Theme Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '50px'
        }}>
          {themes.map((theme) => (
            <Link
              key={theme.id}
              href={theme.preview}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '30px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'white',
                display: 'block',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                {theme.image}
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                {theme.name}
              </h2>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                opacity: 0.9,
                marginBottom: '16px'
              }}>
                {theme.description}
              </p>
              <div style={{
                fontSize: '13px',
                opacity: 0.8,
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Best for:</strong> {theme.target}
                </div>
                <div>
                  <strong>Colors:</strong> {theme.colors}
                </div>
              </div>
              <div style={{
                marginTop: '20px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                View Live Demo →
              </div>
            </Link>
          ))}
        </div>

        {/* Research Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '30px',
            maxWidth: '600px',
            margin: '0 auto',
            color: 'white'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Research & Documentation
            </h3>
            <p style={{
              fontSize: '14px',
              opacity: 0.9,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              These themes are based on comprehensive research of top link-in-bio platforms
              including Linktree, Beacons, Milkshake, and current 2024-2025 design trends.
            </p>
            <div style={{
              fontSize: '13px',
              opacity: 0.8
            }}>
              See <code style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>DESIGN_RESEARCH.md</code> for full analysis
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
