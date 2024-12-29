"use client";

import React, { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { ArrowBigUp, Link as LinkIcon, MessageSquare } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import myAxios from "@/lib/axios.config";
import { POST_URL } from "@/lib/apiEndPoints";
import { useSession } from "next-auth/react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { formatDate } from "@/lib/utils";
import { laraEcho } from "@/lib/echo.config";
import ShowPost from "./ShowPost";

export default function FetchPosts() {
  const [posts, setPosts] = useImmer<ApiResponseType<PostType>>({
    data: [],
    path: "",
    per_page: 0,
    next_cursor: "",
    next_page_url: "",
    prev_cursor: "",
    prev_page_url: "",
  });

  const [loading, setLoading] = useState(true);
  const { data } = useSession();
  const user = data?.user as CustomUser;

  useEffect(() => {
    if (user) {
      // Fetch posts when user is logged in
      setLoading(true);
      async function fetchPosts() {
        try {
          const res = await myAxios.get(`${POST_URL}/index`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const response = res.data;

          if (res.status === 200) {
            setPosts(response.posts);
          }
        } catch {
          toast.error("Something went wrong! Please try again.", {
            theme: "dark",
          });
        } finally {
          setLoading(false);
        }
      }

      fetchPosts();

      // Listen for real-time updates
      const channel = laraEcho.channel("post-broadcast");

      channel.listen("PostBroadCastEvent", (event: any) => {
        const post = event.post as PostType;

        setPosts((posts) => {
          posts.data = [post, ...posts.data];
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
        laraEcho.leaveChannel("post-broadcast");
      };
    } else {
      setLoading(false);
    }
  }, [user]);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied successfully!", { theme: "dark" });
  };

  if (loading) {
    return (
      <h1 className="flex justify-center pt-10 font-semibold text-lg">
        Loading...
      </h1>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
      {posts.data.map((post) => (
        <div key={post.id}>
          <ShowPost post={post} key={post.id}>
            <Card className="bg-muted transition-transform transform hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-x-2">
                  <UserAvatar image={post.user_id.profile_image} />
                  <h2>{post.user_id.username}</h2>
                </div>
                <CardTitle className="text-2xl font-bold">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-1">
                <p className="text-sm mb-2 px-5">
                  {formatDate(post.created_at)}
                </p>
                <figure className="px-4">
                  <Image
                    src={post.image_url}
                    width={350}
                    height={350}
                    className="w-full max-h-[200px] object-cover rounded-lg"
                    alt="post_img"
                  />
                </figure>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex space-x-2 items-center">
                  <ArrowBigUp size={25} />
                  {post.vote > 0 && <span>{post.vote}</span>}
                </div>
                <div className="flex space-x-2 items-center">
                  <MessageSquare size={20} />
                  {post.comment_count > 0 && <span>{post.comment_count}</span>}
                </div>
                <LinkIcon
                  size={20}
                  onClick={() => copyUrl(post.url!)}
                  className="cursor-pointer"
                />
              </CardFooter>
            </Card>
          </ShowPost>
        </div>
      ))}
    </div>
  );
}
