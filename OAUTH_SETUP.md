# OAuth Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for the AI Prompts Marketplace.

## Prerequisites

- A deployed instance on Vercel (or your production URL)
- Access to Google Cloud Console
- Access to GitHub Developer Settings

---

## 1. Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it: `AI Prompts Marketplace`
4. Click **Create**

### Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: `AI Prompts Marketplace`
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue** through all screens

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `AI Prompts Marketplace`
   - Authorized JavaScript origins:
     ```
     https://your-domain.vercel.app
     http://localhost:3001
     ```
   - Authorized redirect URIs:
     ```
     https://your-domain.vercel.app/api/auth/callback/google
     http://localhost:3001/api/auth/callback/google
     ```
   - Click **Create**

5. Copy the **Client ID** and **Client Secret**

### Step 4: Add to Environment Variables

**Locally (.env.local):**
```bash
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

**On Vercel:**
```bash
vercel env add GOOGLE_CLIENT_ID production
# Paste your Google Client ID

vercel env add GOOGLE_CLIENT_SECRET production
# Paste your Google Client Secret
```

---

## 2. GitHub OAuth Setup

### Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**

### Step 2: Configure the App

- **Application name**: `AI Prompts Marketplace`
- **Homepage URL**: `https://your-domain.vercel.app`
- **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`
- Click **Register application**

### Step 3: Get Credentials

1. After creation, you'll see your **Client ID**
2. Click **Generate a new client secret**
3. Copy both the **Client ID** and **Client Secret**

### Step 4: Add to Environment Variables

**Locally (.env.local):**
```bash
GITHUB_ID="your-github-client-id-here"
GITHUB_SECRET="your-github-client-secret-here"
```

**On Vercel:**
```bash
vercel env add GITHUB_ID production
# Paste your GitHub Client ID

vercel env add GITHUB_SECRET production
# Paste your GitHub Client Secret
```

---

## 3. Testing Locally

1. Make sure your `.env.local` file has all 4 OAuth variables
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Go to `http://localhost:3001/login`
4. Click "Continue with Google" or "Continue with GitHub"
5. Complete the OAuth flow

---

## 4. Deploy to Production

After adding environment variables to Vercel:

```bash
# Redeploy to pick up new environment variables
vercel --prod
```

---

## 5. Verify It Works

1. Go to your production URL
2. Click **Login**
3. Try both "Continue with Google" and "Continue with GitHub"
4. You should be redirected to the provider, then back to your dashboard

---

## Troubleshooting

### "redirect_uri_mismatch" Error (Google)
- Make sure the redirect URI in Google Cloud Console exactly matches:
  `https://your-domain.vercel.app/api/auth/callback/google`
- No trailing slashes
- Use the exact domain from Vercel

### "The redirect_uri MUST match the registered callback URL" (GitHub)
- Verify the callback URL in GitHub OAuth App settings
- Should be: `https://your-domain.vercel.app/api/auth/callback/github`

### "Configuration error" in NextAuth
- Check that all environment variables are set in Vercel
- Redeploy after adding environment variables
- Verify variable names are exact (case-sensitive)

### Users Can't Sign In
- Check browser console for errors
- Verify OAuth apps are not in "Testing" mode (Google)
- Ensure callbacks are on the allowed list

---

## Security Notes

1. **Never commit** `.env.local` or `.env` files to git
2. Rotate secrets periodically
3. Use different OAuth apps for development and production
4. Monitor OAuth app usage in respective dashboards

---

## Current Production URLs

Based on your deployment:
- Production: `https://ai-prompts-marketplace-3wou67u4a-sony-hos-projects.vercel.app`
- Permanent URL: `https://ai-prompts-marketplace.vercel.app` (recommended)

Use the permanent URL when setting up OAuth apps for consistency.
