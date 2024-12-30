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
import UserAvatar from "@/components/common/UserAvatar";
import { formatDate } from "@/lib/utils";
import AddComment from "../comment/AddComment";
import FetchComments from "../comment/FetchComments";

export default function ShowPost({
  children,
  post,
}: {
  children: React.ReactNode;
  post: PostType;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-full min-w-fit max-h-[95vh]  custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Show Post</DialogTitle>
          </DialogHeader>
          <div className="max-w-[600px]">
            <div className="flex items-center gap-x-2 my-5">
              <UserAvatar image={post.user_id.profile_image} />
              <h2>{post.user_id.username}</h2>
            </div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-sm mt-8">{formatDate(post.created_at)}</p>
            <Image
              src={post.image_url}
              width={400}
              height={400}
              alt="post image"
              className="w-full rounded-lg object-cover my-5"
            />
            <p className="text-lg my-8">{post.description}</p>
            <AddComment post={post} />
            <FetchComments post={post} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
