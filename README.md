# Cerkyz Blog

My personal blog where I write about software development, technology, and other topics that interest me. Built with a minimalist black and white design philosophy that puts content first.

🔗 **[Visit the live site](https://cerkzy.xyz)**

## Built With

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Notion** - Content management system
- **Markdown** - Static content format

## Features

- Minimalist black and white design
- Notion-powered content management
- Automated sync from Notion to GitHub
- Tag-based organization
- Client-side search
- RSS feed
- Fully responsive
- Static site generation for fast loading

## Writing & Publishing

Posts are written in Notion and fetched directly during build:

1. Write posts in Notion database
2. Set Status to "Published" when ready
3. Trigger a deployment (Vercel auto-deploys on git push, or manually trigger)
4. Blog fetches content directly from Notion API during build

**Note:** No markdown files are stored in this repository. All content lives in Notion and is fetched at build time.

## Setup

### Environment Variables

Create a `.env.local` file with:

```env
NOTION_SECRET=your_notion_integration_token
NOTION_DATABASE=your_database_id
```

For Vercel deployment, add these as environment variables in your project settings.

## License

MIT - Feel free to fork and adapt for your own blog!
