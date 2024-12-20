import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBarLinks from "./SideBarLinks";

export default function MobileSideBar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="lg:hidden cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left">
        <SideBarLinks />
      </SheetContent>
    </Sheet>
  );
}
