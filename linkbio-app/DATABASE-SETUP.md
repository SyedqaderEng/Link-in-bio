# 🚀 Database Setup - All Methods

Complete guide for setting up your local PostgreSQL database with multiple options.

## 📦 Method 1: NPM Scripts (Recommended)

The easiest way - works on all platforms (Windows, Mac, Linux):

### Initialize Database
```bash
npm run init-db
```

This will:
- ✅ Create database if it doesn't exist
- ✅ Create all tables
- ✅ Add test data
- ✅ Verify setup

### Test Connection
```bash
npm run test-db
```

### Reset Database (Start Fresh)
```bash
npm run reset-db
```

⚠️ Warning: Deletes all data!

---

## 💻 Method 2: NPX Commands

You can also run scripts directly with npx:

```bash
# Initialize database
npx node scripts/init-db.js

# Test connection
npx node scripts/test-connection.js

# Reset database
npx node scripts/reset-db.js
```

Or even simpler with just node:

```bash
# Initialize
node scripts/init-db.js

# Test
node scripts/test-connection.js

# Reset
node scripts/reset-db.js
```

---

## 🗄️ Method 3: Direct SQL (Manual)

If you prefer using SQL clients:

### Option A: Command Line (psql)
```bash
# Create database
PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE linkbio;"

# Run schema
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -f setup-local-db.sql
```

### Option B: GUI Clients (DBeaver, pgAdmin, etc.)
1. Connect to `localhost:5432`
2. Create database `linkbio`
3. Open `setup-local-db.sql`
4. Execute entire script

### Option C: SQL in your IDE
```sql
-- Copy/paste contents of setup-local-db.sql
-- Execute in your PostgreSQL client
```

---

## 🎯 Quick Start (3 Commands)

```bash
# 1. Initialize database
npm run init-db

# 2. Test connection
npm run test-db

# 3. Start server
npm run dev
```

Then open: **http://localhost:3000**

---

## ✅ What Gets Created

### Tables:
- `profiles` - User accounts
- `links` - User links
- `analytics` - Event tracking
- `themes` - Available themes (4 default)
- `subscriptions` - Subscription data

### Test Data:
- **Test User**
  - Email: test@example.com
  - Password: testpass123
  - Username: testuser
- **3 Sample Links**
- **Sample Analytics Data**

---

## 🔧 Troubleshooting

### PostgreSQL Not Running?
```bash
# Check status
pg_isready -h localhost -p 5432

# Start PostgreSQL
# macOS:    brew services start postgresql
# Ubuntu:   sudo service postgresql start
# Windows:  Start PostgreSQL service
```

### Wrong Credentials?
Edit `.env.local`:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=linkbio
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### Database Already Exists with Data?
```bash
# Reset and start fresh
npm run reset-db
```

### Script Permissions Error?
```bash
# Make scripts executable (Unix/Mac)
chmod +x scripts/*.js
```

---

## 🌐 Cross-Platform Support

All methods work on:
- ✅ Windows
- ✅ macOS
- ✅ Linux
- ✅ WSL

The Node.js scripts (Method 1 & 2) are recommended because they're:
- Platform-independent
- No bash required
- Work in any terminal
- Provide better error messages

---

## 📊 Verify Setup

After initialization, verify everything worked:

```bash
npm run test-db
```

Should show:
```
✅ Successfully connected to PostgreSQL
✅ Tables found:
   - analytics
   - links
   - profiles
   - subscriptions
   - themes
✅ Users in database: 1
✅ Test user found:
   Username: testuser
   Email: test@example.com
   Password: testpass123
```

---

## 🗂️ Database Scripts

### Available Scripts:

| Script | Command | Description |
|--------|---------|-------------|
| Initialize | `npm run init-db` | Create DB and tables |
| Test | `npm run test-db` | Verify connection |
| Reset | `npm run reset-db` | Delete all data and recreate |
| Dev | `npm run dev` | Start app server |

---

## 💡 Pro Tips

### Start Fresh Anytime
```bash
npm run reset-db && npm run dev
```

### Check Database Directly
```bash
# View all tables
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -c "\dt"

# Count users
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -c "SELECT COUNT(*) FROM profiles;"

# View test user
PGPASSWORD=postgres psql -h localhost -U postgres -d linkbio -c "SELECT * FROM profiles WHERE email='test@example.com';"
```

### Backup Database
```bash
pg_dump -h localhost -U postgres linkbio > backup.sql
```

### Restore Database
```bash
psql -h localhost -U postgres linkbio < backup.sql
```

---

## 🎉 You're Ready!

Your database is set up and ready to use with any method you prefer.

**Recommended Flow:**
1. `npm run init-db` - Initialize
2. `npm run test-db` - Verify
3. `npm run dev` - Start app
4. Test everything at http://localhost:3000

**Need help?** Check other docs:
- `QUICKSTART.md` - Fast 5-minute guide
- `SETUP-LOCAL.md` - Detailed setup
- `README.md` - Full documentation
