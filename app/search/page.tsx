import { getSortedPostsData } from '@/lib/posts';
import SearchClient from '@/components/SearchClient';

export const metadata = {
  title: "Search | Cerkyz's blog",
  description: 'Search for blog posts',
};

export default function SearchPage() {
  const posts = getSortedPostsData();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Search</h1>
      <SearchClient posts={posts} />
    </div>
  );
}
