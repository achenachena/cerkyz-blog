#!/bin/bash

# Setup content from private submodule
echo "Setting up blog content..."

# Check if posts directory is empty or doesn't have content
if [ ! -f "posts/bitcoin-11-04.md" ]; then
  echo "Posts directory is empty, cloning content repository..."

  # Remove posts directory if it exists but is empty
  rm -rf posts

  # Clone the private content repository using GITHUB_TOKEN
  if [ -n "$GITHUB_TOKEN" ]; then
    git clone https://${GITHUB_TOKEN}@github.com/achenachena/cerkyz-blog-content.git posts
    echo "Content repository cloned successfully"
  else
    echo "ERROR: GITHUB_TOKEN not set"
    exit 1
  fi
else
  echo "Content already available"
fi

# Copy images to public directory
mkdir -p public/images/posts
cp -r posts/images/* public/images/posts/ 2>/dev/null || true
echo "Images copied to public directory"
