import React from "react";
import SideBarLinks from "./SideBarLinks";

export default function SideBar() {
  return (
    <div className="w-[260px] border-r p-4 h-screen hidden lg:block">
      <SideBarLinks />
    </div>
  );
}
