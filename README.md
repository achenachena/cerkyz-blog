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

Publication status and metadata are read directly from Notion on each request. Article HTML is cached by page ID and Notion’s `last_edited_time`, so unchanged articles avoid repeated block requests and Markdown conversion; edits select a new cache entry immediately. No cron job, webhook, or redeployment is required for content changes.

1. Create a page in the connected Notion database.
2. Fill in `Name` (title), `Slug` (unique URL segment), and `Date`. `Description` and `Tags` are optional.
3. Write the article in the page body.
4. Set `Status` (a Select property) to exactly `Published`.
5. Open or refresh the blog. The homepage, search, article, and RSS read the latest published content.

Changing a published article updates it on the next server request. Changing its status away from `Published` removes it from fresh listings and makes fresh requests to its URL return 404. Visible article links and home/search links prefetch their destination; the browser reuses prefetched or visited pages for 30 seconds to make navigation fast. During that window a tab can still show an earlier version, including an article just unpublished. Refresh the browser to immediately check Notion. Browser back/forward may also restore an earlier view. RSS readers control their own refresh schedule. Notion API availability and latency affect first visits and cache misses.

Image URLs are fetched with each new article body. Body cache keys rotate on requests every 30 minutes, before Notion’s one-hour image URLs expire; no scheduled job is used. Images are not written to the deployment filesystem. If an image URL expires in a long-open tab, refresh the article.

## Deployment

Vercel production uses the `main` branch. Code and dependency changes require a deployment; article changes do not. Configure `NOTION_SECRET` and `NOTION_DATABASE` in Vercel for each environment. `SITE_URL` is optional and defaults to `https://cerkzy.xyz` for RSS.

Copy `.env.example` to `.env.local` for local development and fill in the Notion credentials. Never commit credentials.

## Validation

Use Node.js 22.18 or newer, then run:

```sh
npm ci
npm test
npm run lint
npm run build
```
