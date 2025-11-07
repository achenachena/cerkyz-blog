'use client';

import { useState, useMemo } from 'react';
import PostList from './PostList';
import { PostData } from '@/lib/posts';

interface SearchClientProps {
  posts: PostData[];
}

export default function SearchClient({ posts }: SearchClientProps) {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;

    const lowercaseQuery = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.description?.toLowerCase().includes(lowercaseQuery) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [posts, query]);

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search posts by title, description, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
        />
      </div>

      {query && (
        <p className="text-gray-600 dark:text-white mb-6">
          Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        </p>
      )}

      {filteredPosts.length > 0 ? (
        <PostList posts={filteredPosts} />
      ) : (
        <p className="text-gray-500 dark:text-gray-100 text-center py-12">
          No posts found matching &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}
