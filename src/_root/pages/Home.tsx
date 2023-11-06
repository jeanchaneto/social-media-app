import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { getLatestPosts } from "@/lib/firebase";
import { IPost } from "@/types";
import { useEffect, useState } from "react";

const Home = () => {
  const [isLoading, setIsloading] = useState(true);
  const [posts, setPosts] = useState<IPost[] | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsloading(true);
      try {
        const fetchedPosts = await getLatestPosts();
        setPosts(fetchedPosts);
        console.log(fetchedPosts);
      } catch (error) {
        console.log(error);
      } finally {
        setIsloading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.map((post: IPost) => (
                <li key={post.id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
