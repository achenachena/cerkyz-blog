# Cerkyz Blog

My personal blog where I write about everything.

🔗 **[Visit the live site](https://cerkzy.xyz)**

## Built With

- **Next.js 16** - React framework with App Router
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
- Live Notion content on every page request
- Image zoom on click

## Writing & Publishing

Posts are read directly from Notion on each request. No cron job, webhook, or redeployment is required for content changes.

1. Create a page in the connected Notion database.
2. Fill in `Name` (title), `Slug` (unique URL segment), and `Date`. `Description` and `Tags` are optional.
3. Write the article in the page body.
4. Set `Status` (a Select property) to exactly `Published`.
5. Open or refresh the blog. The homepage, search, article, and RSS read the latest published content.

Changing a published article updates it on the next request. Changing its status away from `Published` removes it from listings and makes its URL return 404. Already-open browser pages need a refresh; RSS readers control their own refresh schedule. Notion API availability and latency affect page loading.

Images use fresh Notion URLs fetched with the article, without writing to the deployment filesystem. If an image URL expires in a long-open tab, refresh the article.

## Deployment

Vercel production uses the `main` branch. Code and dependency changes require a deployment; article changes do not. Configure `NOTION_SECRET` and `NOTION_DATABASE` in Vercel for each environment. `SITE_URL` is optional and defaults to `https://cerkzy.xyz` for RSS.

Use a supported, patched Next.js release: Vercel rejects vulnerable versions (the old 16.0.1 deployment failed with `VULNERABLE_NEXTJS_VERSION`).

## Validation

Use Node.js 22.18 or newer, then run:

```sh
npm ci
npm test
npm run lint
npm run build
```
