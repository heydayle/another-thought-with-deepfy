import { Outlet } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../common/aside";

export function DefaultLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Slim top bar with the collapse toggle */}
          <header className="flex h-10 items-center gap-2 px-4 shrink-0">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex-1 px-6 pb-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
