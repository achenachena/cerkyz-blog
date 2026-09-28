import { cache } from 'react';
import { notFound } from 'next/navigation';
import { n2m } from './notion';
import { getPublishedNotionPages, pageToPost, type PostData } from './notion-data';
import { remark } from 'remark';
import html from 'remark-html';

export type { PostData } from './notion-data';

// React cache only deduplicates work within the current render, not across visits.
const getPublishedPages = cache(getPublishedNotionPages);

export const getSortedPostsData = cache(async (): Promise<PostData[]> => {
  return (await getPublishedPages()).map(pageToPost);
});

export const getPostData = cache(async (id: string): Promise<PostData> => {
  const pages = await getPublishedPages();
  const page = pages.find((item) => pageToPost(item).id === id);
  if (!page) notFound();

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  const processedContent = await remark().use(html).process(mdString.parent);

  return {
    ...pageToPost(page),
    content: processedContent.toString(),
  };
});
