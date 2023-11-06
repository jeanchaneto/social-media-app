import { IPost } from "@/types";

type PostStatsProps = {
  post: IPost;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img src="/assets/icons/like.svg" alt="like" width={20} height={20} className="cursor-pointer" />
        <p className="small-medium lg:base-medium" >0</p>
      </div>
      <div className="flex gap-2 mr-5">
        <img src="/assets/icons/save.svg" alt="save" width={20} height={20} className="cursor-pointer" />
        <p className="small-medium lg:base-medium" >0</p>
      </div>
    </div>
  );
};

export default PostStats;
