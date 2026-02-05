import { Outlet } from "react-router";
import { Aside } from "../common/aside";

export function DefaultLayout() {
  return (
    <div className="container min-h-screen mx-auto">
      <div className="flex p-6">
        <Aside />
        <div className="flex-1 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
