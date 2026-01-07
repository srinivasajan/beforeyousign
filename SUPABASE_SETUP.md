# Supabase Setup Guide

This guide will help you set up Supabase for the BeforeYouSign application.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Note down your project credentials:
   - Project URL
   - Anon (public) key
   - Service role key

### 2. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 3. Run Database Migrations

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/schema.sql`
5. Click **Run** to execute the schema

This will create:
- All necessary tables
- Row Level Security (RLS) policies
- Database functions and triggers
- Storage buckets for file uploads

### 4. Configure Authentication (Optional)

If you want to use Supabase Auth instead of NextAuth:

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable Email/Password authentication
3. Optionally enable OAuth providers (Google, GitHub, etc.)
4. Configure redirect URLs:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 5. Test the Connection

Run the development server:
```bash
npm run dev
```

The app should now be connected to Supabase!

## 📁 File Structure

```
lib/supabase/
├── client.ts          # Browser client
├── server.ts          # Server client (for Server Components)
├── middleware.ts      # Middleware client (for session refresh)
├── admin.ts           # Admin client (bypasses RLS)
├── types.ts           # TypeScript types for database
└── helpers.ts         # Common database operations

supabase/
└── schema.sql         # Database schema
```

## 🔧 Usage Examples

### Server Components

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('contracts').select('*');
  
  return <div>{/* render data */}</div>;
}
```

### Client Components

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [data, setData] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('contracts').select('*');
      setData(data);
    }
    fetchData();
  }, []);

  return <div>{/* render data */}</div>;
}
```

### API Routes

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('contracts').select('*');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
```

### Using Helper Functions

```typescript
import { 
  getCurrentUserProfile,
  getUserContracts,
  createContract 
} from '@/lib/supabase/helpers';

// Get current user
const user = await getCurrentUserProfile();

// Get user's contracts
const contracts = await getUserContracts(user.id);

// Create a new contract
const newContract = await createContract({
  user_id: user.id,
  title: 'Employment Agreement',
  contract_type: 'employment',
  content: 'Contract text...',
});
```

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS policies enabled:
- Users can only access their own data
- Shared contracts are accessible to all shared users
- Public templates are accessible to everyone
- Admin operations use service role key

### Storage Security

- Contract files are private (only accessible by owner)
- Avatar images are public
- All uploads are scoped to user ID

## 📊 Database Schema

### Main Tables

- **user_profiles**: User account information
- **contracts**: Contract documents and metadata
- **contract_versions**: Version history
- **clauses**: Reusable contract clauses
- **templates**: Contract templates
- **chat_sessions**: AI chat conversations
- **chat_messages**: Individual chat messages
- **notifications**: User notifications
- **user_activity**: Activity logs

### Storage Buckets

- **contracts**: Private contract files
- **avatars**: Public user avatars

## 🔄 Data Migration

If you have existing data in your current database:

1. Export data from your current database
2. Transform to match Supabase schema
3. Use Supabase SQL editor or API to import

Example import script:
```typescript
import { createAdminClient } from '@/lib/supabase/admin';

const supabase = createAdminClient();

// Import contracts
await supabase.from('contracts').insert(contractsData);
```

## 📈 Monitoring & Analytics

Access your Supabase dashboard to monitor:
- Database usage and performance
- API requests
- Storage usage
- Authentication activity
- Real-time connections

## 🆘 Troubleshooting

### Common Issues

**Error: "No API key found"**
- Check that environment variables are set correctly
- Restart the development server after adding env vars

**Error: "Row Level Security policy violation"**
- Ensure you're authenticated
- Check RLS policies match your use case
- Use admin client for operations that bypass RLS

**Error: "relation does not exist"**
- Run the schema.sql file in Supabase SQL Editor
- Check that all migrations completed successfully

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the [troubleshooting guide](https://supabase.com/docs/guides/troubleshooting)

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure environment variables
3. ✅ Run database migrations
4. 🔄 Integrate with existing features:
   - Replace localStorage with Supabase
   - Add real-time subscriptions
   - Implement file uploads
   - Add user authentication
5. 🚀 Deploy to production

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Database Schema](/supabase/schema.sql)
- [Type Definitions](/lib/supabase/types.ts)
- [Helper Functions](/lib/supabase/helpers.ts)
