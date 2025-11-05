import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

if (!process.env.NOTION_SECRET) {
  throw new Error('NOTION_SECRET environment variable is not set');
}

if (!process.env.NOTION_DATABASE) {
  throw new Error('NOTION_DATABASE environment variable is not set');
}

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const n2m = new NotionToMarkdown({ notionClient: notion });

export const DATABASE_ID = process.env.NOTION_DATABASE;
