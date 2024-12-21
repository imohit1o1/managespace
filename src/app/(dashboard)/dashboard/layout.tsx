import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <DashboardHeader />

        {/* Dashboard Dynamic Content */}
        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="flex flex-1 flex-col gap-4">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
