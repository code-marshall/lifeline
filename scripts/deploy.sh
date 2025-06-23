#!/bin/bash

# Build and Deploy Script for Lifeline Project
# This script creates a release branch, builds the project, and deploys it

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting build and deploy process..."

# Get current branch name
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Commit any uncommitted changes in main first
echo "💾 Committing any changes in main branch..."
git add -A
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit in main"
else
    git commit -m "Auto-commit before deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "✅ Changes committed in main branch"
fi

# Stash any remaining uncommitted changes
echo "💾 Stashing any remaining uncommitted changes..."
git stash push -m "Auto-stash before deploy $(date)" || echo "No changes to stash"

# Create and switch to release branch
echo "🌿 Creating/switching to release branch..."
git checkout -B release

# Install dependencies (in case they're not installed)
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building the project..."
npm run build

# Clean up: remove everything except dist folder
echo "🧹 Cleaning up - removing all files except dist..."
find . -maxdepth 1 -not -name '.' -not -name '..' -not -name '.git' -not -name 'dist' -exec rm -rf {} + 2>/dev/null || true
# Also clean up any remaining cache folders
rm -rf .vite node_modules 2>/dev/null || true

# Move everything from dist to root
echo "📁 Moving build files from dist to root..."
mv dist/* . 2>/dev/null || true
mv dist/.* . 2>/dev/null || true  # Move hidden files if any
rmdir dist 2>/dev/null || true   # Remove empty dist folder

# Add all files to git
echo "📁 Adding build files to git..."
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit the build
    echo "💾 Committing build files..."
    git commit -m "Build: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Force push to release branch
echo "🚢 Force pushing to release branch..."
git push origin release --force

# Switch back to original branch
echo "🔄 Switching back to $CURRENT_BRANCH branch..."
# Clean up any remaining files that might prevent checkout
rm -rf .vite node_modules 2>/dev/null || true
git checkout "$CURRENT_BRANCH"

# Restore stashed changes if any
if git stash list | grep -q "Auto-stash before deploy"; then
    echo "♻️  Restoring stashed changes..."
    git stash pop
fi

echo "✅ Build and deploy completed successfully!"
echo "📍 Release branch has been updated with clean build files in root"
echo "🌐 Perfect for GitHub Pages or static hosting deployment" 