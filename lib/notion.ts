import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

// Fetch blocks on every request so Notion's temporary image URLs stay fresh.
// Vercel's runtime filesystem cannot persist new files in public/.
export const notion = new Client({
  auth: process.env.NOTION_SECRET,
  fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }),
});

export const n2m = new NotionToMarkdown({ notionClient: notion });
