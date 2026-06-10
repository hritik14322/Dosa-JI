import { useState } from "react";
import { Navbar } from "./_shared/Navbar";
import { Footer } from "./_shared/Footer";
import { Search, ChevronDown, X, Plus, Minus } from "lucide-react";
import "./_shared/_group.css";

const DISHES = [
  { id: 1, name: "Ghee Roast Masala Dosa", desc: "Crispy golden dosa roasted in pure desi ghee, filled with spiced potato mash.", price: 120, type: "veg", featured: true, img: "/__mockup/images/masala-dosa.png", category: "Dosa" },
  { id: 2, name: "Kanchipuram Idli", desc: "Soft, fluffy idlis tempered with pepper, cumin, and curry leaves.", price: 60, type: "veg", featured: false, img: "/__mockup/images/idli-sambar.png", category: "Idli" },
  { id: 3, name: "Crispy Medu Vada", desc: "Golden fried savory donuts made from urad dal, crispy outside and soft inside.", price: 50, type: "veg", featured: false, img: "/__mockup/images/medu-vada.png", category: "Vada" },
  { id: 4, name: "Onion Rava Dosa", desc: "Thin, crispy semolina crepe spiced with cumin, ginger, and finely chopped onions.", price: 90, type: "veg", featured: false, img: "/__mockup/images/rava-dosa.png", category: "Dosa" },
  { id: 5, name: "Ghee Ven Pongal", desc: "Comforting mix of rice and yellow moong dal cooked with ghee, pepper, and cashews.", price: 80, type: "veg", featured: true, img: "/__mockup/images/ven-pongal.png", category: "Rice" },
  { id: 6, name: "Authentic Filter Coffee", desc: "Strong, frothy traditional South Indian coffee brewed with roasted chicory blend.", price: 40, type: "veg", featured: false, img: "/__mockup/images/filter-coffee.png", category: "Beverages" },
  { id: 7, name: "Special Mysore Pak", desc: "Rich, melt-in-mouth sweet made with roasted gram flour, generous ghee, and sugar.", price: 150, type: "veg", featured: true, img: "/__mockup/images/mysore-pak.png", category: "Sweets" },
  { id: 8, name: "Paper Roast Dosa", desc: "Paper-thin, extra-long crispy crepe served with three types of chutneys and sambar.", price: 110, type: "veg", featured: false, img: "/__mockup/images/ghee-roast.png", category: "Dosa" },
  { id: 9, name: "South Indian Meals", desc: "Traditional banana leaf thali with rice, sambar, rasam, kootu, poriyal, and payasam.", price: 250, type: "veg", featured: true, img: "/__mockup/images/thali.png", category: "Combos" }
];

const CATEGORIES = ["All", "Dosa", "Idli", "Vada", "Rice", "Beverages", "Sweets", "Combos", "Specials"];

export function Menu() {
  const [activeTab, setActiveTab] = useState("All");
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(true);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dosa-bg)" }}>
      <Navbar scrolled={true} cartCount={2} currentPage="menu" />

      {/* Page Header */}
      <div style={{ backgroundColor: "var(--dosa-dark)" }} className="pt-32 pb-12 px-6 text-center">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--dosa-amber)" }}>
          Our Menu
        </h1>
        <p className="font-['Inter'] text-lg max-w-2xl mx-auto" style={{ color: "var(--dosa-cream)" }}>
          Discover the authentic taste of South India, prepared with traditional recipes and pure ghee.
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] z-40 bg-white shadow-sm border-b" style={{ borderColor: "var(--dosa-card-border)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-6 items-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap pb-1 font-['Inter'] font-medium text-sm transition-colors relative`}
                style={{ color: activeTab === cat ? "var(--dosa-amber)" : "var(--dosa-muted)" }}
              >
                {cat}
                {activeTab === cat && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-md" style={{ backgroundColor: "var(--dosa-amber)" }}></span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                className="pl-9 pr-4 py-1.5 rounded-full border text-sm font-['Inter'] focus:outline-none focus:ring-1 focus:ring-amber-500"
                style={{ borderColor: "var(--dosa-card-border)" }}
              />
            </div>
            
            <div className="flex items-center gap-2 border px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--dosa-card-border)" }}>
              <span className="font-['Inter'] text-sm font-medium text-gray-700">Sort</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer ml-2">
              <div className={`w-10 h-5 rounded-full p-1 transition-colors ${isVegOnly ? 'bg-green-500' : 'bg-gray-200'}`} onClick={() => setIsVegOnly(!isVegOnly)}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${isVegOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
              <span className="font-['Inter'] text-sm font-medium text-gray-700 hidden sm:block">Veg Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Dish Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DISHES.map(dish => (
            <div 
              key={dish.id} 
              className="bg-white rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 relative"
              style={{ border: "1px solid var(--dosa-card-border)", boxShadow: "var(--dosa-shadow)" }}
            >
              {/* Image & Badges */}
              <div className="relative h-[200px] overflow-hidden">
                <img src={dish.img} alt={dish.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                {/* Veg/Non-veg badge */}
                <div className="absolute top-3 left-3 bg-white p-1 rounded-sm shadow-sm">
                  <div className={`w-3 h-3 rounded-full border ${dish.type === 'veg' ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${dish.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                </div>

                {dish.featured && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-sm shadow-sm text-xs font-bold text-white font-['Inter']" style={{ background: "linear-gradient(to right, var(--dosa-saffron), var(--dosa-amber))" }}>
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-gray-900 line-clamp-1">{dish.name}</h3>
                <p className="font-['Inter'] text-sm text-gray-500 line-clamp-2 mb-4 h-10">{dish.desc}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg" style={{ color: "var(--dosa-amber)" }}>₹{dish.price}</span>
                  <button className="px-6 py-2 rounded-full text-white font-medium font-['Inter'] text-sm transition-opacity hover:opacity-90 active:scale-95" style={{ background: "linear-gradient(to right, var(--dosa-saffron), var(--dosa-amber))" }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar Overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {[DISHES[0], DISHES[4]].map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0">
                  <img src={item.img} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-['Inter'] font-semibold text-gray-900 text-sm">{item.name}</h4>
                      <p className="font-bold mt-1 text-sm" style={{ color: "var(--dosa-amber)" }}>₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border rounded-md" style={{ borderColor: "var(--dosa-card-border)" }}>
                        <button className="p-1 hover:bg-amber-50 transition-colors"><Minus className="w-4 h-4 text-gray-500" /></button>
                        <span className="w-8 text-center font-medium text-sm font-['Inter']">1</span>
                        <button className="p-1 hover:bg-amber-50 transition-colors"><Plus className="w-4 h-4 text-gray-500" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50/50">
              <div className="flex justify-between items-center mb-6">
                <span className="font-['Inter'] font-medium text-gray-600">Subtotal</span>
                <span className="font-['Playfair_Display'] font-bold text-xl text-gray-900">₹200</span>
              </div>
              <button className="w-full py-3.5 rounded-full text-white font-semibold font-['Inter'] transition-transform hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2" style={{ background: "linear-gradient(to right, var(--dosa-saffron), var(--dosa-amber))" }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
