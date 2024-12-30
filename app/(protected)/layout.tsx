import { NavBar } from "@/components/shared/nav-bar";
import { SideBar } from "@/components/shared/side-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SideBar />
      <div className="flex min-h-screen w-full flex-col">
        <NavBar />
        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
}
