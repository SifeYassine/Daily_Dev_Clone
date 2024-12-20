import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function App() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1>Daily Dev</h1>
    </div>
  );
}
