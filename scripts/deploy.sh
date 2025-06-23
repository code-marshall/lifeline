#!/bin/bash

# Build and Deploy Script for Lifeline Project
# This script creates a release branch, builds the project, and deploys it

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting build and deploy process..."

# Get current branch name
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Stash any uncommitted changes
echo "💾 Stashing any uncommitted changes..."
git stash push -m "Auto-stash before deploy $(date)"

# Create and switch to release branch
echo "🌿 Creating/switching to release branch..."
git checkout -B release

# Install dependencies (in case they're not installed)
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building the project..."
npm run build

# Add build files to git (force add dist folder even if ignored)
echo "📁 Adding build files to git..."
git add -A
git add -f dist/

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
git checkout "$CURRENT_BRANCH"

# Restore stashed changes if any
if git stash list | grep -q "Auto-stash before deploy"; then
    echo "♻️  Restoring stashed changes..."
    git stash pop
fi

echo "✅ Build and deploy completed successfully!"
echo "📍 Release branch has been updated with the latest build"
echo "🌐 You can now use the 'release' branch for deployment" 