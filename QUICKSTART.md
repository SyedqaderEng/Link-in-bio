# ⚡ Quick Start Guide - Local PostgreSQL

Get LinkBio running with your local PostgreSQL database in 5 minutes.

## 📋 Prerequisites

- ✅ PostgreSQL installed and running
- ✅ Database connection: `jdbc:postgresql://localhost:5432/linkbio`
- ✅ Credentials: postgres/postgres

## 🚀 Quick Setup (3 Steps)

### Step 1: Initialize Database
```bash
cd linkbio-app
npm run init-db
```

This will:
- Create all required tables
- Insert 4 default themes
- Create a test user account
- Add sample data

### Step 2: Test Connection
```bash
npm run test-db
```

This will verify:
- Database connection is working
- Tables are created
- Test user exists

### Step 3: Start Server
```bash
npm run dev
```

Open: **http://localhost:3000**

## 🎯 Test It Out

### 1. View Test User Profile
http://localhost:3000/testuser

You should see:
- Test User profile
- 3 sample links
- Bold Vibrant theme

### 2. Login to Dashboard
http://localhost:3000/auth/login

**Credentials:**
- Email: `test@example.com`
- Password: `testpass123`

After login, you'll see:
- Dashboard with analytics
- Sample views and clicks
- Welcome message

### 3. Edit Links
http://localhost:3000/editor

- Add new links
- Reorder by dragging
- Toggle active/inactive
- Delete links
- Save changes

### 4. View Analytics
http://localhost:3000/analytics

- See view/click stats
- Charts and graphs
- Top performing links
- Geographic data

### 5. Change Theme
http://localhost:3000/themes

- 4 themes available:
  - Glassmorphic (purple/pink)
  - Minimalist (clean/simple)
  - Bold Vibrant (neon colors) ⭐
  - Nature Earthy (organic/warm)

### 6. Update Settings
http://localhost:3000/settings

- Edit profile info
- Change password
- Update bio and avatar

## 📊 Database Access

### View Tables
```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -c "\dt"
```

### View Users
```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -c "SELECT username, email, subscription_tier FROM profiles;"
```

### View Links
```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -c "SELECT l.title, l.url, l.click_count FROM links l JOIN profiles p ON l.user_id = p.id WHERE p.username = 'testuser';"
```

### View Analytics
```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -c "SELECT event_type, COUNT(*) FROM analytics GROUP BY event_type;"
```

## 🔧 Manual Database Setup (Alternative)

If `npm run init-db` doesn't work, manually run:

```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -f setup-local-db.sql
```

Or use your SQL client (DBeaver, pgAdmin):
1. Connect to: localhost:5432/linkbio
2. Open: `setup-local-db.sql`
3. Execute all

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Landing page loads (http://localhost:3000)
- [ ] Test profile loads (http://localhost:3000/testuser)
- [ ] Login works (test@example.com / testpass123)
- [ ] Dashboard shows data
- [ ] Can add/edit links
- [ ] Analytics display charts
- [ ] Theme switching works
- [ ] Settings update successfully

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# If not running, start it (depends on OS):
# macOS: brew services start postgresql
# Ubuntu: sudo service postgresql start
# Windows: Start PostgreSQL service
```

### Database Doesn't Exist
```bash
# Create database manually
PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE linkbio;"
```

### Tables Not Created
```bash
# Run init script again
npm run init-db

# Or manually
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -f setup-local-db.sql
```

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
# Then open http://localhost:3001
```

### Cannot Login
```bash
# Check test user exists
npm run test-db

# Or query directly
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -c "SELECT email, username FROM profiles WHERE email = 'test@example.com';"
```

## 📁 Files Created

- `setup-local-db.sql` - Database schema with test data
- `.env.local` - Environment configuration
- `lib/db.ts` - PostgreSQL connection pool
- `lib/auth-local.ts` - Authentication functions
- `lib/session.ts` - Session management
- `app/api/auth/*` - Auth API routes
- `scripts/init-db.sh` - Database initialization script
- `scripts/test-connection.js` - Connection test script

## 🔐 Default Credentials

**Test User:**
- Email: test@example.com
- Password: testpass123
- Username: testuser
- Profile: http://localhost:3000/testuser

## 📝 Next Steps

Once everything is working:

1. ✅ Create your own user account
2. ✅ Customize your profile
3. ✅ Add your real links
4. ✅ Choose your favorite theme
5. ✅ Test all features
6. 🚀 Deploy to production (see DEPLOYMENT.md)

## 💡 Tips

- Use `npm run test-db` to quickly verify connection
- Check database logs if queries fail
- All passwords are bcrypt hashed
- Sessions last 7 days
- Analytics track automatically
- Link clicks increment in real-time

## 🎉 You're Ready!

Your local LinkBio is configured and ready to test.

**Happy testing! 🚀**

Need help? Check:
- `SETUP-LOCAL.md` - Detailed setup guide
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Production deployment
