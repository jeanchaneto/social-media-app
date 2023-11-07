import { likePost } from "@/lib/firebase";
import { IPost } from "@/types";
import { useState } from "react";

type PostStatsProps = {
  post: IPost;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const [likeCount, setLikeCount] = useState(
    post.likes ? post.likes.length : 0
  );
  const [isLiked, setIsLiked] = useState(
    post.likes ? post.likes.includes(userId) : false
  );

  const handleLike = async () => {
    const newLikedStatus = !isLiked;
    const newLikeCount = likeCount + (newLikedStatus ? 1 : -1);

    // Optimistically update UI
    setIsLiked(newLikedStatus);
    setLikeCount(newLikeCount);
    try {
      await likePost(post.id, userId, isLiked);
    } catch (error) {
      // Revert to original state in case of an error
      setIsLiked(!newLikedStatus);
      setLikeCount(likeCount);
      console.error("Error updating like status:", error);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div onClick={handleLike} className="flex gap-2 mr-5">
        <img
          src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">
          {likeCount}
        </p>
      </div>
      <div className="flex gap-2 mr-5">
        <img
          src="/assets/icons/save.svg"
          alt="save"
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">0</p>
      </div>
    </div>
  );
};

export default PostStats;
