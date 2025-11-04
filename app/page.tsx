import PostList from '@/components/PostList';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
}
