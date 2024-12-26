import React, { useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { isValidUrl } from "@/lib/utils";
import axios from "axios";
import myAxios from "@/lib/axios.config";
import { toast } from "react-toastify";
import { POST_URL } from "@/lib/apiEndPoints";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { useSession } from "next-auth/react";
import { usePosts } from "@/context/PostsContext";

export default function AddPost() {
  const { addPost } = usePosts();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postState, setPostState] = useState<PostStateType>({
    title: "",
    description: "",
    url: "",
    image_url: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    url: "",
    image_url: "",
  });

  const { data } = useSession();
  const user = data?.user as CustomUser;

  async function loadPreview() {
    if (isValidUrl(postState.url!)) {
      setLoading(true);
      axios
        .post("/api/image-preview", { url: postState.url })
        .then((res) => {
          setLoading(false);
          const response: ImagePreviewResType = res.data?.data;
          const image =
            response.images.length > 0 ? response.images[0] : "/computer.jpg";

          setPostState({
            ...postState,
            image_url: image,
            title: response.title,
            description: response.description ?? "",
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Something went wrong while fetch data from URL.");
        });
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    myAxios
      .post(`${POST_URL}/create`, postState, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setLoading(false);
        const response = res.data;
        if (res?.status == 200) {
          toast.success(response.message);
          setPostState({});
          setOpen(false);

          addPost(response.post);
        }
      })
      .catch((err) => {
        setLoading(false);
        const errors = err.response.data;

        console.log("errors", errors);

        if (err?.status == 400) {
          setErrors(errors.errors);
        } else {
          toast.error("Something went wrong! Please try again.");
        }
      });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="flex gap-3 items-center mb-4 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Upload className="w-5 h-5" />
          <p>Submit Article</p>
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-h-screen custom-scrollbar"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {postState.image_url && (
            <Image
              src={postState.image_url}
              width={450}
              height={450}
              className="w-full object-contain rounded-xl my-2"
              alt="image"
            />
          )}
          <div className="mb-4">
            <Label htmlFor="limk">Link</Label>
            <Input
              id="link"
              type="url"
              placeholder="Enter link..."
              value={postState.url}
              onChange={(e) =>
                setPostState({ ...postState, url: e.target.value })
              }
              onBlur={loadPreview}
            />
            <span className="text-red-500">{errors.url}</span>
          </div>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter title..."
              value={postState.title}
              onChange={(e) =>
                setPostState({ ...postState, title: e.target.value })
              }
            />
            <span className="text-red-500">{errors.title}</span>
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description..."
              className="custom-scrollbar"
              rows={3}
              value={postState.description}
              onChange={(e) =>
                setPostState({ ...postState, description: e.target.value })
              }
            />
            <span className="text-red-500">{errors.description}</span>
          </div>
          <div className="mb-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Submit Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
