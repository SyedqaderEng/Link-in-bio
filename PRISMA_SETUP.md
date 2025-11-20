# Prisma Setup Guide

This project is now configured with Prisma ORM for type-safe database access.

## Setup Steps

### 1. Copy Environment File
```bash
cp local.env .env
```

The `.env` file must contain:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linkbio"
```

**Important**: Use quotes around the DATABASE_URL value.

### 2. Generate Prisma Client
```bash
npm run prisma:generate
```

This will generate the Prisma Client based on your schema at `prisma/schema.prisma`.

### 3. Initialize Database
```bash
npm run init-db
```

This runs the SQL setup script that creates all tables, indexes, triggers, and test data.

### 4. (Optional) Push Schema Changes
If you modify the Prisma schema, you can push changes to your database:
```bash
npm run prisma:push
```

**Note:** Since we're using an existing database with SQL scripts, use `prisma db push` instead of migrations.

## Using Prisma in Your Code

### Import the Prisma Client
```typescript
import { prisma } from '@/lib/prisma'
```

### Example Queries

#### Get a profile by username
```typescript
const profile = await prisma.profile.findUnique({
  where: { username: 'testuser' },
  include: {
    links: {
      where: { isActive: true },
      orderBy: { position: 'asc' }
    },
    theme: true
  }
})
```

#### Create a new link
```typescript
const link = await prisma.link.create({
  data: {
    userId: profile.id,
    title: 'My Website',
    url: 'https://example.com',
    icon: '🌐',
    position: 0,
    isActive: true
  }
})
```

#### Update link click count
```typescript
await prisma.link.update({
  where: { id: linkId },
  data: {
    clickCount: {
      increment: 1
    }
  }
})
```

#### Track analytics
```typescript
await prisma.analytics.create({
  data: {
    userId: profile.id,
    linkId: link.id,
    eventType: 'click',
    country: 'United States',
    device: 'Desktop',
    browser: 'Chrome'
  }
})
```

#### Get analytics summary
```typescript
const analytics = await prisma.analytics.groupBy({
  by: ['eventType'],
  where: {
    userId: profile.id,
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    }
  },
  _count: {
    id: true
  }
})
```

## Prisma Studio

Launch Prisma Studio to view and edit your database data in a GUI:
```bash
npm run prisma:studio
```

This will open Prisma Studio at http://localhost:5555

## Schema Changes

The Prisma schema is located at `prisma/schema.prisma`.

Key features:
- **Enums**: SubscriptionTier, SubscriptionStatus, AnalyticsEventType
- **Relations**: All foreign keys are properly configured
- **Database Types**: Uses PostgreSQL-specific types (UUID, Timestamptz, Json)
- **Auto-generated UUIDs**: Uses `uuid_generate_v4()` function
- **Auto-updated timestamps**: `updatedAt` fields auto-update on changes

## Migration vs Push

Since we're using SQL scripts for initialization:
- Use `npm run prisma:push` for schema changes (not migrations)
- This pushes schema changes directly without creating migration files
- Suitable for development and prototyping

For production with versioned migrations:
- Use `npm run prisma:migrate` to create migration files
- This is recommended for production deployments

## Switching from pg to Prisma

Replace raw SQL queries:
```typescript
// Before (raw pg)
const result = await query('SELECT * FROM profiles WHERE username = $1', [username])

// After (Prisma)
const profile = await prisma.profile.findUnique({
  where: { username }
})
```

Benefits:
- Full TypeScript type safety
- Auto-completion in your IDE
- Compile-time error checking
- Cleaner, more readable code
- Protection against SQL injection

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run `npm run prisma:generate` to generate the Prisma Client.

### "Environment variable not found: DATABASE_URL"
Make sure you copied `local.env` to `.env` and it contains the DATABASE_URL.

### Schema out of sync
If your database schema doesn't match Prisma schema, run:
```bash
npm run init-db  # Reset database
npm run prisma:push  # Push schema changes
```
