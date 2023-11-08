import PostForm from "@/components/forms/PostForm"
import Loader from "@/components/shared/Loader";
import { getPostById } from "@/lib/firebase";
import { IPost } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const EditPost = () => {
  const { id } = useParams();
  const [loading, setIsLoading] = useState(true);
  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          setIsLoading(true)
          const fetchedPost: IPost | null = await getPostById(id);
          setPost(fetchedPost)
        } catch (error) {
          console.log("Error fetching post", error);
        } finally {
          setIsLoading(false)
        }
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        { loading ? <Loader/> : post && <PostForm action="update" post={post}/>}
        {/* {post && <PostForm action="update" post={post} />} */}
      </div>
    </div>
  );
};

export default EditPost;
