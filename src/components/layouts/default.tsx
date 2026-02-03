import { Link, Outlet } from "react-router";

export function DefaultLayout() {
  return (
    <div className="container min-h-screen mx-auto">
      <nav className="mb-4 flex gap-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>
        <Link to="/about" className="text-blue-500 hover:underline">
          About
        </Link>
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Dashboard
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
