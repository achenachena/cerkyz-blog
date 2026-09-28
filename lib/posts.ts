import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { n2m } from './notion';
import { getPublishedNotionPages, getPostContentCacheKey, pageToPost, type PostData } from './notion-data';
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

  const renderContent = async () => {
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    const processedContent = await remark().use(html).process(mdString.parent);
    return processedContent.toString();
  };

  // Always check live publication status above before using a cached body.
  const key = getPostContentCacheKey(page);
  const content = key
    ? await unstable_cache(renderContent, key, { revalidate: 3600 })()
    : await renderContent();

  return {
    ...pageToPost(page),
    content,
  };
});
