import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User as UserIcon, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoSrc from "@assets/dosa_ji_logo_1781074968971.png";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const NavLinks = () => (
    <>
      <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">Home</Link>
      <Link href="/menu" className="text-foreground hover:text-primary transition-colors font-medium">Menu</Link>
      <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">About</Link>
      <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">Contact</Link>
      
      {isAuthenticated && user?.role === "customer" && (
        <Link href="/orders" className="text-foreground hover:text-primary transition-colors font-medium">My Orders</Link>
      )}
      {isAuthenticated && user?.role === "shopkeeper" && (
        <Link href="/shopkeeper" className="text-foreground hover:text-primary transition-colors font-medium">Dashboard</Link>
      )}
      {isAuthenticated && user?.role === "admin" && (
        <Link href="/admin" className="text-foreground hover:text-primary transition-colors font-medium">Admin</Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src={logoSrc} alt="Dosa Ji" className="h-10 w-10 object-contain" />
            <span className="font-serif font-bold text-2xl text-primary tracking-tight">Dosa Ji</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 ml-6">
            <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <NavLinks />
                  <div className="h-px bg-border my-2" />
                  {isAuthenticated ? (
                    <>
                      <Link href="/profile" className="text-foreground hover:text-primary transition-colors font-medium">Profile</Link>
                      <button onClick={handleLogout} className="text-left text-destructive hover:text-destructive/80 transition-colors font-medium">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-foreground hover:text-primary transition-colors font-medium">Log in</Link>
                      <Link href="/register" className="text-foreground hover:text-primary transition-colors font-medium">Sign up</Link>
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
