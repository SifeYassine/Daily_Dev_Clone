import NavBar from "@/components/base/NavBar";
import SideBar from "@/components/base/SideBar";

export default async function DailyDevLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen overflow-y-hidden">
      <NavBar />
      <div className="flex">
        <SideBar />
        <div className="flex justify-center items-center w-full overflow-y-scroll ">
          {children}
        </div>
      </div>
    </div>
  );
}
