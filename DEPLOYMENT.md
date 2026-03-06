# Deployment Guide for Render

This guide will help you deploy the Niche Finder Pro application to Render.com.

## Overview

The application consists of two services:
1. **Frontend**: Static React application (deployed as Static Site)
2. **Backend**: Node.js API server (deployed as Web Service)

## Prerequisites

- GitHub account with the repository
- Render.com account
- GitHub repository connected to Render

## Deployment Steps

### 1. Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub account
4. Select the `niche-finder-app` repository

### 2. Deploy Backend API

1. In Render Dashboard, click "New" → "Web Service"
2. Connect GitHub repository: `Muro-Testing/niche-finder-app`
3. Configure the service:
   - **Name**: `niche-finder-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (for testing) or choose appropriate plan
4. Add environment variables:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
5. Click "Create Web Service"

### 3. Deploy Frontend

1. In Render Dashboard, click "New" → "Static Site"
2. Connect GitHub repository: `Muro-Testing/niche-finder-app`
3. Configure the site:
   - **Name**: `niche-finder-frontend`
   - **Branch**: `main`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Click "Create Static Site"

### 4. Update API Configuration

After deployment, you need to update the frontend to point to your backend API:

1. Go to your frontend site settings in Render
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://niche-finder-api.onrender.com/api` (replace with your actual backend URL)

3. Trigger a new build of the frontend

## Service URLs

After deployment, you'll have two URLs:
- **Frontend**: `https://niche-finder-frontend.onrender.com`
- **Backend API**: `https://niche-finder-api.onrender.com`

## Environment Variables

### Backend (Web Service)
- `PORT`: Port number (default: 10000)
- `NODE_ENV`: Environment (production)

### Frontend (Static Site)
- `VITE_API_URL`: Backend API URL

## Database

The application uses SQLite for simplicity. For production deployment:

1. **Option 1**: Use Render's PostgreSQL database
   - Create a PostgreSQL database in Render
   - Update the backend database configuration
   - Run database migrations

2. **Option 2**: Keep SQLite (for demo purposes)
   - The application will use an in-memory database
   - Data will be reset on each deployment

## Monitoring

- Check deployment logs in Render Dashboard
- Monitor API endpoints using the frontend
- Test all functionality after deployment

## Troubleshooting

### Frontend not connecting to API
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure both services are deployed and running

### Build failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript compilation errors

### Database issues
- For SQLite: Ensure proper file permissions
- For PostgreSQL: Verify connection string and credentials

## Scaling

- **Free Plan**: Limited resources, suitable for testing
- **Standard Plan**: Better performance, suitable for production
- Consider upgrading based on traffic and performance needs

## Cost

- Static Site: Free
- Web Service: Free tier available, paid plans for production use
- Database: Additional cost if using PostgreSQL

## Support

For issues with deployment:
1. Check Render documentation
2. Review deployment logs
3. Verify environment variables
4. Test locally before deploying