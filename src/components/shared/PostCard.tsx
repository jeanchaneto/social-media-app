import { AuthContext } from "@/context/auth-context";
import { IPost } from "@/types";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { deletePost } from "@/lib/firebase";
import { toast } from "../ui/use-toast";

type PostCardProps = {
  post: IPost;
};

const PostCard = ({ post }: PostCardProps) => {
  const { currentUser } = useContext(AuthContext);
  const [isOptimsitDeleted, setIsoptimisticDeleted] = useState(false);
  // Check if tags is an array
  const tagsElement = Array.isArray(post.tags);

  const handleDelete = async () => {
    try {
      setIsoptimisticDeleted(true);
      deletePost(post.id, post.imageStoragePath);
      return toast({
        title: "Post deleted",
      });
    } catch (error) {
      console.log(error);
      setIsoptimisticDeleted(false);
      return toast({
        title: "Error deleting post",
      });
    }
  };

  return (
    <div className={`post-card ${isOptimsitDeleted && "hidden"} `}>
      <div className="flex-between ">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator}
            </p>
            <div className="flex-center gap-2 text-light-3 ">
              <p className=" subtle-semibold lg:small-regular">
                {post.createdAt.toDate().toDateString()}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        {currentUser?.uid === post.userId && (
          <div className="flex gap-3">
            <img
              src="/delete.svg"
              alt="Delete"
              className="cursor-pointer"
              onClick={handleDelete}
            />
            <Link to={`/update-post/${post.id}`}>
              <img
                src="/assets/icons/edit.svg"
                alt="Edit post"
                width={20}
                height={20}
              />
            </Link>
          </div>
        )}
      </div>

        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {tagsElement &&
              post?.tags.map((tag: string, index: number) => (
                <li
                  key={`${tag}${index}`}
                  className="text-light-3 small-regular"
                >
                  #{tag}
                </li>
              ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />

      <PostStats post={post} userId={post.userId} />
    </div>
  );
};

export default PostCard;
