import NavBar from "@/components/base/NavBar";
import SideBar from "@/components/base/SideBar";
import { getServerSession } from "next-auth";
import {
  CustomSession,
  authOptions,
} from "@/app/api/auth/[...nextauth]/authOptions";

export default async function DailyDevLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  return (
    <div className="h-screen overflow-y-hidden">
      <NavBar user={session?.user!} />
      <div className="flex">
        <SideBar />
        <div className="flex justify-center items-center w-full overflow-y-scroll ">
          {children}
        </div>
      </div>
    </div>
  );
}
