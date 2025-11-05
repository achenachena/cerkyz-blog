# Blog Posts

This directory contains blog posts synced from Notion.

## How It Works

1. Posts are written in Notion database
2. When ready to publish, set Status to "Published" in Notion
3. Run the "Sync from Notion" workflow in GitHub Actions
4. Posts and images are automatically synced here
5. Vercel deploys the changes

## Directory Structure

```
posts/
├── {slug}.md          # Blog post markdown files
├── images/            # Post images
└── README.md          # This file
```

## Setup

To set up Notion sync, you need to add these secrets to the repository:

- `NOTION_SECRET` - Your Notion integration token
- `NOTION_DATABASE` - Your Notion database ID

## Manual Trigger

Go to [Actions](https://github.com/achenachena/cerkyz-blog/actions) → "Sync from Notion" → "Run workflow"
