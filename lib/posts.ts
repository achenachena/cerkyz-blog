import { cache } from 'react';
import { n2m, DATABASE_ID } from './notion';
import { remark } from 'remark';
import html from 'remark-html';

const NOTION_SECRET = process.env.NOTION_SECRET;
const REVALIDATE_SECONDS = 3600;

export interface PostData {
  id: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  content?: string;
}

interface NotionTextContent {
  plain_text: string;
}

interface NotionDateProperty {
  start: string;
}

interface NotionSelectItem {
  name: string;
}

interface NotionProperty {
  title?: NotionTextContent[];
  rich_text?: NotionTextContent[];
  date?: NotionDateProperty;
  multi_select?: NotionSelectItem[];
  select?: NotionSelectItem;
}

interface NotionPage {
  id: string;
  properties: {
    [key: string]: NotionProperty;
  };
}

interface NotionPropertyFilter {
  property: string;
  select?: { equals: string };
  rich_text?: { equals: string };
}

type NotionQueryFilter = NotionPropertyFilter | { and: NotionPropertyFilter[] } | { or: NotionPropertyFilter[] };

interface NotionQuerySort {
  property: string;
  direction: 'ascending' | 'descending';
}

interface NotionQueryResponse {
  results: NotionPage[];
}

function getPropertyValue(property: NotionProperty, type: string): string | string[] | null {
  switch (type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || '';
    case 'date':
      return property.date?.start || '';
    case 'multi_select':
      return property.multi_select?.map((item) => item.name) || [];
    case 'select':
      return property.select?.name || '';
    default:
      return null;
  }
}

function pageToPost(page: NotionPage): PostData {
  const props = page.properties;

  return {
    id: (getPropertyValue(props.Slug || props.slug, 'rich_text') as string) || page.id,
    title: getPropertyValue(props.Name || props.name, 'title') as string,
    date: getPropertyValue(props.Date || props.date, 'date') as string,
    description: getPropertyValue(props.Description || props.description, 'rich_text') as string,
    tags: getPropertyValue(props.Tags || props.tags, 'multi_select') as string[],
  };
}

async function queryDatabase(
  filter?: NotionQueryFilter,
  sorts?: NotionQuerySort[]
): Promise<NotionQueryResponse> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filter, sorts }),
      next: { revalidate: REVALIDATE_SECONDS },
    }
  );

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.statusText}`);
  }

  return response.json() as Promise<NotionQueryResponse>;
}

export const getSortedPostsData = cache(async (): Promise<PostData[]> => {
  try {
    const data = await queryDatabase(
      { property: 'Status', select: { equals: 'Published' } },
      [{ property: 'Date', direction: 'descending' }]
    );

    return data.results.map(pageToPost);
  } catch (error) {
    console.error('Error fetching posts from Notion:', error);
    return [];
  }
});

export const getAllPostIds = async () => {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    params: { id: post.id },
  }));
};

export const getPostData = cache(async (id: string): Promise<PostData> => {
  const data = await queryDatabase({
    and: [
      { property: 'Slug', rich_text: { equals: id } },
      { property: 'Status', select: { equals: 'Published' } },
    ],
  });

  if (data.results.length === 0) {
    throw new Error(`Post with id ${id} not found`);
  }

  const page = data.results[0];
  const post = pageToPost(page);

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);

  const processedContent = await remark().use(html).process(mdString.parent);

  return {
    ...post,
    content: processedContent.toString(),
  };
});
