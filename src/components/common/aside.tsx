import { NavLink } from "react-router";
import { LayoutDashboard, HeartPulse, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

const menus = [
  {
    label: "Dashboard",
    children: [
      { label: "Mood Tracker", href: "/", icon: LayoutDashboard },
      { label: "Health Insights", href: "/health-insights", icon: HeartPulse },
      { label: "Personal Goals", href: "/personal-goals", icon: Target },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="py-4">
        {menus.map((menu) => (
          <SidebarGroup key={menu.label}>
            {/* Group heading – hidden when icon-only (handled by shadcn automatically) */}
            <SidebarGroupLabel className="text-sm font-semibold text-primary bg-primary/10 rounded-sm px-4 py-2 mb-1">
              {menu.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {menu.children.map(({ label, href, icon: Icon }) => (
                  <SidebarMenuItem key={label}>
                    <NavLink to={href}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={label}
                          className={cn(
                            "flex items-center gap-2 w-full py-2 px-4 rounded-md transition-colors",
                            "text-neutral-500 hover:text-primary",
                            isActive && "!text-primary font-medium",
                          )}
                        >
                          <Icon className="shrink-0" />
                          <span>{label}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Drag rail to resize / click to collapse */}
      <SidebarRail />
    </Sidebar>
  );
}
