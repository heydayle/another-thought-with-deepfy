import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

export function Aside() {
  const menus = [
    {
      label: "Dashboard",
      children: [
        {
          label: "Mood Tracker",
          href: "/",
        },
        {
          label: "Health Insights",
          href: "/health-insights",
        },
        {
          label: "Personal Goals",
          href: "/personal-goals",
        },
      ],
    },
  ];
  return (
    <aside className="w-64 bg-white border border-gray-200 h-[calc(100vh-4rem)] rounded-lg">
      <div className="px-4 py-6">
        <ul>
          {menus.map((menu) => (
            <div key={menu.label}>
              <li className="text-lg font-semibold text-gray-900 mb-2 py-2 px-4 bg-primary/10 rounded-sm text-primary">
                {menu.label}
              </li>
              <ul className="pl-4">
                {menu.children.map((child) => (
                  <li key={child.label} className="my-1">
                    <NavLink
                      to={child.href}
                      className={({ isActive }) =>
                        cn(
                          "block py-2 px-4 rounded-md transition-colors flex items-center gap-2",
                          "text-neutral-500 hover:text-primary hover:bg-primary/10",
                          isActive && "text-primary font-medium",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={cn("w-2 h-2 rounded-full", isActive && "bg-primary")} />
                          {child.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
}
