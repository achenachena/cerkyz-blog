import PostList from '@/components/PostList';
import { getSortedPostsData } from '@/lib/posts';

export default async function Home() {
  const posts = await getSortedPostsData();

  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
}
