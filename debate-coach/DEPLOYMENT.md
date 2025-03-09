# Deploying to Vercel

This document provides instructions for deploying the Debate Coach application to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. A Supabase project (https://app.supabase.com)
3. An OpenAI API key (https://platform.openai.com)
4. (Optional) A Stripe account for payment processing (https://stripe.com)

## Setup Supabase

1. Create a new Supabase project or use an existing one
2. Run the SQL migrations in the `sql/reset_database_complete.sql` file to set up the database tables

## Environment Variables

Set the following environment variables in your Vercel project:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SUPABASE_PASSWORD=your-supabase-password

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration (if using Stripe)
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_PREMIUM_PRICE_ID=your-stripe-price-id

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-vercel-app-url
NODE_ENV=production
```

## Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to Vercel and create a new project
3. Connect your Git repository
4. Configure the project:
   - Set the framework preset to Next.js
   - Set the root directory to `debate-coach` (if your repository has multiple projects)
   - Set the environment variables as described above
5. Click "Deploy"

## Post-Deployment

1. After deployment, update the `NEXT_PUBLIC_APP_URL` environment variable with the actual URL of your deployed application
2. Set up Stripe webhooks (if using Stripe) to point to your deployed application's `/api/webhooks/stripe` endpoint

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Vercel deployment logs
2. Verify that all environment variables are set correctly
3. Ensure that the Supabase database tables are set up correctly
4. Check that the OpenAI API key is valid and has sufficient credits 