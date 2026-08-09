import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("trezar_admin_token");

  if (!token) return <Navigate to="/admin/login" replace />;

  function logout() {
    localStorage.removeItem("trezar_admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-blush-light flex">
      <aside className="w-60 shrink-0 bg-plum text-blush-light hidden md:flex flex-col">
        <div className="px-6 py-8">
          <span className="font-display text-xl tracking-widest2">TREZAR</span>
          <p className="text-xs text-blush-light/60 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm font-label ${
                  isActive ? "bg-rosegold-deep text-white" : "text-blush-light/80 hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3">
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded text-sm text-blush-light/70 hover:bg-white/5">
            Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden bg-plum text-blush-light px-4 py-3 flex items-center justify-between">
          <span className="font-display tracking-widest2">TREZAR ADMIN</span>
          <button onClick={logout} className="text-xs">Log Out</button>
        </div>
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
