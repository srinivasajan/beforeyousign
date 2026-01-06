# 🚀 Deployment Guide - BeforeYouSign

## Quick Deploy to Production

### Option 1: Vercel (Recommended - 5 minutes)

**Prerequisites**:
- GitHub account
- Vercel account (free)

**Steps**:

1. **Push to GitHub** (already done ✅)
   ```bash
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Click "Deploy"

3. **Environment Variables**:
   Add these in Vercel Dashboard → Settings → Environment Variables:

   ```env
   # Authentication
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
   
   # GitHub OAuth
   GITHUB_ID=your-github-oauth-app-id
   GITHUB_SECRET=your-github-oauth-secret
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-secret
   
   # AI/Gemini
   GEMINI_API_KEY=your-gemini-api-key
   
   # Database (Vercel Postgres or Supabase)
   DATABASE_URL=postgresql://user:password@host:5432/database
   DIRECT_URL=postgresql://user:password@host:5432/database
   
   # Stripe (for payments)
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Optional: Monitoring
   SENTRY_DSN=your-sentry-dsn
   LOGFLARE_API_KEY=your-logflare-key
   ```

4. **Database Setup**:
   
   **Option A: Vercel Postgres** (Easy)
   ```bash
   # In Vercel Dashboard:
   # Storage → Create Database → Postgres
   # Copy connection strings to environment variables
   ```
   
   **Option B: Supabase** (More features)
   ```bash
   # 1. Create Supabase project: https://supabase.com
   # 2. Get connection string from Settings → Database
   # 3. Run schema:
   psql $DATABASE_URL < database-schema.sql
   ```

5. **Deploy**:
   ```bash
   # Vercel auto-deploys on push
   git push origin main
   
   # Or trigger manual deploy
   vercel --prod
   ```

**Done!** Your app is live at `https://your-app.vercel.app` 🎉

---

### Option 2: Manual Deployment

#### Step 1: Database Setup

**PostgreSQL** (Required for production):

```bash
# 1. Install PostgreSQL
brew install postgresql  # Mac
# or
apt-get install postgresql  # Linux

# 2. Create database
createdb beforeyousign

# 3. Run schema
psql beforeyousign < database-schema.sql

# 4. Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost:5432/beforeyousign"
```

#### Step 2: Install Dependencies

```bash
npm install

# Install Prisma CLI
npm install -D prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

#### Step 3: Build Application

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

#### Step 4: Deploy to Server

**Using PM2** (Node.js process manager):

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "beforeyousign" -- start

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
```

**Using Docker**:

```dockerfile
# Create Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t beforeyousign .
docker run -p 3000:3000 --env-file .env beforeyousign
```

---

## Environment Variables Guide

### Required Variables

```env
# App URL
NEXTAUTH_URL=https://yourdomain.com

# Auth Secret (generate: openssl rand -base64 32)
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars

# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# AI
GEMINI_API_KEY=your-gemini-api-key
```

### OAuth Setup

**GitHub OAuth**:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Copy Client ID and Client Secret

**Google OAuth**:
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Set callback URL: `https://yourdomain.com/api/auth/callback/google`
4. Copy Client ID and Client Secret

### Stripe Setup (for payments)

