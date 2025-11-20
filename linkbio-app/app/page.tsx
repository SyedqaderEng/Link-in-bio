import Link from 'next/link'
import { Check, Zap, BarChart3, Palette, Globe, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-magenta opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-cyan opacity-20 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-vibrant" />
              <span className="text-2xl font-bold">LinkBio</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
              <a href="#themes" className="text-gray-400 hover:text-white transition">Themes</a>
              <Link href="/auth/login" className="text-gray-400 hover:text-white transition">Login</Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
            Your <span className="gradient-text">All-in-One</span>
            <br />Link in Bio
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Share everything you create, curate, and sell online. All from one beautiful page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-vibrant rounded-lg font-semibold text-lg hover:opacity-90 transition"
            >
              Start Free Today
            </Link>
            <a
              href="#pricing"
              className="px-8 py-4 glass rounded-lg font-semibold text-lg hover:bg-white/10 transition"
            >
              View Pricing
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Free forever · No credit card required · Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need to <span className="gradient-text">Grow Your Brand</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Create your page in minutes with our intuitive drag-and-drop editor"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Advanced Analytics"
              description="Track clicks, views, and engagement with detailed insights"
            />
            <FeatureCard
              icon={<Palette className="w-8 h-8" />}
              title="Beautiful Themes"
              description="Choose from 4 stunning themes or customize with your own CSS"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Custom Domains"
              description="Use your own domain for a professional branded experience"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Reliable"
              description="99.9% uptime with enterprise-grade security"
            />
            <FeatureCard
              icon={<Check className="w-8 h-8" />}
              title="Link Scheduling"
              description="Schedule links to appear and disappear automatically"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-gray-400 text-center mb-16">Choose the plan that works for you</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <PricingCard
              name="Free"
              price="$0"
              period="forever"
              features={[
                'Unlimited links',
                'Basic analytics',
                '4 beautiful themes',
                'QR code generator',
                'Mobile responsive',
              ]}
              cta="Get Started"
              href="/auth/signup"
            />

            {/* Pro Plan */}
            <PricingCard
              name="Pro"
              price="$6"
              period="/month"
              popular
              features={[
                'Everything in Free',
                'Advanced analytics',
                'Link scheduling',
                'Custom CSS',
                'Remove branding',
                'Priority support',
              ]}
              cta="Start Pro Trial"
              href="/auth/signup?plan=pro"
            />

            {/* Lifetime Plan */}
            <PricingCard
              name="Lifetime"
              price="$49"
              period="one-time"
              features={[
                'Everything in Pro',
                'Lifetime access',
                'Custom domains',
                'API access',
                'White-label option',
                'VIP support',
              ]}
              cta="Buy Lifetime"
              href="/auth/signup?plan=lifetime"
            />
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="themes" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="gradient-text">Beautiful Themes</span> for Every Style
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <ThemeCard
              name="Glassmorphic"
              description="Modern glass effect"
              gradient="from-purple-600 to-pink-600"
            />
            <ThemeCard
              name="Minimalist"
              description="Clean & simple"
              gradient="from-gray-200 to-gray-300"
            />
            <ThemeCard
              name="Bold Vibrant"
              description="High-energy neon"
              gradient="from-pink-500 via-cyan-500 to-lime-500"
            />
            <ThemeCard
              name="Nature Earthy"
              description="Organic & warm"
              gradient="from-green-700 to-green-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center glass p-12 rounded-2xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Your <span className="gradient-text">Link in Bio</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of creators sharing their content with LinkBio
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-gradient-vibrant rounded-lg font-semibold text-lg hover:opacity-90 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-dark-border py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>&copy; 2024 LinkBio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass p-8 rounded-2xl hover:bg-white/10 transition">
      <div className="text-primary-cyan mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  popular = false,
}: {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  href: string
  popular?: boolean
}) {
  return (
    <div className={`glass p-8 rounded-2xl ${popular ? 'gradient-border ring-2 ring-primary-cyan' : ''}`}>
      {popular && (
        <div className="inline-block px-4 py-1 bg-gradient-vibrant rounded-full text-sm font-semibold mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-5xl font-extrabold">{price}</span>
        <span className="text-gray-400 ml-2">{period}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary-lime flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block w-full py-3 rounded-lg font-semibold text-center transition ${
          popular
            ? 'bg-gradient-vibrant hover:opacity-90'
            : 'bg-white/5 hover:bg-white/10'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}

function ThemeCard({ name, description, gradient }: { name: string; description: string; gradient: string }) {
  return (
    <div className="glass rounded-2xl overflow-hidden hover:scale-105 transition">
      <div className={`h-40 bg-gradient-to-br ${gradient}`} />
      <div className="p-4">
        <h3 className="font-bold mb-1">{name}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}
