# 🎨 LinkBio - Production-Ready Link-in-Bio SaaS Platform

A modern, fully-featured link-in-bio platform built to compete with lnk.bio and Linktree. Built with Next.js 15, TypeScript, Supabase, and Stripe.

## ✨ Features

### 🎯 Core Features
- **Unlimited Links** - Add as many links as you want
- **4 Beautiful Themes** - Glassmorphic, Minimalist, Bold Vibrant, Nature Earthy
- **Advanced Analytics** - Track views, clicks, geographic data, and more
- **Link Scheduling** - Schedule links to appear and disappear automatically
- **Custom Domains** - Use your own domain (Pro feature)
- **QR Code Generator** - Generate QR codes for your profile
- **Public API** - REST API for programmatic access

### 🎨 Design
- **Modern Vibrant UI** - Dark theme with neon gradients (Magenta, Cyan, Lime)
- **Bento Grid Layout** - Asymmetric, modern dashboard design
- **Real Visual Charts** - Area charts, bar charts, donut charts, sparklines
- **Responsive Design** - Works perfectly on all devices
- **Micro-animations** - Smooth transitions and hover effects

### 🔐 Authentication
- **Email/Password** - Traditional authentication
- **Google OAuth** - Sign in with Google
- **GitHub OAuth** - Sign in with GitHub
- **Email Verification** - Secure account verification
- **Password Reset** - Easy password recovery

### 💳 Monetization
- **Free Plan** - Unlimited links, basic analytics, 4 themes
- **Pro Plan ($6/month)** - Advanced analytics, link scheduling, custom CSS
- **Lifetime Plan ($49)** - One-time payment, all features forever
- **Stripe Integration** - Secure payment processing
- **Webhook Support** - Real-time subscription updates

### 📊 Analytics
- **View Tracking** - Track profile views
- **Click Tracking** - Track link clicks
- **Geographic Data** - See where your visitors are from
- **Device & Browser Data** - Understand your audience
- **Time-based Analytics** - Daily, weekly, monthly reports
- **Top Performing Links** - See which links get the most clicks

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS
- **Backend**: Next.js API Routes, Server Components
- **Database**: PostgreSQL (Local or Supabase)
- **Authentication**: JWT + bcrypt
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Link-in-bio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
# For local development
cp local.env .env

# For production
cp prod.env .env
# Then edit .env with your credentials
```

4. **Initialize database**
```bash
npm run init-db
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

**Test Account:**
- Email: test@example.com
- Password: testpass123
- Profile: http://localhost:3000/testuser

## 🗄️ Database Schema

### Tables
- **profiles** - User profiles with username, bio, theme preferences
- **links** - User links with title, URL, position, scheduling
- **analytics** - Event tracking (views, clicks, shares)
- **themes** - Available themes with configuration
- **subscriptions** - Stripe subscription data

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access/modify their own data
- Public profiles viewable by everyone
- Analytics tracked server-side to prevent tampering

## 🎨 Themes

### 1. Glassmorphic
- Translucent blur effects
- Purple-pink gradients
- Modern glass morphism design

### 2. Minimalist
- Clean neutral colors
- Maximum whitespace
- Simple and elegant

### 3. Bold Vibrant (Featured)
- Dark theme with neon colors
- Animated gradients
- High energy, modern design

### 4. Nature Earthy
- Earthy tones and organic shapes
- Warm and inviting
- Nature-inspired palette

## 📱 API Endpoints

### Public Endpoints
```
GET  /api/profile?username={username}     - Get public profile
GET  /api/links?username={username}       - Get user links
POST /api/analytics/track                 - Track analytics event
```

### Authenticated Endpoints
```
POST /api/links                           - Create link
PUT  /api/profile                         - Update profile
POST /api/stripe/checkout                 - Create checkout session
POST /api/stripe/webhook                  - Handle Stripe webhooks
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Add environment variables
- Deploy

3. **Configure Stripe Webhook**
- Update webhook URL in Stripe Dashboard
- Use production webhook secret

4. **Configure OAuth**
- Add production URLs to Supabase Auth settings
- Update OAuth redirect URLs

## 🔒 Security Features

- **Row Level Security** - Database-level access control
- **Authentication Required** - Protected API routes
- **CSRF Protection** - Built-in Next.js protection
- **Rate Limiting** - Prevent abuse (implement as needed)
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Parameterized queries
- **XSS Prevention** - React automatic escaping

## 📈 Analytics & Monitoring

- **Built-in Analytics** - Track all user interactions
- **Vercel Analytics** - Page views and performance
- **Stripe Dashboard** - Revenue and subscription metrics
- **Supabase Dashboard** - Database queries and usage

## 🎯 Future Enhancements

- [ ] Email campaigns
- [ ] Social media integrations
- [ ] A/B testing for links
- [ ] Link thumbnail previews
- [ ] Scheduled reports
- [ ] White-label option
- [ ] Mobile app (React Native)
- [ ] WordPress plugin
- [ ] Zapier integration

## 📝 License

MIT License - feel free to use this for your own projects

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📞 Support

For support, email support@yourdomain.com or open an issue on GitHub.

---

**Built with ❤️ to compete with lnk.bio**
