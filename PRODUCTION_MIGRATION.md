# Production Migration Guide

## Overview
This guide helps you migrate the authentication system from the current in-memory storage to a production-ready database.

## Current State (MVP)
- ✅ User data stored in Map (in-memory)
- ✅ Resets on server restart
- ✅ Perfect for development/testing
- ⚠️ Not suitable for production

## Migration Path

### Option 1: Supabase (Recommended)
**Best for:** Quick setup, managed PostgreSQL, built-in auth

```bash
npm install @supabase/supabase-js
```

**Setup:**
1. Create project at https://supabase.com
2. Run SQL migration (see below)
3. Update auth.ts with Supabase adapter
4. Set environment variables

**Database Schema:**
```sql
-- Users table
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  email_verified timestamptz,
  image text,
  password_hash text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Accounts table (for OAuth)
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique(provider, provider_account_id)
);

-- Sessions table
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  session_token text unique not null,
  expires timestamptz not null
);

-- Verification tokens
create table verification_tokens (
  identifier text not null,
  token text unique not null,
  expires timestamptz not null,
  primary key (identifier, token)
);

-- Indexes for performance
create index idx_users_email on users(email);
create index idx_accounts_user_id on accounts(user_id);
create index idx_sessions_user_id on sessions(user_id);
create index idx_sessions_token on sessions(session_token);
```

**Environment Variables:**
```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
```

**Update auth.ts:**
```typescript
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  // ... rest of config
});
```

### Option 2: Prisma + PostgreSQL
**Best for:** Full control, complex data models

```bash
npm install prisma @prisma/client @auth/prisma-adapter
npx prisma init
```

**schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

**Commands:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Update auth.ts:**
```typescript
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ... rest of config
});
```

### Option 3: MongoDB
**Best for:** Flexible schema, document storage

```bash
npm install mongodb @auth/mongodb-adapter
```

**Environment:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
```

**Update auth.ts:**
```typescript
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './lib/mongodb';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  // ... rest of config
});
```

## Additional Production Features

### 1. Email Verification

**Install Resend:**
```bash
npm install resend
```

**Create email sender:**
```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  await resend.emails.send({
    from: 'BeforeYouSign <noreply@beforeyousign.com>',
    to: email,
    subject: 'Verify your email',
    html: `
      <h1>Welcome to BeforeYouSign!</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `,
  });
}
```

### 2. Password Reset

**API Route:**
```typescript
// app/api/auth/reset-password/route.ts
export async function POST(req: Request) {
  const { email } = await req.json();
  
  // Generate reset token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Store in database with expiry
  await db.resetToken.create({
    data: {
      email,
      token,
      expires: new Date(Date.now() + 3600000), // 1 hour
    },
  });
  
  // Send email
  await sendPasswordResetEmail(email, token);
  
  return Response.json({ success: true });
}
```

### 3. Rate Limiting

**Install upstash:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Implement:**
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

// In auth route
const identifier = req.headers.get('x-forwarded-for') ?? 'anonymous';
const { success } = await ratelimit.limit(identifier);

if (!success) {
  return Response.json({ error: 'Too many requests' }, { status: 429 });
}
```

### 4. Session Storage (Redis)

**For better session management:**
```bash
npm install @upstash/redis
```

**Configure NextAuth:**
```typescript
import { Redis } from '@upstash/redis';
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';

const redis = Redis.fromEnv();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: UpstashRedisAdapter(redis),
  session: {
    strategy: 'database',
  },
  // ... rest
});
```

## Deployment Checklist

### Environment Variables
- [ ] Set `AUTH_SECRET` to cryptographically random value
- [ ] Configure `DATABASE_URL` for production database
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Add OAuth client IDs and secrets
- [ ] Configure email service API keys
- [ ] Set up error tracking (Sentry)

### Security
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up CSP headers
- [ ] Implement audit logging

### Database
- [ ] Run migrations
- [ ] Set up backups
- [ ] Configure connection pooling
- [ ] Add database monitoring
- [ ] Set up read replicas (if needed)

### Monitoring
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Performance monitoring
- [ ] User analytics
- [ ] Authentication metrics
- [ ] Database query performance

## Testing Migration

1. **Local Testing:**
```bash
# Use local database
DATABASE_URL="postgresql://localhost:5432/beforeyousign_dev"
npm run dev
```

2. **Staging Environment:**
```bash
# Deploy to staging first
vercel --prod --env staging
```

3. **Production:**
```bash
# After testing staging
vercel --prod
```

## Rollback Plan

1. Keep in-memory implementation as fallback
2. Feature flag for database vs. in-memory
3. Database backup before migration
4. Monitoring for errors
5. Quick rollback command ready

## Support Resources

- NextAuth.js Adapters: https://authjs.dev/reference/adapters
- Supabase Auth: https://supabase.com/docs/guides/auth
- Prisma Setup: https://www.prisma.io/docs/getting-started
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

## Need Help?

Common issues and solutions:
- Database connection errors → Check connection string and firewall
- OAuth redirect mismatch → Update callback URLs in provider settings
- Session not persisting → Verify adapter configuration
- Email not sending → Check API keys and DNS records
