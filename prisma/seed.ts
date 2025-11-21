import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed themes
  const themes = [
    // Free Themes
    {
      name: 'Glassmorphic',
      slug: 'glassmorphic',
      description: 'Modern frosted glass design with vibrant gradients',
      config: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.1)',
        backdropBlur: 'blur(10px)',
        textColor: '#ffffff',
        accentColor: '#00d4ff',
        buttonColor: '#3b82f6',
      },
      isPremium: false,
    },
    {
      name: 'Minimalist',
      slug: 'minimalist',
      description: 'Clean and simple monochrome design',
      config: {
        background: '#ffffff',
        gradient: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        cardBackground: '#f9f9f9',
        backdropBlur: 'none',
        textColor: '#1a1a1a',
        accentColor: '#000000',
        buttonColor: '#000000',
      },
      isPremium: false,
    },
    {
      name: 'Bold Vibrant',
      slug: 'bold-vibrant',
      description: 'High-energy colors with bold contrasts',
      config: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.15)',
        backdropBlur: 'blur(8px)',
        textColor: '#ffffff',
        accentColor: '#fee140',
        buttonColor: '#ec4899',
      },
      isPremium: false,
    },
    {
      name: 'Nature Earthy',
      slug: 'nature-earthy',
      description: 'Organic earth tones and natural vibes',
      config: {
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.2)',
        backdropBlur: 'blur(12px)',
        textColor: '#1e3a1e',
        accentColor: '#2d5016',
        buttonColor: '#059669',
      },
      isPremium: false,
    },
    // Premium Themes
    {
      name: 'Neon Cyberpunk',
      slug: 'neon-cyberpunk',
      description: 'Futuristic neon lights and dark vibes',
      config: {
        background: 'linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%)',
        gradient: 'linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%)',
        cardBackground: 'rgba(0, 255, 255, 0.1)',
        backdropBlur: 'blur(15px)',
        textColor: '#00ffff',
        accentColor: '#ff00ff',
        buttonColor: '#00ffff',
      },
      isPremium: true,
    },
    {
      name: 'Sunset Dreams',
      slug: 'sunset-dreams',
      description: 'Warm sunset gradients with soft pastels',
      config: {
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.25)',
        backdropBlur: 'blur(10px)',
        textColor: '#4a1942',
        accentColor: '#f97316',
        buttonColor: '#fb923c',
      },
      isPremium: true,
    },
    {
      name: 'Ocean Depths',
      slug: 'ocean-depths',
      description: 'Deep sea blues with aquatic elegance',
      config: {
        background: 'linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.12)',
        backdropBlur: 'blur(14px)',
        textColor: '#e0f2fe',
        accentColor: '#06b6d4',
        buttonColor: '#0284c7',
      },
      isPremium: true,
    },
    {
      name: 'Royal Purple',
      slug: 'royal-purple',
      description: 'Luxurious purple tones with gold accents',
      config: {
        background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.15)',
        backdropBlur: 'blur(12px)',
        textColor: '#ffffff',
        accentColor: '#fbbf24',
        buttonColor: '#8b5cf6',
      },
      isPremium: true,
    },
  ]

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { slug: theme.slug },
      update: {},
      create: theme,
    })
    console.log(`✅ Created theme: ${theme.name}`)
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
