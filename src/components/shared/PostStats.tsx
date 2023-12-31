import { likePost, savePost, unsavePost } from "@/lib/firebase";
import { IPost } from "@/types";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

type PostStatsProps = {
  post: IPost;
};

const PostStats = ({ post }: PostStatsProps) => {
  const { currentUser } = useContext(AuthContext);
  const [likeCount, setLikeCount] = useState(
    post.likes ? post.likes.length : 0
  );
  const [isLiked, setIsLiked] = useState(
    post.likes ? post.likes.includes(currentUser!.uid) : false
  );
  //POST SAVE UI UPDATE FROM DB TO DO------------ !!
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePost = async () => {
    const wasOriginallySaved = isSaved;
    setIsSaved(!isSaved); // Optimistically update the UI

    try {
      if (wasOriginallySaved) {
        await unsavePost(post.id, currentUser!.uid);
      } else {
        await savePost(post.id, currentUser!.uid);
      }
    } catch (error) {
      setIsSaved(wasOriginallySaved); // Revert UI on error
      console.error("Error in saving/unsaving the post:", error);
    }
  };

  const handleLike = async () => {
    const newLikedStatus = !isLiked;
    const newLikeCount = likeCount + (newLikedStatus ? 1 : -1);

    // Optimistically update UI
    setIsLiked(newLikedStatus);
    setLikeCount(newLikeCount);
    try {
      await likePost(post.id, currentUser!.uid, isLiked);
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
        <p className="small-medium lg:base-medium">{likeCount}</p>
      </div>
      <div onClick={handleSavePost} className="flex gap-2 mr-5">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostStats;
