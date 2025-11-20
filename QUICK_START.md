# Quick Start Guide

## Prerequisites
- PostgreSQL running on `localhost:5432`
- Database: `linkbio`
- Username/Password: `postgres/postgres`
- Node.js 18+ installed

## Setup (Run on Your Local Machine)

### 1. Clone and Install
```bash
# Pull latest changes
git pull origin claude/research-demo-project-01TCpN9BpCZsSCwzUTSoGXf5

# Install dependencies (will auto-generate Prisma client)
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp local.env .env
```

Your `.env` file should contain:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linkbio"
```

### 3. Verify Prisma Setup
```bash
# Run Prisma verification
npm run verify-prisma
```

If you see errors, fix them before proceeding.

### 4. Initialize Database
```bash
# Test database connection
npm run test-db

# Initialize database (creates tables, themes, test user)
npm run init-db
```

This creates:
- All database tables (profiles, links, analytics, themes, subscriptions)
- 4 default themes
- Test user: `test@example.com` / `testpass123`
- Sample links and analytics

### 5. Start Development Server
```bash
npm run dev
```

Visit:
- http://localhost:3000 - Homepage
- http://localhost:3000/testuser - Test profile
- http://localhost:3000/dashboard - Dashboard (login required)

### 6. (Optional) Open Prisma Studio
```bash
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 to view/edit database data.

## Available Commands

### Database
```bash
npm run test-db          # Test PostgreSQL connection
npm run init-db          # Initialize database with tables and data
npm run reset-db         # Reset database (drops all data)
```

### Prisma
```bash
npm run verify-prisma    # Verify Prisma configuration
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema changes to database
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:migrate   # Create migration files (production)
```

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run check            # Check project health
```

## Troubleshooting

### Prisma Client Not Found
```bash
npm run prisma:generate
```

### Database Connection Failed
1. Check PostgreSQL is running: `pg_isready`
2. Verify database exists: `psql -U postgres -l | grep linkbio`
3. Check credentials in `.env`
4. Test connection: `npm run test-db`

### Schema Out of Sync
```bash
npm run init-db          # Reset database
npm run prisma:push      # Push schema changes
```

### Port Already in Use (3000)
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Test Credentials

**Test User**
- Email: `test@example.com`
- Password: `testpass123`
- Profile: http://localhost:3000/testuser

**Database**
- Host: `localhost:5432`
- Database: `linkbio`
- User: `postgres`
- Password: `postgres`

## Next Steps

1. Visit http://localhost:3000/testuser to see the test profile
2. Login with test credentials to access dashboard
3. Create your own profile and links
4. Customize themes and styling
5. Test Stripe integration (requires test API keys)

## Production Deployment

1. Copy `prod.env` to `.env`
2. Update all production credentials
3. Update `DATABASE_URL` with production PostgreSQL URL
4. Run `npm run build`
5. Deploy to Vercel/Railway/other platforms

For detailed documentation, see:
- `PRISMA_SETUP.md` - Prisma ORM guide
- `README.md` - Full project documentation
