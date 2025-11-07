import { getPostData, getAllPostIds } from '@/lib/posts';
import { format } from 'date-fns';
import PostContent from '@/components/PostContent';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostData(id);

  return {
    title: `${post.title} | Cerkyz's blog`,
    description: post.description,
  };
}

export default async function Post({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostData(id);

  return (
    <>
      <article>
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <time className="text-sm text-gray-500 dark:text-gray-100 block mb-4">
            {format(new Date(post.date), 'MMMM dd, yyyy')}
          </time>
          {post.description && (
            <p className="text-xl text-gray-600 dark:text-white">{post.description}</p>
          )}
        </header>

        <PostContent content={post.content || ''} />
      </article>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-sm text-gray-500 dark:text-gray-100 hover:opacity-60">
          ← Back to home
        </Link>
      </div>
    </>
  );
}
