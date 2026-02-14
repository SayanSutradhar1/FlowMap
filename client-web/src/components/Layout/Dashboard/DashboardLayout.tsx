import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/context/sidebar.provider";
import { useSidebarContext } from "@/context/sidebar-context";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

const DashboardContent = () => {
  const { collapsed } = useSidebarContext();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <DashboardSidebar />
      <div
        className="transition-all duration-300 overflow-x-hidden"
        style={{ paddingLeft: collapsed ? 80 : 280 }}
      >
        <DashboardHeader />
        <main className="p-4 sm:p-6 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default DashboardLayout;
