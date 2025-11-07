# Cerkyz Blog

My personal blog where I write about everything.

🔗 **[Visit the live site](https://cerkzy.xyz)**

## Built With

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Notion** - Content management system

## Features

- Minimalist design with dark mode support
- Dark mode toggle with system preference detection
- Notion-powered content management
- Tag-based organization
- Client-side search functionality
- RSS feed support
- Fully responsive design
- Static site generation for optimal performance
- Image zoom on click

## Writing & Publishing

Posts are written in Notion and fetched directly during build:

1. Write posts in Notion database
2. Set Status to "Published" when ready
3. Trigger a deployment (Vercel auto-deploys on git push, or manually trigger)
4. Blog fetches content directly from Notion API during build

**Note:** All content lives in Notion and is fetched at build time.
