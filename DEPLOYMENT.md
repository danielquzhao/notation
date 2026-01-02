# Deployment Guide - Render (Single Service)

This guide explains how to deploy the Notation app as a single service on Render, where Rails serves both the API and the React frontend.

## Architecture

- **Single Web Service**: Rails backend serves both API endpoints (`/api/*`) and the React frontend (all other routes)
- **Build Process**: Frontend is built during deployment and copied to Rails `public/` directory
- **LaTeX**: System packages installed during build for PDF compilation

## Prerequisites

1. GitHub/GitLab account with your repository
2. Render account (free tier available)
3. Gemini API key

## Deployment Steps

### 1. Prepare Your Repository

Ensure all changes are committed and pushed to your Git repository:

```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### 2. Get Rails Master Key

You'll need the Rails master key for encrypted credentials:

```bash
cat backend/config/master.key
```

**Important**: Keep this key secure and never commit it to Git.

### 3. Deploy to Render

1. **Sign in to Render**: Go to https://render.com and sign in
2. **New Blueprint**: Click "New" → "Blueprint"
3. **Connect Repository**: Connect your GitHub/GitLab repository
4. **Apply Blueprint**: Render will detect `render.yaml` and create the service automatically

### 4. Set Environment Variables

In the Render dashboard, go to your service settings and set:

- `RAILS_MASTER_KEY`: Paste the value from `backend/config/master.key`
- `GEMINI_API_KEY`: Your Gemini API key

### 5. Deploy

Render will automatically build and deploy your application. The build process:

1. Installs Ruby dependencies
2. Installs LaTeX packages (texlive)
3. Builds React frontend
4. Copies frontend build to Rails `public/` directory
5. Starts Rails server

### 6. Access Your App

Once deployed, your app will be available at:
- `https://notation.onrender.com` (or your custom URL)
- Frontend: All routes (e.g., `/`, `/viewer`)
- API: `/api/convert`, `/api/compile`

## Local Development

The setup supports local development with frontend and backend running separately:

### Start Backend (Terminal 1)
```bash
cd backend
bundle exec rails server
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

The Vite proxy will forward API requests from `http://localhost:5173/api/*` to `http://localhost:3000/api/*`.

## Troubleshooting

### Build Fails on LaTeX Installation

If LaTeX installation fails, check the build logs in Render dashboard. You may need to adjust the packages in `backend/bin/render-build.sh`.

### Frontend Not Displaying

1. Check that frontend build succeeded in logs
2. Verify `RAILS_SERVE_STATIC_FILES=enabled` is set
3. Check that files exist in `backend/public/` after build

### API Endpoints Not Working

1. Verify routes are under `/api` scope in `backend/config/routes.rb`
2. Check frontend is calling `/api/convert` and `/api/compile`
3. Review Rails logs in Render dashboard

### Master Key Issues

If you see errors about encrypted credentials:
1. Ensure `RAILS_MASTER_KEY` is set in Render dashboard
2. Verify the key matches `backend/config/master.key`
3. Never commit `master.key` to Git

## Cost

- **Free Tier**: Sufficient for development/testing
  - Service spins down after 15 minutes of inactivity
  - Slower cold starts
- **Paid Tier** ($7+/month): For production use
  - Always-on service
  - Better performance
  - Custom domains

## Updates

To deploy updates:

1. Make changes locally
2. Commit and push to Git
3. Render automatically deploys on push to main branch

## Alternative: Two-Service Deployment

If you prefer separate backend and frontend services (better performance):
1. Use separate `render.yaml` configurations
2. Frontend as Static Site (with CDN)
3. Backend as Web Service
4. Configure CORS in Rails

See Render documentation for multi-service blueprints.
