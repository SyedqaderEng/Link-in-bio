# 🚀 Local PostgreSQL Setup Guide

Quick guide to set up LinkBio with your local PostgreSQL database.

## Prerequisites

- PostgreSQL installed and running on localhost:5432
- Database named `linkbio` created
- Username: `postgres`, Password: `postgres`

## Step 1: Initialize Database

Run the SQL schema file in your PostgreSQL database:

### Option 1: Using psql command line
```bash
cd linkbio-app
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -f setup-local-db.sql
```

### Option 2: Using pgAdmin or DBeaver
1. Open your PostgreSQL client
2. Connect to: `jdbc:postgresql://localhost:5432/linkbio`
3. Open the file `setup-local-db.sql`
4. Execute the entire script

### Option 3: Manual copy-paste
1. Open `setup-local-db.sql`
2. Copy all contents
3. Paste into your SQL client
4. Execute

## Step 2: Verify Database Setup

The script creates:
- ✅ 5 tables (profiles, links, analytics, themes, subscriptions)
- ✅ 4 default themes
- ✅ Test user account
- ✅ Sample links and analytics data

**Test User Credentials:**
- Email: `test@example.com`
- Password: `testpass123`
- Username: `testuser`

## Step 3: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- All Next.js and UI dependencies

## Step 4: Configure Environment

The `.env.local` file is already configured with:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=linkbio
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Update if your credentials are different.

## Step 5: Start Development Server

```bash
npm run dev
```

Server will start on: `http://localhost:3000`

## Step 6: Test the Application

### 🏠 Landing Page
Open: `http://localhost:3000`
- Should see the landing page with pricing

### 👤 Test User Profile
Open: `http://localhost:3000/testuser`
- Should see the test user's public profile
- 3 sample links should be visible

### 🔐 Login
Open: `http://localhost:3000/auth/login`
- Email: `test@example.com`
- Password: `testpass123`
- Should redirect to dashboard after login

### 📊 Dashboard
After login: `http://localhost:3000/dashboard`
- Should see stats and charts
- Should see "Welcome back, Test User"
- Sample analytics data visible

### 🔗 Link Editor
`http://localhost:3000/editor`
- Should see 3 existing test links
- Can add, edit, delete, reorder links
- Changes save to database

### 📈 Analytics
`http://localhost:3000/analytics`
- Should see sample analytics data
- Charts and graphs visible

### ⚙️ Settings
`http://localhost:3000/settings`
- Can update profile information
- Can change password

## Database Tables

### profiles
Stores user accounts and profile information
```sql
SELECT * FROM profiles;
```

### links
Stores user links
```sql
SELECT * FROM links WHERE user_id = (SELECT id FROM profiles WHERE username = 'testuser');
```

### analytics
Tracks views and clicks
```sql
SELECT * FROM analytics ORDER BY created_at DESC LIMIT 10;
```

### themes
Available themes (4 preloaded)
```sql
SELECT name, slug FROM themes;
```

### subscriptions
User subscription data
```sql
SELECT * FROM subscriptions;
```

## Common Tasks

### Create a New User
```sql
INSERT INTO profiles (email, password_hash, username, display_name, subscription_tier)
VALUES (
  'newuser@example.com',
  '$2a$10$rQ5Z5YxZqGqJ3vQQ9YwLYO5qYQZJYQZJYQZJYQZJYQZJYQZJYQ',
  'newuser',
  'New User',
  'free'
);
```

### View All Users
```sql
SELECT username, email, display_name, subscription_tier, created_at
FROM profiles
ORDER BY created_at DESC;
```

### Check Link Clicks
```sql
SELECT l.title, l.url, l.click_count
FROM links l
JOIN profiles p ON l.user_id = p.id
WHERE p.username = 'testuser'
ORDER BY l.position;
```

### View Recent Analytics
```sql
SELECT
  p.username,
  a.event_type,
  a.country,
  a.device,
  a.created_at
FROM analytics a
JOIN profiles p ON a.user_id = p.id
ORDER BY a.created_at DESC
LIMIT 20;
```

### Reset Test Data
```sql
-- Delete all data and re-run setup-local-db.sql
DELETE FROM analytics;
DELETE FROM links;
DELETE FROM subscriptions;
DELETE FROM profiles;
-- Then run the INSERT statements again from setup-local-db.sql
```

## Testing Features

### ✅ Authentication
- [x] Email/password login
- [x] User session management
- [x] JWT token generation
- [x] Protected routes

### ✅ Profile Management
- [x] View public profile
- [x] Update profile details
- [x] Change password
- [x] Upload avatar URL

### ✅ Link Management
- [x] Create links
- [x] Update links
- [x] Delete links
- [x] Reorder links (drag & drop)
- [x] Toggle active/inactive
- [x] Click tracking

### ✅ Analytics
- [x] Track page views
- [x] Track link clicks
- [x] Geographic data
- [x] Device tracking
- [x] Charts and visualizations

### ✅ Themes
- [x] 4 theme options
- [x] Theme switching
- [x] Live preview
- [x] Custom CSS (pro feature)

## Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check if database exists
psql -h localhost -U postgres -l | grep linkbio

# Test connection
psql -h localhost -U postgres -d linkbio -c "SELECT version();"
```

### Tables Not Created
```bash
# List all tables
psql -h localhost -U postgres -d linkbio -c "\dt"

# If empty, run setup script again
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -f setup-local-db.sql
```

### Cannot Login
```bash
# Check if test user exists
psql -h localhost -U postgres -d linkbio -c "SELECT email, username FROM profiles;"

# Reset test user password
psql -h localhost -U postgres -d linkbio -c "
UPDATE profiles
SET password_hash = '\$2a\$10\$rQ5Z5YxZqGqJ3vQQ9YwLYO5qYQZJYQZJYQZJYQZJYQZJYQZJYQ'
WHERE email = 'test@example.com';
"
```

### Port Already in Use
```bash
# Next.js runs on port 3000 by default
# If port is in use, specify a different port:
npm run dev -- -p 3001
```

## Next Steps

Once local testing is working:

1. ✅ Test all CRUD operations
2. ✅ Verify analytics tracking
3. ✅ Test theme switching
4. ✅ Create multiple test users
5. ✅ Test public profile pages
6. 🚀 Deploy to production (see DEPLOYMENT.md)

## Database Backup

### Export Database
```bash
pg_dump -h localhost -U postgres linkbio > linkbio_backup.sql
```

### Import Database
```bash
psql -h localhost -U postgres linkbio < linkbio_backup.sql
```

## Performance Tips

- Database connections are pooled (max 20 connections)
- Indexes are created on frequently queried columns
- Analytics queries use time-based filtering
- Link positions are indexed for fast reordering

---

**Your local PostgreSQL setup is ready! 🎉**

Run `npm run dev` and visit `http://localhost:3000`
