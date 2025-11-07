import Link from 'next/link';
import { PostData } from '@/lib/posts';
import { format } from 'date-fns';

interface PostListProps {
  posts: PostData[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <Link href={`/posts/${post.id}`}>
            <h2 className="text-2xl font-semibold mb-2 hover:opacity-60 transition-opacity">
              {post.title}
            </h2>
            <time className="text-sm text-gray-500 dark:text-gray-100 block mb-2">
              {format(new Date(post.date), 'MMMM dd, yyyy')}
            </time>
            {post.description && (
              <p className="text-gray-600 dark:text-white">{post.description}</p>
            )}
          </Link>
        </article>
      ))}
    </div>
  );
}
