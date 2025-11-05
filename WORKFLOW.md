# Content Management Workflow

This document describes how to manage blog content with the private submodule setup.

## Repository Structure

- **cerkyz-blog** (public) - The blog engine and code
- **cerkyz-blog-content** (private) - Blog posts and images

## Adding a New Blog Post

### 1. Navigate to Content Repository

```bash
cd posts/
```

### 2. Create Your Post

Create a new markdown file with front matter:

```bash
# Example: my-new-post.md
---
title: 'Your Post Title'
date: 'YYYY-MM-DD'
description: 'Brief description for SEO'
tags: ['tag1', 'tag2']
---

Your content here...
```

### 3. Add Images (Optional)

```bash
# Add images to the images/ directory
cp ~/Downloads/chart.png images/
```

Reference in your markdown:
```markdown
![Description](/images/posts/chart.png)
```

### 4. Commit and Push Content

```bash
git add .
git commit -m "feat: add new blog post"
git push origin main
```

### 5. Update Main Repository

```bash
cd ..  # Back to main repo
git add posts/
git commit -m "chore: update content submodule"
git push origin develop
```

### 6. Deploy to Production

```bash
git checkout main
git merge develop
git push origin main
```

Vercel will automatically deploy your changes!

## Quick Update Workflow

If you just want to update content without changing code:

```bash
# Update content
cd posts/
# ... make changes ...
git add . && git commit -m "update: article content" && git push

# Update submodule reference and deploy
cd ..
git add posts/ && git commit -m "chore: update content" && git push origin main
```

## Pulling Latest Content

When working on a new machine or after others update content:

```bash
git pull origin main
git submodule update --init --recursive
```

## Troubleshooting

### Submodule shows as modified

```bash
cd posts/
git pull origin main
cd ..
git add posts/
git commit -m "chore: update content submodule reference"
```

### Build fails on Vercel

Ensure Vercel has access to the private content repository:
1. GitHub Settings > Applications > Vercel
2. Grant access to `cerkyz-blog-content` repository

### Images not showing

1. Check images are in `posts/images/`
2. Reference as `/images/posts/filename.png` in markdown
3. The prebuild script copies them automatically
