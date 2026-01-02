#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Ruby dependencies
bundle install

# Install LaTeX packages
echo "Installing LaTeX dependencies..."
apt-get update
apt-get install -y texlive-latex-base texlive-latex-extra texlive-fonts-recommended

# Build frontend
echo "Building frontend..."
cd ../frontend
npm install
npm run build

# Copy frontend build to Rails public directory
echo "Copying frontend build to public directory..."
rm -rf ../backend/public/assets ../backend/public/index.html
cp -r dist/* ../backend/public/

cd ../backend

# Precompile assets (if any)
# bundle exec rake assets:precompile
# bundle exec rake assets:clean
