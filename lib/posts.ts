import { n2m, DATABASE_ID } from './notion';
import { remark } from 'remark';
import html from 'remark-html';

const NOTION_SECRET = process.env.NOTION_SECRET;

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

interface NotionQueryFilter {
  property: string;
  select?: { equals: string };
  rich_text?: { equals: string };
}

interface NotionQuerySort {
  property: string;
  direction: 'ascending' | 'descending';
}

interface NotionQueryResponse {
  results: NotionPage[];
}

// Helper to extract property values from Notion
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

// Convert Notion page to PostData
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

// Query Notion database using fetch
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
      body: JSON.stringify({
        filter,
        sorts,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.statusText}`);
  }

  return response.json() as Promise<NotionQueryResponse>;
}

export async function getSortedPostsData(): Promise<PostData[]> {
  try {
    const data = await queryDatabase(
      {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
      [
        {
          property: 'Date',
          direction: 'descending',
        },
      ]
    );

    const posts = data.results.map((page) => pageToPost(page));
    return posts;
  } catch (error) {
    console.error('Error fetching posts from Notion:', error);
    return [];
  }
}

export async function getAllPostIds() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    params: {
      id: post.id,
    },
  }));
}

export async function getPostData(id: string): Promise<PostData> {
  try {
    // First, get all posts and find the one with matching id (slug)
    const allPosts = await getSortedPostsData();
    const post = allPosts.find((p) => p.id === id);

    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    // Query to find the actual Notion page ID
    // We need to find the page where Slug property equals our id
    const data = await queryDatabase({
      property: 'Slug',
      rich_text: {
        equals: id,
      },
    });

    let pageId: string;
    if (data.results.length > 0) {
      pageId = data.results[0].id;
    } else {
      // If not found by slug, try to find by matching the page ID from allPosts
      // The page ID might be stored directly
      // We'll need to get the page ID another way - query without filter
      const allData = await queryDatabase({
        property: 'Status',
        select: {
          equals: 'Published',
        },
      });

      const foundPage = allData.results.find((page) => {
        const slug = getPropertyValue(page.properties.Slug || page.properties.slug, 'rich_text');
        return slug === id;
      });

      if (!foundPage) {
        throw new Error(`Could not find Notion page for post ${id}`);
      }

      pageId = foundPage.id;
    }

    // Get the page content
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(mdString.parent);
    const contentHtml = processedContent.toString();

    return {
      ...post,
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
}

export async function getPostsByTag(tag: string): Promise<PostData[]> {
  const allPosts = await getSortedPostsData();
  return allPosts.filter((post) => post.tags?.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
  const allPosts = await getSortedPostsData();
  const tags = new Set<string>();
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
