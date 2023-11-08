import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { getSavedPosts } from "@/lib/firebase";
import { IPost } from "@/types";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

const Saved = () => {
  const [isLoading, setIsloading] = useState(true);
  const [savedPosts, setSavedPosts] = useState<IPost[] | null>(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser) {
        setIsloading(true);
        try {
          const fetchedPosts = await getSavedPosts(currentUser?.uid);
          setSavedPosts(fetchedPosts);
        } catch (error) {
          console.log(error);
        } finally {
          setIsloading(false);
        }
      }
    };

    fetchPosts();
  }, [currentUser]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
          {isLoading && !savedPosts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {savedPosts?.map((post: IPost) => (
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

export default Saved;
