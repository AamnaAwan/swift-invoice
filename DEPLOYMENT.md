# Netlify Deployment Guide

## Issues Fixed

1. **Hardcoded localhost URLs** - Updated all API calls to use environment variables
2. **Missing Netlify Configuration** - Added netlify.toml with proper build settings
3. **Backend Server Separation** - The Express server needs to be deployed separately
4. **CORS Configuration** - Updated server to accept requests from your Netlify domain

## Deployment Steps

### Step 1: Deploy Backend (Express Server)

The Express server **cannot** be hosted on Netlify directly. Choose one of these options:

**Option A: Render (Recommended - Free tier available)**

1. Go to https://render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repo
4. Set build command: `npm install` (in server directory)
5. Set start command: `node server/index.js`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secret key for JWT tokens
   - `NODE_ENV`: production
7. Deploy and copy the backend URL (e.g., https://your-app.onrender.com)

**Option B: Railway**

1. Go to https://railway.app
2. Create new project from GitHub
3. Select server folder
4. Add environment variables (same as above)
5. Deploy and get the backend URL

**Option C: Heroku**

1. Create account at https://www.heroku.com
2. Connect GitHub and deploy
3. Add environment variables in Settings > Config Vars
4. Get the backend URL

### Step 2: Set Up MongoDB

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Create a database user and get the connection string
4. Copy connection string and use it as `MONGODB_URI` in your backend

### Step 3: Deploy Frontend to Netlify

1. Go to https://netlify.com
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Netlify will auto-detect the build settings from netlify.toml
5. Set environment variables:
   - Go to Site settings > Build & deploy > Environment
   - Add: `VITE_API_URL` = `https://us-central1-swift-invoi.cloudfunctions.net/api/invoices` (from Step 1)
6. Click "Deploy"

## Environment Variables Required

### Backend (.env)

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/invoice-saas
JWT_SECRET=your-secret-key-here
NODE_ENV=production
CLIENT_URL=https://your-domain.netlify.app
PORT=5000
```

### Frontend (Set in Netlify UI)

```
VITE_API_URL=https://us-central1-swift-invoi.cloudfunctions.net/api/invoices
```

## Testing Deployment

1. Visit your Netlify URL
2. Try logging in or registering
3. Check browser DevTools > Network tab to ensure API calls go to your backend
4. Check backend logs to verify requests are received

## Troubleshooting

### "CORS Error" or "Failed to fetch"

- Backend URL in VITE_API_URL is incorrect
- Backend is not running or deployed
- Check backend CORS settings include your Netlify domain

### "Cannot connect to MongoDB"

- MongoDB connection string is wrong
- MongoDB cluster network access not configured
- IP whitelist issue on Render/Railway/Heroku

### Blank page on Netlify

- Check browser console for errors
- Verify build succeeded in Netlify deploy logs
- Clear browser cache and hard refresh

## File Changes Made

- ✅ Created `netlify.toml` - Netlify deployment configuration
- ✅ Created `client/.env.local` - Local development env vars
- ✅ Created `client/.env.production` - Production env vars
- ✅ Created `client/src/api.js` - Centralized API client
- ✅ Updated `server/index.js` - Added environment variable support
- ✅ Updated all pages to use API client instead of hardcoded URLs
- ✅ Created `.env.example` - Template for environment variables

## Next Steps

1. Set up MongoDB Atlas
2. Deploy backend to Render/Railway/Heroku
3. Update `VITE_API_URL` in Netlify environment variables
4. Deploy frontend to Netlify
5. Test the live application
