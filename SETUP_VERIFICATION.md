# Setup Verification Guide

This guide will help you verify your Prisma 5.22.0 setup is correct.

## ✅ What's Configured

### Prisma Version
- **Prisma Client**: 5.22.0
- **Prisma CLI**: 5.22.0
- **Status**: Stable, proven version (matches your working FinanceOS setup)

### Environment Configuration
All environment variables use proper quotes for consistency:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linkbio"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="iCSwQh3kkMxDaL71FCyURjmfFZUu71pK9ZoWHlwdevM="

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="LinkBio"
```

### Prisma Schema
- **Location**: `prisma/schema.prisma`
- **Datasource**: PostgreSQL with `url = env("DATABASE_URL")`
- **Models**: Profile, Link, Analytics, Theme, Subscription
- **Features**: Enums, Relations, UUID, Timestamps, JSON fields

## 🚀 Setup Steps on Your Local Machine

### 1. Pull Latest Changes
```bash
git pull origin claude/setup-prisma-5-01TCpN9BpCZsSCwzUTSoGXf5
```

### 2. Clean Install
```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Install fresh (will auto-generate Prisma Client v5.22.0)
npm install
```

### 3. Configure Environment
```bash
# Copy template to .env
cp local.env .env
```

### 4. Verify Prisma
```bash
# Check Prisma version
npx prisma --version

# Expected output:
# prisma                  : 5.22.0
# @prisma/client          : 5.22.0

# Validate schema
npx prisma validate

# Expected output:
# Environment variables loaded from .env
# Prisma schema loaded from prisma\schema.prisma
# ✔ The schema at prisma\schema.prisma is valid 🚀

# Generate Prisma Client
npx prisma generate

# Expected output:
# Environment variables loaded from .env
# Prisma schema loaded from prisma\schema.prisma
# ✔ Generated Prisma Client (v5.22.0) to .\node_modules\@prisma\client in XXXms
```

### 5. Initialize Database
```bash
# Test database connection
npm run test-db

# Initialize database (creates tables, themes, test user)
npm run init-db
```

### 6. Start Development
```bash
npm run dev
```

Visit:
- http://localhost:3000 - Homepage
- http://localhost:3000/testuser - Test profile

## 🔍 Verification Checklist

Run these commands and verify the output:

### ✅ Check 1: Prisma Version
```bash
npx prisma --version
```
**Expected**: Version 5.22.0 for both prisma and @prisma/client

### ✅ Check 2: Schema Validation
```bash
npx prisma validate
```
**Expected**: "The schema at prisma\schema.prisma is valid 🚀"

### ✅ Check 3: Client Generation
```bash
npx prisma generate
```
**Expected**: "Generated Prisma Client (v5.22.0)"

### ✅ Check 4: Environment Variables
```bash
cat .env | grep DATABASE_URL
```
**Expected**: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linkbio"`

### ✅ Check 5: Database Connection
```bash
npm run test-db
```
**Expected**: Connection successful message

### ✅ Check 6: Prisma Client Import
Create a test file `test-prisma.js`:
```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.profile.count()
  console.log('✅ Prisma Client works! Profile count:', count)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run:
```bash
node test-prisma.js
```
**Expected**: "✅ Prisma Client works! Profile count: X"

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
**Solution**:
```bash
npm run prisma:generate
```

### Error: "Environment variable not found: DATABASE_URL"
**Solution**:
```bash
# Make sure .env exists
cp local.env .env

# Verify it contains DATABASE_URL
cat .env | grep DATABASE_URL
```

### Error: "Can't reach database server"
**Solution**:
1. Check PostgreSQL is running: `pg_isready`
2. Verify database exists: `psql -U postgres -l | grep linkbio`
3. Test credentials: `psql -U postgres -d linkbio -c "SELECT 1"`

### Error: Schema validation failed
**Solution**:
```bash
# Check schema syntax
npx prisma format

# Re-validate
npx prisma validate
```

### Error: Prisma version mismatch
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Regenerate client
npm run prisma:generate
```

## 📊 Expected Output Examples

### Successful Generation
```
PS C:\Projects\Link-in-bio> npx prisma generate
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (v5.22.0) to .\node_modules\@prisma\client in 302ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
```

### Successful Database Init
```
PS C:\Projects\Link-in-bio> npm run init-db

🔍 Testing PostgreSQL connection...
✅ Connection successful!

📦 Initializing database...
✅ Database initialized successfully!
✅ Test user created - Email: test@example.com, Password: testpass123
✅ Test profile URL: http://localhost:3000/testuser
```

### Successful Dev Server
```
PS C:\Projects\Link-in-bio> npm run dev

> linkbio-app@1.0.0 dev
> next dev

  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.X:3000

 ✓ Ready in 2.3s
```

## 🎯 Next Steps

Once all verification checks pass:

1. **Explore the database** with Prisma Studio:
   ```bash
   npm run prisma:studio
   ```
   Opens GUI at http://localhost:5555

2. **Review test data**:
   - 1 test user created
   - 4 default themes
   - 3 sample links
   - Sample analytics

3. **Start building**:
   - Use Prisma Client in your code
   - Type-safe database queries
   - Auto-completion in IDE
   - Full TypeScript support

## 📚 Quick Reference

### Prisma Commands
```bash
npx prisma generate     # Generate Prisma Client
npx prisma validate     # Validate schema
npx prisma format       # Format schema file
npx prisma studio       # Open GUI (port 5555)
npx prisma db push      # Push schema changes
npx prisma db pull      # Pull schema from database
```

### NPM Scripts
```bash
npm run verify-prisma   # Verify Prisma configuration
npm run prisma:generate # Generate client
npm run prisma:push     # Push schema to database
npm run prisma:studio   # Open Prisma Studio
npm run init-db         # Initialize database
npm run test-db         # Test database connection
npm run dev             # Start dev server
```

## ✨ Success Indicators

You're ready to go when you see:
- ✅ Prisma 5.22.0 installed
- ✅ Schema validates successfully
- ✅ Prisma Client generates without errors
- ✅ Database connection succeeds
- ✅ Tables created with test data
- ✅ Dev server starts successfully
- ✅ Can access http://localhost:3000/testuser

If all checks pass, your setup is complete! 🎉
