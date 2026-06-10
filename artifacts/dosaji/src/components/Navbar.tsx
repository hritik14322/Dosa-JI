import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoSrc from "@assets/dosa_ji_logo_1781074968971.png";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [, setLocation] = useLocation();

  const isStaff = user?.role === "shopkeeper" || user?.role === "admin";

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#1a1005] border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={logoSrc} alt="Dosa Ji" className="h-9 w-9 object-contain" />
          <span className="font-serif font-bold text-2xl text-amber-400 tracking-tight">Dosa Ji</span>
        </Link>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/menu" className="text-white/80 hover:text-amber-400 transition-colors font-medium text-sm tracking-wide">Menu</Link>
          <Link href="/about" className="text-white/80 hover:text-amber-400 transition-colors font-medium text-sm tracking-wide">About</Link>
          <Link href="/contact" className="text-white/80 hover:text-amber-400 transition-colors font-medium text-sm tracking-wide">Contact</Link>

          {isAuthenticated && user?.role === "customer" && (
            <Link href="/orders" className="text-white/80 hover:text-amber-400 transition-colors font-medium text-sm tracking-wide">My Orders</Link>
          )}
          {isAuthenticated && user?.role === "shopkeeper" && (
            <Link href="/shopkeeper" className="text-white/80 hover:text-amber-400 transition-colors font-medium text-sm tracking-wide flex items-center gap-1">
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link href="/admin" className="text-white/80 hover:text-amber-400 transition-colors font-medium text-sm tracking-wide">Admin</Link>
          )}
        </div>

        {/* Right: Cart + Auth */}
        <div className="flex items-center gap-3 ml-auto">
          {!isStaff && (
            <Link href="/cart" className="relative p-2 text-white/80 hover:text-amber-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm">{user?.name || user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-white/60 hover:text-amber-400 transition-colors text-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-full border border-white/40 text-white text-sm font-medium hover:bg-white/10 hover:border-white/70 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-amber-400 hover:bg-white/10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] bg-[#1a1005] border-l border-white/10 text-white">
                <div className="flex flex-col gap-5 mt-8">
                  <Link href="/menu" className="text-white/80 hover:text-amber-400 transition-colors font-medium">Menu</Link>
                  <Link href="/about" className="text-white/80 hover:text-amber-400 transition-colors font-medium">About</Link>
                  <Link href="/contact" className="text-white/80 hover:text-amber-400 transition-colors font-medium">Contact</Link>
                  {isAuthenticated && user?.role === "customer" && (
                    <Link href="/orders" className="text-white/80 hover:text-amber-400 transition-colors font-medium">My Orders</Link>
                  )}
                  {isAuthenticated && user?.role === "shopkeeper" && (
                    <Link href="/shopkeeper" className="text-white/80 hover:text-amber-400 transition-colors font-medium">Dashboard</Link>
                  )}
                  {isAuthenticated && user?.role === "admin" && (
                    <Link href="/admin" className="text-white/80 hover:text-amber-400 transition-colors font-medium">Admin</Link>
                  )}
                  <div className="h-px bg-white/10 my-1" />
                  {isAuthenticated ? (
                    <>
                      <span className="text-white/60 text-sm">{user?.email}</span>
                      <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 transition-colors font-medium">
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-white/80 hover:text-amber-400 transition-colors font-medium">Login</Link>
                      <Link href="/register" className="text-white/80 hover:text-amber-400 transition-colors font-medium">Sign up</Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
