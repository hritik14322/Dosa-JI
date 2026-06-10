import "./_group.css";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  scrolled?: boolean;
  cartCount?: number;
  currentPage?: string;
}

export function Navbar({ scrolled = false, cartCount = 2, currentPage = "home" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navBg = scrolled
    ? "bg-white shadow-md"
    : "bg-transparent";
  const logoColor = scrolled ? "text-[#1A1200]" : "text-white";
  const linkColor = scrolled ? "text-[#1C1C1C] hover:text-[#E8920A]" : "text-white/90 hover:text-white";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className={`font-['Playfair_Display'] text-2xl font-bold ${logoColor}`}>
          DOSA <span className="text-[#E8920A]">JII</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Menu", "About", "Contact"].map(link => (
            <a key={link} href="#" className={`font-['Inter'] text-sm font-medium transition-colors ${linkColor}`}>{link}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="relative">
            <ShoppingCart className={`w-5 h-5 ${scrolled ? "text-[#1C1C1C]" : "text-white"}`} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E8920A] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </button>
          <button className={`hidden md:block border rounded-full px-4 py-1.5 text-sm font-['Inter'] font-medium transition-all hover:bg-[#E8920A] hover:border-[#E8920A] hover:text-white ${scrolled ? "border-[#E8920A] text-[#E8920A]" : "border-white text-white"}`}>
            Login
          </button>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className={`w-5 h-5 ${scrolled ? "text-[#1C1C1C]" : "text-white"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? "text-[#1C1C1C]" : "text-white"}`} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 px-6 py-4 flex flex-col gap-4">
          {["Menu", "About", "Contact"].map(link => (
            <a key={link} href="#" className="font-['Inter'] text-sm font-medium text-[#1C1C1C] hover:text-[#E8920A]">{link}</a>
          ))}
          <button className="border border-[#E8920A] rounded-full px-4 py-2 text-sm text-[#E8920A] font-['Inter'] font-medium w-full">Login / Register</button>
        </div>
      )}
    </nav>
  );
}
