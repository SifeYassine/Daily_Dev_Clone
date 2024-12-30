"use client";

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

export default function AddPost() {
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

  async function handlePreviewAndPost(
    event?: React.FormEvent,
    type: "preview" | "submit" = "preview"
  ) {
    if (type === "preview" && isValidUrl(postState.url!)) {
      setLoading(true);
      try {
        const res = await axios.post("/api/image-preview", {
          url: postState.url,
        });
        const response = res.data?.data as ImagePreviewResType;
        const image =
          response.images.length > 0 ? response.images[0] : "/computer.jpg";

        setPostState({
          ...postState,
          image_url: image,
          title: response.title,
          description: response.description ?? "",
        });
      } catch {
        toast.error("Something went wrong while fetching data from URL.", {
          theme: "dark",
        });
      } finally {
        setLoading(false);
      }
    } else if (type === "submit") {
      event?.preventDefault();
      setLoading(true);

      try {
        const res = await myAxios.post(`${POST_URL}/create`, postState, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const response = res.data;

        if (res?.status === 200) {
          toast.success(response.message, { theme: "dark" });

          setPostState({
            title: "",
            description: "",
            url: "",
            image_url: "",
          });
          setOpen(false);
        }
      } catch (err: any) {
        const errors = err.response?.data;

        if (err?.status === 400) {
          setErrors(errors.errors);
        } else {
          toast.error("Something went wrong! Please try again.", {
            theme: "dark",
          });
        }
      } finally {
        setLoading(false);
      }
    }
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
        className="max-h-[95vh] custom-scrollbar"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => handlePreviewAndPost(e, "submit")}>
          {postState.image_url && (
            <Image
              src={postState.image_url}
              width={400}
              height={400}
              className="w-full object-contain rounded-xl my-2"
              alt="image"
            />
          )}
          <div className="mb-4">
            <Label htmlFor="link">Article Link</Label>
            <Input
              id="link"
              type="url"
              placeholder="Enter link..."
              value={postState.url}
              onChange={(e) =>
                setPostState({ ...postState, url: e.target.value })
              }
              onBlur={() => handlePreviewAndPost(undefined, "preview")}
            />
            <span className="text-red-500">{errors.url}</span>
          </div>
          <div className="mb-4">
            <Label htmlFor="img">Image Link</Label>
            <Input
              id="img"
              type="url"
              placeholder="Enter image link..."
              value={postState.image_url}
              onChange={(e) =>
                setPostState({ ...postState, image_url: e.target.value })
              }
              onBlur={() => handlePreviewAndPost(undefined, "preview")}
            />
            <span className="text-red-500">{errors.image_url}</span>
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
