# 🚀 Deployment Guide

Complete guide to deploy LinkBio to production.

## Prerequisites

- GitHub account
- Vercel account
- Supabase account (free tier works)
- Stripe account
- Resend account (or alternative email service)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
```bash
1. Go to https://supabase.com
2. Create new project
3. Wait for database to initialize
```

### 1.2 Run Database Schema
```sql
1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of supabase/schema.sql
3. Execute the SQL
4. Verify tables are created
```

### 1.3 Configure Authentication
```bash
1. Go to Authentication → Providers
2. Enable Email provider
3. Enable Google OAuth:
   - Add Client ID
   - Add Client Secret
   - Add redirect URL: https://yourdomain.com/auth/callback
4. Enable GitHub OAuth:
   - Add Client ID
   - Add Client Secret
   - Add redirect URL: https://yourdomain.com/auth/callback
```

### 1.4 Get API Keys
```bash
1. Go to Settings → API
2. Copy Project URL
3. Copy anon (public) key
4. Copy service_role (secret) key
```

## Step 2: Stripe Setup

### 2.1 Create Products
```bash
1. Go to Stripe Dashboard → Products
2. Create "Pro Plan":
   - Name: LinkBio Pro
   - Price: $6/month recurring
   - Copy Price ID (starts with price_)

3. Create "Lifetime Plan":
   - Name: LinkBio Lifetime
   - Price: $49 one-time payment
   - Copy Price ID (starts with price_)
```

### 2.2 Get API Keys
```bash
1. Go to Developers → API keys
2. Copy Publishable key (starts with pk_)
3. Copy Secret key (starts with sk_)
```

### 2.3 Set Up Webhook (After Deployment)
```bash
1. Go to Developers → Webhooks
2. Add endpoint: https://yourdomain.com/api/stripe/webhook
3. Select events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed
4. Copy Webhook Secret (starts with whsec_)
```

## Step 3: Resend Setup

### 3.1 Create Account & Get API Key
```bash
1. Go to https://resend.com
2. Create account
3. Go to API Keys
4. Create new API key
5. Copy API key (starts with re_)
```

### 3.2 Add Domain (Optional)
```bash
1. Go to Domains
2. Add your domain
3. Add DNS records
4. Verify domain
```

## Step 4: Deploy to Vercel

### 4.1 Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 4.2 Import to Vercel
```bash
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
```

### 4.3 Add Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (add after webhook setup)
STRIPE_PRO_PRICE_ID=price_...
STRIPE_LIFETIME_PRICE_ID=price_...

RESEND_API_KEY=re_...

NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=LinkBio
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-random-string>
```

### 4.4 Deploy
```bash
Click "Deploy"
Wait for build to complete
```

## Step 5: Post-Deployment Configuration

### 5.1 Update Stripe Webhook
```bash
1. Go to Stripe Dashboard → Webhooks
2. Update endpoint URL with your Vercel domain
3. Copy webhook secret
4. Add to Vercel environment variables
5. Redeploy
```

### 5.2 Update Supabase Auth URLs
```bash
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Site URL: https://yourdomain.com
3. Redirect URLs:
   - https://yourdomain.com/auth/callback
   - https://yourdomain.com/dashboard
```

### 5.3 Test OAuth Providers
```bash
1. Try logging in with Google
2. Try logging in with GitHub
3. Verify redirects work correctly
```

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain to Vercel
```bash
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation
```

### 6.2 Update Environment Variables
```bash
Update NEXT_PUBLIC_APP_URL with custom domain
Redeploy
```

### 6.3 Update All Service URLs
```bash
Update URLs in:
- Supabase Auth settings
- Stripe webhook endpoint
- OAuth redirect URLs
```

## Step 7: Testing

### 7.1 Functional Testing
```bash
✓ Sign up with email
✓ Sign in with Google
✓ Sign in with GitHub
✓ Create links
✓ View public profile
✓ Analytics tracking
✓ Theme switching
✓ Settings page
✓ Stripe checkout (test mode)
```

### 7.2 Payment Testing
```bash
Use Stripe test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0025 0000 3155

Test both Pro and Lifetime plans
Verify webhook events received
Check subscription status updates
```

## Step 8: Go Live

### 8.1 Switch Stripe to Live Mode
```bash
1. Get live API keys from Stripe
2. Update Vercel environment variables
3. Create new webhook with live keys
4. Redeploy
```

### 8.2 Final Checklist
```bash
✓ All environment variables set
✓ Database schema deployed
✓ Stripe webhook working
✓ OAuth providers configured
✓ Email service working
✓ Custom domain (if using)
✓ SSL certificate active
✓ Analytics tracking
✓ Error monitoring setup
✓ Backup strategy
✓ Terms of Service page
✓ Privacy Policy page
```

## Monitoring & Maintenance

### Performance Monitoring
```bash
- Vercel Analytics: Page performance
- Supabase Dashboard: Database queries
- Stripe Dashboard: Payment metrics
```

### Database Backups
```bash
Supabase automatically backs up database
Download manual backups from:
Settings → Database → Backups
```

### Cost Estimates

**Free Tier (< 1,000 users)**
```
Vercel: Free
Supabase: Free (up to 500MB)
Stripe: Pay as you go (2.9% + $0.30)
Resend: Free (3,000 emails/month)
Total: ~$0/month + transaction fees
```

**Growing (1,000 - 10,000 users)**
```
Vercel: $20/month (Pro)
Supabase: $25/month (Pro)
Stripe: Transaction fees only
Resend: $20/month (50,000 emails)
Total: ~$65/month + transaction fees
```

## Troubleshooting

### Build Errors
```bash
Problem: Build fails in Vercel
Solution: Check build logs, ensure all dependencies installed
Run: npm run build locally to test
```

### OAuth Not Working
```bash
Problem: OAuth redirect fails
Solution: Check redirect URLs in provider settings
Ensure they match exactly (including https://)
```

### Stripe Webhook Failures
```bash
Problem: Subscription updates not working
Solution: Check webhook endpoint URL
Verify webhook secret is correct
Check webhook event selection
View webhook logs in Stripe Dashboard
```

### Database Connection Issues
```bash
Problem: Cannot connect to Supabase
Solution: Check API keys in environment variables
Verify IP allowlist (if configured)
Check Supabase project status
```

## Support

For deployment issues:
1. Check Vercel logs
2. Check Supabase logs
3. Check Stripe webhook logs
4. Review environment variables
5. Open GitHub issue if problem persists

---

**Ready to launch! 🚀**
