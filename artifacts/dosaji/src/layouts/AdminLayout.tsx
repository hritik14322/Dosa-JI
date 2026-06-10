import { useState } from "react";
import { Link, useLocation, Switch, Route, Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Users, UtensilsCrossed, ClipboardList, Ticket, Settings, LogOut, Menu, X } from "lucide-react";
import logoSrc from "@assets/dosa_ji_logo_1781074968971.png";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminCoupons from "@/pages/admin/Coupons";
import ShopkeeperMenu from "@/pages/shopkeeper/Menu";
import ShopkeeperOrders from "@/pages/shopkeeper/Orders";
import AdminSettings from "@/pages/admin/Settings";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: UtensilsCrossed, label: "Menu", path: "/admin/menu" },
  { icon: ClipboardList, label: "Orders", path: "/admin/orders" },
  { icon: Ticket, label: "Coupons", path: "/admin/coupons" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const isActive = (path: string) =>
    path === "/admin" ? location === "/admin" : location.startsWith(path);

  return (
    <div className="flex flex-col h-full bg-[#1a1005] text-white w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <img src={logoSrc} alt="Dosa Ji" className="h-9 w-9 object-contain" />
        <span className="font-serif font-bold text-xl text-amber-400">Dosa Ji</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            href={path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              isActive(path)
                ? "bg-amber-500 text-white shadow-lg"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return <Redirect to="/login" />;
  if (user?.role !== "admin") return <Redirect to="/" />;

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex flex-col h-full">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#1a1005] text-white border-b border-white/10">
          <button onClick={() => setMobileOpen(true)} className="text-white/80 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <img src={logoSrc} alt="Dosa Ji" className="h-7 w-7 object-contain" />
          <span className="font-serif font-bold text-lg text-amber-400">Dosa Ji</span>
        </div>

        <main className="flex-1 p-6">
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/menu" component={ShopkeeperMenu} />
            <Route path="/admin/orders" component={ShopkeeperOrders} />
            <Route path="/admin/coupons" component={AdminCoupons} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route><Redirect to="/admin" /></Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}
