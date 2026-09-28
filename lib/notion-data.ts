export interface PostData {
  id: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  content?: string;
}

interface NotionText {
  plain_text: string;
}

interface NotionProperty {
  title?: NotionText[];
  rich_text?: NotionText[];
  date?: { start: string } | null;
  multi_select?: { name: string }[];
}

export interface NotionPage {
  id: string;
  created_time: string;
  properties: Record<string, NotionProperty>;
}

interface QueryResponse {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
}

export function pageToPost(page: NotionPage): PostData {
  const props = page.properties;
  const title = props.Name || props.name;
  const slug = props.Slug || props.slug;
  const date = props.Date || props.date;
  const description = props.Description || props.description;
  const tags = props.Tags || props.tags;

  return {
    id: slug?.rich_text?.map((text) => text.plain_text).join('').trim() || page.id,
    title: title?.title?.map((text) => text.plain_text).join('') || 'Untitled',
    date: date?.date?.start || page.created_time,
    description: description?.rich_text?.map((text) => text.plain_text).join('') || '',
    tags: tags?.multi_select?.map((tag) => tag.name) || [],
  };
}

export async function getPublishedNotionPages(): Promise<NotionPage[]> {
  const secret = process.env.NOTION_SECRET;
  const databaseId = process.env.NOTION_DATABASE;
  if (!secret || !databaseId) {
    throw new Error('NOTION_SECRET and NOTION_DATABASE must be configured');
  }

  const pages: NotionPage[] = [];
  let cursor: string | null = null;
  do {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Status', select: { equals: 'Published' } },
        sorts: [{ property: 'Date', direction: 'descending' }],
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      // Do not turn an upstream failure into an apparently empty blog.
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json() as QueryResponse;
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return pages;
}
