"use client";

import Link from "next/link";
import React from "react";
import UserAvatar from "@/components/common/UserAvatar";
import { Flame, Search, ArrowBigUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import AddPost from "@/components/post/AddPost";

export default function SideBarLinks() {
  const { data } = useSession();
  const user = data?.user as CustomUser;
  return (
    <div>
      <Link href="/login" className="flex gap-3 items-center py-4">
        <UserAvatar image={user?.profile_image ?? undefined} />
        <p>Feed</p>
      </Link>
      <p className="my-2 font-bold text-muted-foreground">Discover</p>
      <ul>
        <li>
          <Link href="/popular" className="flex gap-3 items-center mb-4">
            <Flame className="w-5 h-5" />
            <p>Popular</p>
          </Link>
        </li>
        <li>
          <Link href="/search" className="flex gap-3 items-center mb-4">
            <Search className="w-5 h-5" />
            <p>Search</p>
          </Link>
        </li>
        <li>
          <Link href="/most-voted" className="flex gap-3 items-center mb-4">
            <ArrowBigUp className="w-5 h-5" />
            <p>Most Voted</p>
          </Link>
        </li>
      </ul>

      <p className="my-2 font-bold text-muted-foreground">Contribute</p>
      <ul>
        <li>
          <AddPost />
        </li>
      </ul>
    </div>
  );
}
