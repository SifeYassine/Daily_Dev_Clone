import React from "react";
import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <div className="relative hidden lg:block">
      <input
        className="w-full lg:w-[500px] h-12 py-2 pl-10 rounded-3xl outline-none bg-muted"
        type="search"
        placeholder="Search..."
      />

      <Search className="absolute top-3 left-2 w-6 h-6" />
    </div>
  );
}
