# Deployment Guide - Shopify Analytics Dashboard

This guide will walk you through deploying the Shopify Analytics Dashboard to Vercel.

## Prerequisites

- Vercel account (free tier works)
- Turso database (already set up)
- GitHub/GitLab repository (optional but recommended)

## Environment Variables

The following environment variables are required for deployment:

```bash
# Database Configuration
TURSO_CONNECTION_URL=your_turso_connection_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here

# Optional: Shopify Integration (for future webhook implementation)
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
```

### Getting Environment Variables

1. **Turso Database** (Already configured):
   - Connection URL: `libsql://db-dfaf74f2-b686-4f44-bf11-fab09249e786-orchids.aws-us-west-2.turso.io`
   - Auth Token: Available in `.env` file

2. **Better Auth Secret** (Already configured):
   - Secret key: Available in `.env` file
   - For production, generate a new one: `openssl rand -base64 32`

3. **Shopify Credentials** (Optional - for future use):
   - Go to Shopify Partners Dashboard
   - Create a new app or use existing app
   - Copy API Key and API Secret

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Shopify Analytics Dashboard"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add all required variables from `.env` file
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add TURSO_CONNECTION_URL
   vercel env add TURSO_AUTH_TOKEN
   vercel env add BETTER_AUTH_SECRET
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Post-Deployment Setup

### 1. Create First User Account

- Visit your deployed app: `https://your-project.vercel.app`
- Click "Register" to create an admin account
- Use this account to access the dashboard

### 2. Verify Database Connection

- Login to your account
- Navigate to `/dashboard`
- You should see 3 tenants with sample data:
  - Acme Store
  - Fashion Boutique
  - Tech Gadgets

### 3. Test API Endpoints

```bash
# Get tenants
curl https://your-project.vercel.app/api/tenants

# Get customers for tenant 1
curl https://your-project.vercel.app/api/customers?tenantId=1&limit=5

# Get orders for tenant 1
curl https://your-project.vercel.app/api/orders?tenantId=1&limit=5
```

## Vercel Configuration

The project includes optimal Vercel configuration:

### `vercel.json` (Optional - Vercel auto-detects Next.js)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Build Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

## Performance Optimization

### Edge Functions (Optional)

For better performance, you can configure Edge Runtime for API routes:

```typescript
// In API route files
export const runtime = 'edge';
```

### Caching Strategy

- Static pages: Cached at edge
- API responses: Consider adding cache headers
- Database queries: Already optimized with indexes

## Monitoring & Debugging

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor page views, performance metrics
3. Track Web Vitals (LCP, FID, CLS)

### Error Tracking

Add error tracking with Sentry (optional):

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Logs

View logs in Vercel Dashboard:
- Go to your project
- Click on "Logs" tab
- Filter by environment (Production/Preview)

## Database Management

### Turso Dashboard

- Access: [turso.tech/app](https://turso.tech/app)
- View tables, run queries
- Monitor database usage

### Running Migrations

If schema changes are needed:

```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit push
```

## Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Scaling Considerations

### Current Setup (Good for MVP/Demo)
- ✅ Turso SQLite: Up to 10GB, 10M rows
- ✅ Vercel Hobby: 100GB bandwidth/month
- ✅ Better Auth: Unlimited users

### When to Scale
- **Traffic**: > 1M requests/month → Upgrade Vercel plan
- **Database**: > 10GB data → Consider PostgreSQL
- **Features**: Add Redis for caching (Upstash)

## Troubleshooting

### Build Failures

1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set
3. **Test locally**: `npm run build`

### Database Connection Issues

1. **Verify Turso credentials** are correct
2. **Check database quota** in Turso dashboard
3. **Test connection** locally first

### Authentication Issues

1. **Verify BETTER_AUTH_SECRET** is set
2. **Clear browser cookies** and try again
3. **Check API route logs** in Vercel

## Security Checklist

- ✅ Environment variables stored in Vercel (encrypted)
- ✅ HTTPS enabled by default
- ✅ Authentication with Better Auth
- ✅ SQL injection protection (Drizzle ORM)
- ✅ CORS configured for API routes
- ⚠️ Add rate limiting for production
- ⚠️ Implement API key authentication for webhooks
- ⚠️ Add CAPTCHA to registration form

## Backup Strategy

### Automated Backups (Turso)
- Turso automatically backs up your database
- Point-in-time recovery available

### Manual Backup
```bash
# Export database
turso db shell your-database .dump > backup.sql

# Import if needed
turso db shell your-database < backup.sql
```

## Next Steps After Deployment

1. **Test all features** in production environment
2. **Set up monitoring** and alerts
3. **Configure custom domain** (optional)
4. **Implement Shopify webhooks** for real-time sync
5. **Add rate limiting** for API endpoints
6. **Set up error tracking** (Sentry)
7. **Create API documentation** with Swagger/OpenAPI

## Support

For issues during deployment:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Turso documentation: [docs.turso.tech](https://docs.turso.tech)
- Better Auth docs: [better-auth.com](https://better-auth.com)

---

**Deployment Status**: Ready for production deployment ✅

The application is fully configured and ready to deploy to Vercel with all necessary environment variables and optimizations in place.
