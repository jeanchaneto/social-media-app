import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { createPost } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { IPost } from "@/types";

type PostFormProps = {
  post?: IPost;
  action: "create" | "update"
}

const PostForm = ({ post, action }: PostFormProps) => {
  const { currentUser } = useContext(AuthContext);
  const [isCreating, setIsCreating] = useState(false);
  const naviguate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(',') : "",
    },
  });

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const userId = currentUser?.uid;
    if (userId) {
      setIsCreating(true);
      try {
        await createPost(values, userId);
        setIsCreating(false);
        form.reset();
        naviguate("/");
        return toast({
          title: "Post created successfully",
        });
      } catch (error) {
        console.log("Error creating post:", error);
        return toast({
          title: "Error creating post",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photo</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  {...field}
                  placeholder="Sleek, Art, Nature"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button disabled={isCreating} type="submit" className="shad-button_primary">
            { isCreating ? "Creating Post..." :"Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
