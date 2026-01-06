# 🚀 Quick Start - Production Deployment

## ⚡ 5-Minute Deploy (Vercel)

### Prerequisites
- GitHub account ✅
- Vercel account (free): https://vercel.com
- Gemini API key: https://aistudio.google.com/app/apikey

### Steps

**1. Push to GitHub** ✅ (Already done!)

**2. Deploy to Vercel**
```bash
# Go to: https://vercel.com/new
# Import your repo
# Click Deploy
```

**3. Add Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

**Required (minimum)**:
```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=run-this-command-openssl-rand-base64-32
GEMINI_API_KEY=your-gemini-api-key-here
```

**4. Done!** 🎉

Your app is live at `https://your-app.vercel.app`

---

## 🗄️ Database Setup (10 minutes)

### Option A: Vercel Postgres (Easiest)

1. **Create Database**
   - Go to Vercel Dashboard → Storage → Create
   - Select Postgres
   - Click Create

2. **Get Connection String**
   - Copy `POSTGRES_URL` and `POSTGRES_URL_NON_POOLING`
   
3. **Add to Vercel**
   ```env
   DATABASE_URL=<POSTGRES_URL_from_vercel>
   DIRECT_URL=<POSTGRES_URL_NON_POOLING_from_vercel>
   ```

4. **Run Schema**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Link project
   vercel link
   
   # Run migrations
   vercel env pull .env.local
   npx prisma db push
   ```

### Option B: Supabase (More features)

1. **Create Project**: https://supabase.com/dashboard
2. **Get Connection String**: Settings → Database
3. **Add to Vercel**:
   ```env
   DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
   ```
4. **Run Schema**:
   ```bash
   psql <DATABASE_URL> < database-schema.sql
   ```

---

## 🔐 OAuth Setup (Optional - 15 minutes)

### GitHub OAuth

1. **Create OAuth App**
   - GitHub → Settings → Developer settings → OAuth Apps
   - New OAuth App

2. **Configure**:
   ```
   Application name: BeforeYouSign
   Homepage URL: https://your-app.vercel.app
   Callback URL: https://your-app.vercel.app/api/auth/callback/github
   ```

3. **Get Credentials**
   - Copy Client ID and Client Secret

4. **Add to Vercel**:
   ```env
   GITHUB_ID=your-client-id
   GITHUB_SECRET=your-client-secret
   ```

### Google OAuth

1. **Create OAuth Client**
   - Google Cloud Console → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID

2. **Configure**:
   ```
   Authorized redirect URIs:
   https://your-app.vercel.app/api/auth/callback/google
   ```

3. **Add to Vercel**:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

---

## 💳 Payments Setup (Stripe - 20 minutes)

### Create Stripe Account

1. **Sign Up**: https://stripe.com
2. **Get API Keys**: Dashboard → Developers → API keys
3. **Add to Vercel**:
   ```env
   STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
   STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
   ```

### Setup Webhooks

1. **Create Webhook**: Dashboard → Developers → Webhooks
2. **Endpoint URL**: `https://your-app.vercel.app/api/webhooks/stripe`
3. **Events to listen**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. **Get Webhook Secret**:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## 📊 Monitoring Setup (Optional - 10 minutes)

### Vercel Analytics (Free - Auto-enabled)
No setup needed! Automatically tracks page views.

### Sentry Error Tracking

1. **Create Project**: https://sentry.io
2. **Get DSN**: Settings → Client Keys
3. **Install**:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard -i nextjs
   ```
4. **Add to Vercel**:
   ```env
   SENTRY_DSN=your-dsn-here
   ```

---

## ✅ Post-Deployment Checklist

- [ ] App loads at production URL
- [ ] Sign-in works (email/password)
- [ ] OAuth works (GitHub/Google)
- [ ] Contract analysis works
- [ ] Database connected (check logs)
- [ ] Error tracking active
- [ ] Analytics tracking
- [ ] Custom domain configured (optional)
- [ ] SSL certificate valid ✅ (auto)

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` format
- Verify database is running
- Check IP whitelist (Supabase)

### "OAuth redirect mismatch"
- Verify callback URLs match exactly
- Include `/api/auth/callback/[provider]`

### "Gemini API error"
- Check API key is valid
- Verify billing enabled
- Check rate limits

### "Build failed"
- Run `npm run build` locally
- Check for TypeScript errors
- Verify all dependencies installed

---

## 🚀 Go Live Checklist

### Before Launch:
- [ ] Test all critical flows
- [ ] Run security audit
- [ ] Set up backups
- [ ] Configure monitoring
- [ ] Prepare support channels

### Launch Day:
- [ ] Switch to production Stripe keys
- [ ] Enable production database
- [ ] Remove test data
- [ ] Monitor error rates
- [ ] Watch performance metrics

### Post-Launch:
- [ ] Collect user feedback
- [ ] Monitor conversion rates
- [ ] Track key metrics
- [ ] Plan first iteration

---

## 📚 Useful Commands

```bash
# Deploy to Vercel
vercel --prod

# Check logs
vercel logs

# Open dashboard
vercel

# Environment variables
vercel env pull
vercel env ls

# Database
npx prisma studio         # Open database GUI
npx prisma db push        # Push schema changes
npx prisma migrate dev    # Create migration

# Testing
npm run build            # Test build
npm run start            # Test production locally
```

---

## 🎯 Performance Targets

- **Page Load**: < 2 seconds
- **API Response**: < 500ms
- **AI Analysis**: < 10 seconds
- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%

---

## 🆘 Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **GitHub Issues**: Create an issue in your repo

---

## 🎉 You're Live!

Your BeforeYouSign platform is production-ready and deployed!

**Next Steps**:
1. Test everything thoroughly
2. Invite beta users
3. Start marketing
4. Collect feedback
5. Iterate and improve

**Welcome to production!** 🚀
