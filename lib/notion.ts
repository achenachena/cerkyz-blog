import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

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

// Utility function to download and save images locally
async function downloadImage(url: string): Promise<string> {
  try {
    // Create hash of URL to generate stable filename
    const hash = crypto.createHash('md5').update(url).digest('hex');
    const ext = path.extname(new URL(url).pathname) || '.png';
    const filename = `${hash}${ext}`;
    const publicPath = path.join(process.cwd(), 'public', 'images', 'posts', filename);

    // Check if image already exists
    if (fs.existsSync(publicPath)) {
      return `/images/posts/${filename}`;
    }

    // Download the image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure directory exists
    const dir = path.dirname(publicPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save the image
    fs.writeFileSync(publicPath, buffer);

    return `/images/posts/${filename}`;
  } catch (error) {
    console.error('Error downloading image:', error);
    return url; // Fallback to original URL if download fails
  }
}

// Set up custom image transformer
n2m.setCustomTransformer('image', async (block) => {
  const { image } = block as any;
  if (!image) return '';

  // Get the image URL from Notion
  const imageUrl = image.type === 'file'
    ? image.file?.url
    : image.external?.url;

  if (!imageUrl) return '';

  // Get caption if exists
  const caption = image.caption?.[0]?.plain_text || '';

  // Download image and get local path
  const localPath = await downloadImage(imageUrl);

  // Return markdown image syntax
  return `![${caption}](${localPath})`;
});
