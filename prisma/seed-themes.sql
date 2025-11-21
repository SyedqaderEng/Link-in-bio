-- Seed themes table with initial themes
INSERT INTO themes (name, slug, description, config, is_premium, created_at) VALUES
-- Free Themes
(
  'Glassmorphic',
  'glassmorphic',
  'Modern frosted glass design with vibrant gradients',
  '{"background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "cardBackground": "rgba(255, 255, 255, 0.1)", "backdropBlur": "blur(10px)", "textColor": "#ffffff", "accentColor": "#00d4ff", "buttonColor": "#3b82f6"}',
  false,
  NOW()
),
(
  'Minimalist',
  'minimalist',
  'Clean and simple monochrome design',
  '{"background": "#ffffff", "gradient": "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)", "cardBackground": "#f9f9f9", "backdropBlur": "none", "textColor": "#1a1a1a", "accentColor": "#000000", "buttonColor": "#000000"}',
  false,
  NOW()
),
(
  'Bold Vibrant',
  'bold-vibrant',
  'High-energy colors with bold contrasts',
  '{"background": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", "gradient": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", "cardBackground": "rgba(255, 255, 255, 0.15)", "backdropBlur": "blur(8px)", "textColor": "#ffffff", "accentColor": "#fee140", "buttonColor": "#ec4899"}',
  false,
  NOW()
),
(
  'Nature Earthy',
  'nature-earthy',
  'Organic earth tones and natural vibes',
  '{"background": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", "gradient": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", "cardBackground": "rgba(255, 255, 255, 0.2)", "backdropBlur": "blur(12px)", "textColor": "#1e3a1e", "accentColor": "#2d5016", "buttonColor": "#059669"}',
  false,
  NOW()
),
-- Premium Themes
(
  'Neon Cyberpunk',
  'neon-cyberpunk',
  'Futuristic neon lights and dark vibes',
  '{"background": "linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%)", "gradient": "linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%)", "cardBackground": "rgba(0, 255, 255, 0.1)", "backdropBlur": "blur(15px)", "textColor": "#00ffff", "accentColor": "#ff00ff", "buttonColor": "#00ffff"}',
  true,
  NOW()
),
(
  'Sunset Dreams',
  'sunset-dreams',
  'Warm sunset gradients with soft pastels',
  '{"background": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", "gradient": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", "cardBackground": "rgba(255, 255, 255, 0.25)", "backdropBlur": "blur(10px)", "textColor": "#4a1942", "accentColor": "#f97316", "buttonColor": "#fb923c"}',
  true,
  NOW()
),
(
  'Ocean Depths',
  'ocean-depths',
  'Deep sea blues with aquatic elegance',
  '{"background": "linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)", "gradient": "linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)", "cardBackground": "rgba(255, 255, 255, 0.12)", "backdropBlur": "blur(14px)", "textColor": "#e0f2fe", "accentColor": "#06b6d4", "buttonColor": "#0284c7"}',
  true,
  NOW()
),
(
  'Royal Purple',
  'royal-purple',
  'Luxurious purple tones with gold accents',
  '{"background": "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", "gradient": "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", "cardBackground": "rgba(255, 255, 255, 0.15)", "backdropBlur": "blur(12px)", "textColor": "#ffffff", "accentColor": "#fbbf24", "buttonColor": "#8b5cf6"}',
  true,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
