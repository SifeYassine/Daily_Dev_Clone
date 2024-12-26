import NavBar from "@/components/base/NavBar";
import SideBar from "@/components/base/SideBar";

export default async function DailyDevLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <div className="flex-1 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}
