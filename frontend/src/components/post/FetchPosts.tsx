"use client";

import { useEffect, useState } from "react";
import { usePosts } from "@/context/PostsContext";
import { toast } from "react-toastify";
import myAxios from "@/lib/axios.config";
import { POST_URL } from "@/lib/apiEndPoints";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";

export default function FetchPosts() {
  const { posts, setPosts } = usePosts();
  const [loading, setLoading] = useState(true);
  const { data } = useSession();
  const user = data?.user as CustomUser;

  useEffect(() => {
    if (user?.token && posts.length === 0) {
      setLoading(true);
      myAxios
        .get(`${POST_URL}/index`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => {
          setLoading(false);
          const response = res.data;
          if (res?.status === 200) {
            setPosts(response.posts.data);
          }
        })
        .catch(() => {
          setLoading(false);
          toast.error("Something went wrong! Please try again.");
        });
    } else {
      setLoading(false);
    }
  }, [user?.token, setPosts]);

  if (loading) {
    return (
      <h1 className="flex justify-center pt-10 font-semibold text-lg">
        Loading...
      </h1>
    );
  }

  if (posts.length === 0) {
    return (
      <h1 className="flex justify-center pt-10 font-semibold text-lg">
        No posts available.
      </h1>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow"
        >
          <Link href={post.url} target="_blank" rel="noopener noreferrer">
            <Image
              src={post.image_url || "/computer.jpg"}
              alt={post.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-2">
                {post.description}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{post.user_id}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
