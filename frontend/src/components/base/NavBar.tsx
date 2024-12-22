import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import SearchInput from "./SearchInput";
import MobileSideBar from "./MobileSideBar";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center p-2 border-b">
      <MobileSideBar />
      <Image src="/logo.svg" width={120} height={120} alt="logo" />

      <SearchInput />

      <div className="flex items-center gap-3">
        <Button size="icon" variant="secondary" className="rounded-full">
          <BellIcon className="w-5 h-5" />
        </Button>

        <ProfileMenu />
      </div>
    </nav>
  );
}
