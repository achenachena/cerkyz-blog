import { notion, n2m, DATABASE_ID } from './notion';
import { remark } from 'remark';
import html from 'remark-html';

export interface PostData {
  id: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  content?: string;
}

interface NotionPage {
  id: string;
  properties: {
    [key: string]: any;
  };
}

// Helper to extract property values from Notion
function getPropertyValue(property: any, type: string): any {
  switch (type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || '';
    case 'date':
      return property.date?.start || '';
    case 'multi_select':
      return property.multi_select?.map((item: any) => item.name) || [];
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
    id: getPropertyValue(props.Slug || props.slug, 'rich_text') || page.id,
    title: getPropertyValue(props.Name || props.name, 'title'),
    date: getPropertyValue(props.Date || props.date, 'date'),
    description: getPropertyValue(props.Description || props.description, 'rich_text'),
    tags: getPropertyValue(props.Tags || props.tags, 'multi_select'),
  };
}

export async function getSortedPostsData(): Promise<PostData[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    const posts = response.results.map((page: any) => pageToPost(page));
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
    // First, get all posts and find the one with matching id
    const allPosts = await getSortedPostsData();
    const post = allPosts.find((p) => p.id === id);

    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    // Find the actual page by querying for slug or using page ID
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        or: [
          {
            property: 'Slug',
            rich_text: {
              equals: id,
            },
          },
          {
            property: 'slug',
            rich_text: {
              equals: id,
            },
          },
        ],
      },
    });

    let pageId: string;
    if (response.results.length > 0) {
      pageId = response.results[0].id;
    } else {
      // Fallback: id might be the page ID itself
      pageId = id;
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
