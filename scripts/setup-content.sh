#!/bin/bash

# Setup blog content
echo "Setting up blog content..."

# Copy images to public directory
mkdir -p public/images/posts
if [ -d "posts/images" ]; then
  cp -r posts/images/* public/images/posts/ 2>/dev/null || true
  echo "Images copied to public directory"
else
  echo "No images directory found in posts/"
fi
