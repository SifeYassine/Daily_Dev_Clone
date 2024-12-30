"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/common/UserAvatar";
import { useSession } from "next-auth/react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { Textarea } from "@/components/ui/textarea";
import { COMMENT_URL } from "@/lib/apiEndPoints";
import myAxios from "@/lib/axios.config";
import { toast } from "react-toastify";

export default function AddComment({ post }: { post: PostType }) {
  const [commentState, setCommentState] = useState({
    comment: "",
    post_id: post.id,
  });

  const [loading, setLoading] = useState(false);
  const [showBox, setShowBox] = useState(true);
  const [errors, setErrors] = useState({
    comment: "",
    post_id: "",
  });

  const { data } = useSession();
  const user = data?.user as CustomUser;

  async function handleComment() {
    setLoading(true);
    try {
      const res = await myAxios.post(`${COMMENT_URL}/create`, commentState, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const response = res.data;

      if (res?.status === 200) {
        toast.success(response.message, { theme: "dark" });

        setCommentState({
          comment: "",
          post_id: 0,
        });
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleComment();
  }

  return (
    <div className="my-4">
      {showBox ? (
        <div
          className="border rounded-xl flex justify-between items-center p-3"
          onClick={() => setShowBox(false)}
        >
          <div className="flex items-center gap-x-4">
            <UserAvatar image={user.profile_image!} />
            <p className="text-muted-foreground text-sm">
              Share your thoughts...
            </p>
          </div>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <Textarea
                placeholder="Type your thoughts..."
                value={commentState.comment}
                onChange={(e) =>
                  setCommentState({ ...commentState, comment: e.target.value })
                }
              />
              <span className="text-red-500 text-sm">{errors.comment}</span>
            </div>
            <div className="mb-2 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Post Comment"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
