"use client";

import React, { useEffect, useState } from "react";
import UserAvatar from "@/components/common/UserAvatar";
import { useSession } from "next-auth/react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { COMMENT_URL } from "@/lib/apiEndPoints";
import myAxios from "@/lib/axios.config";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import { formatDate } from "@/lib/utils";
import { laraEcho } from "@/lib/echo.config";

export default function FetchComments({ post }: { post: PostType }) {
  const [comments, setComments] = useImmer<ApiResponseType<CommentType>>({
    data: [],
    path: "",
    per_page: 0,
    next_cursor: "",
    next_page_url: "",
    prev_cursor: "",
    prev_page_url: "",
  });

  const [loading, setLoading] = useState(false);
  const { data } = useSession();
  const user = data?.user as CustomUser;

  useEffect(() => {
    if (user) {
      // Fetch comments of a post
      setLoading(true);
      async function fetchComments() {
        try {
          const res = await myAxios.get(`${COMMENT_URL}/index/${post.id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const response = res.data;

          if (res?.status === 200) {
            setComments(response.comments);
          }
        } catch {
          toast.error("Something went wrong! Please try again.", {
            theme: "dark",
          });
        } finally {
          setLoading(false);
        }
      }

      fetchComments();

      // Listen for real-time comments of a post
      const channel = laraEcho.channel("comment-broadcast");

      channel.listen("CommentBroadCastEvent", (event: any) => {
        const comment = event.comment as CommentType;

        setComments((comments) => {
          comments.data = [comment, ...comments.data];
        });
      });

      laraEcho.connector.pusher.connection.bind("connected", () => {
        console.log("Connected to Reverb server!");
      });

      laraEcho.connector.pusher.connection.bind("error", (err: any) => {
        console.error("Connection Error:", err);
      });

      // Leave the channel on unmount
      return () => {
        laraEcho.leaveChannel("comment-broadcast");
      };
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div>
      {comments.data.map((comment) => (
        <div
          key={comment.id}
          className="flex gap-x-4 items-center px-4 py-2 border rounded-2xl mb-4"
        >
          <UserAvatar image={comment.user_id.profile_image} />
          <div>
            <div className="flex items-center gap-x-2">
              <p className="text-base">@{comment.user_id.username}</p>
              <p className="text-muted-foreground text-sm">
                {formatDate(comment.created_at)}
              </p>
            </div>
            <p className="text-lg pl-2 pt-2">{comment.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
