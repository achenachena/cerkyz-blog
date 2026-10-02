import { getSortedPostsData } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  const entities: Record<string, string> = {
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  };
  return unsafe.replace(/[<>&'"]/g, (character) => entities[character]);
}

export async function GET() {
  const posts = await getSortedPostsData();
  const siteUrl = (process.env.SITE_URL || 'https://cerkzy.xyz').replace(/\/$/, '');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(`${siteUrl}/posts/${encodeURIComponent(post.id)}`)}</link>
      <guid>${escapeXml(`${siteUrl}/posts/${encodeURIComponent(post.id)}`)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description || '')}</description>
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('') || ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-store',
    },
  });
}
