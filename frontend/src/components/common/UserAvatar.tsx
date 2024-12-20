import React from "react";
import Image from "next/image";

export default function UserAvatar({ image }: { image?: string }) {
  return (
    <div>
      {image ? (
        <Image
          src={image}
          width={40}
          height={40}
          alt="avatar"
          className="rounded-full"
        />
      ) : (
        <Image src="/avatar.png" width={40} height={40} alt="avatar" />
      )}
    </div>
  );
}
