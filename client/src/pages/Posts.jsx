import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Posts() {
  const [posts,setPosts]=useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch('/api/post/getposts');
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.schemaVersion.posts);
      setLoading(false);
      if (data.schemaVersion.posts.length > 0) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    };
    fetchPosts();
  }, [Posts]);

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    setPosts([...posts, ...data.schemaVersion.posts]);
    if (data.schemaVersion.posts.length > 0) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  };

  return (
    <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
  )
}