1. Create Stripe account: https://stripe.com
2. Get API keys from Dashboard → Developers → API keys
3. Set up webhooks at Dashboard → Developers → Webhooks
4. Webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`

---

## Database Migrations

**Initial setup**:
```bash
npx prisma migrate dev --name init
```

**Apply migrations in production**:
```bash
npx prisma migrate deploy
```

**Reset database** (development only):
```bash
npx prisma migrate reset
```

**Seed sample data** (optional):
```bash
npx prisma db seed
```

---

## Performance Optimization

### 1. Enable Caching

```typescript
// next.config.ts
const config = {
  experimental: {
    serverActions: true,
  },
  // Enable SWC minification
  swcMinify: true,
  // Image optimization
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### 2. Database Indexes

Already included in `database-schema.sql`:
- User lookups by email
- Contract queries by user_id
- Analysis queries by contract_id
- Full-text search on contract content

### 3. CDN Setup

**Vercel** (automatic):
- Static assets cached on edge network
- Automatic image optimization
- Global CDN distribution

**Cloudflare** (manual):
1. Add site to Cloudflare
2. Update nameservers
3. Enable caching rules
4. Set up page rules for API routes

---

## Monitoring & Analytics

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Analytics (Vercel Analytics)

```bash
npm install @vercel/analytics

# In app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Uptime Monitoring

**Options**:
- UptimeRobot (free): https://uptimerobot.com
- Pingdom: https://pingdom.com
- Better Uptime: https://betteruptime.com

Monitor endpoints:
- `https://yourdomain.com/api/health`
- `https://yourdomain.com/`

---

## Security Checklist

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables secured (not in git)
- [ ] API rate limiting configured
- [ ] CORS configured properly
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)
- [ ] CSRF tokens (NextAuth handles this)
- [ ] Password hashing (bcrypt)
- [ ] Secure headers configured
- [ ] Database backups enabled
- [ ] Error messages sanitized (no sensitive data)

### Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

const config = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## Backup Strategy

### Automated Database Backups

**Vercel Postgres**:
- Automatic daily backups (included)
- Point-in-time recovery available

**Supabase**:
- Daily backups (Pro plan)
- Downloadable via CLI: `supabase db dump`

**Manual Backup**:
```bash
# Backup database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup-20260105.sql
```

---

## Scaling Guide

### Horizontal Scaling (Vercel)

**Automatic**:
- Vercel automatically scales serverless functions
- No configuration needed
- Pay per execution

### Database Scaling

**When to scale**:
- Query time > 100ms
- Connection pool exhausted
- CPU > 80% consistently

**Options**:
1. **Connection pooling** (Supabase/PgBouncer)
2. **Read replicas** for analytics queries
3. **Vertical scaling** (upgrade instance)
4. **Caching layer** (Redis/Upstash)

### CDN & Edge Caching

```typescript
// app/api/analyze/route.ts
export const runtime = 'edge'; // Run on edge network
export const maxDuration = 60; // Max execution time
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Testing in Production

### Smoke Tests

```bash
# Health check
curl https://yourdomain.com/api/health

# Auth check
curl https://yourdomain.com/api/auth/session

# Analysis check (requires auth)
curl -X POST https://yourdomain.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractText": "Sample contract..."}'
```

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest.js
```

```javascript
// loadtest.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100, // 100 virtual users
  duration: '30s',
};

export default function() {
  let res = http.get('https://yourdomain.com');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

---

## Rollback Procedure

**Vercel** (automatic):
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

**Manual**:
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback multiple commits
git reset --hard HEAD~3
git push --force origin main
```

---

## Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database connected and schema applied
- [ ] OAuth providers configured
- [ ] Payments working (Stripe test mode first)
- [ ] Email notifications working
- [ ] Analytics tracking enabled
- [ ] Error monitoring active (Sentry)
- [ ] Uptime monitoring configured
- [ ] Backups enabled and tested
- [ ] SSL certificate valid
- [ ] DNS configured correctly
- [ ] Performance metrics baseline recorded
- [ ] Security headers verified
- [ ] CORS configured properly
- [ ] Rate limiting tested

---

## Support & Troubleshooting

### Common Issues

**"Database connection failed"**:
- Check DATABASE_URL is correct
- Verify database is accessible from deployment
- Check firewall/security group settings

**"OAuth redirect mismatch"**:
- Verify callback URLs in OAuth app settings
- Ensure NEXTAUTH_URL matches deployment URL

**"API rate limit exceeded"**:
- Check Gemini API quota
- Implement caching for repeated requests
- Consider upgrading API plan

### Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Community**: GitHub Discussions

---

## Success! 🎉

Your BeforeYouSign platform is now live in production!

**Next steps**:
1. Monitor error rates and performance
2. Set up user analytics
3. Configure email campaigns
4. Launch marketing activities
5. Gather user feedback

**Happy deploying!** 🚀
