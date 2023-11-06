import { AuthContext } from "@/context/auth-context";
import { IPost } from "@/types";
import { useContext } from "react";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: IPost;
};

const PostCard = ({ post }: PostCardProps) => {
  const { currentUser } = useContext(AuthContext);
  // Check if tags is an array
  const tagsElement = Array.isArray(post.tags);

  return (
    <div className="post-card">
      <div className="flex-between ">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}>
            <img src="/assets/icons/profile-placeholder.svg" alt="Creator" />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              CREATOR NAME TO DO
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
          <Link to={`/update-post/${post.id}`}>
            <img
              src="/assets/icons/edit.svg"
              alt="Edit post"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>
      <Link to={`/posts/${post.id}`}>
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
      </Link>
      <PostStats post={post} userId={post.userId} />
    </div>
  );
};

export default PostCard;