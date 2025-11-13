# 🚀 Quick Deployment Guide

## ✅ What's Already Done:
- ✅ GitHub Repository: https://github.com/sonyho2715/ai-prompts-marketplace
- ✅ Railway Project Created
- ✅ Vercel Project Linked
- ✅ NextAuth Secret Generated: `***REMOVED***`

## 🎯 Quick Setup (2 minutes):

### Option 1: Railway Database (Recommended)

1. **Get Railway Database URL**:
   - Open: https://railway.app/project/5663a803-ed8e-4949-9dd8-5772a9e7606f
   - Click on the **Postgres** service
   - Go to **Variables** tab
   - Copy the **DATABASE_URL** value

2. **Run This Command** (paste the DATABASE_URL):
   ```bash
   DATABASE_URL="postgresql://..." ./deploy-to-railway.sh
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod \
     -e DATABASE_URL="postgresql://..." \
     -e NEXTAUTH_URL="https://ai-prompts-marketplace.vercel.app" \
     -e NEXTAUTH_SECRET="***REMOVED***"
   ```

### Option 2: Neon Database (Free Serverless)

1. **Create Neon Database**:
   - Open: https://neon.tech
   - Sign up/Login with GitHub
   - Create new project: **ai-prompts-marketplace**
   - Copy the **Connection String**

2. **Run This Command**:
   ```bash
   DATABASE_URL="postgresql://..." ./deploy-to-railway.sh
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod \
     -e DATABASE_URL="postgresql://..." \
     -e NEXTAUTH_URL="https://ai-prompts-marketplace.vercel.app" \
     -e NEXTAUTH_SECRET="***REMOVED***"
   ```

## 📝 What Happens:
1. Migrations create database tables
2. Seed adds 1000 prompts + categories + pricing tiers
3. Vercel deploys the frontend
4. Your site goes live!

## 🔗 Final URLs:
- **Production Site**: https://ai-prompts-marketplace.vercel.app
- **GitHub Repo**: https://github.com/sonyho2715/ai-prompts-marketplace
- **Railway Project**: https://railway.app/project/5663a803-ed8e-4949-9dd8-5772a9e7606f

## 🔑 Test Account:
- Email: test@example.com
- Password: password123
- Access: Complete tier (all 1000 prompts)

---

**Need help? Just paste your DATABASE_URL and I'll do the rest!**
