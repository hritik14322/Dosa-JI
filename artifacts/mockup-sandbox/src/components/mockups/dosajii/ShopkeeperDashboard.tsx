import "./_shared/_group.css";
import { useState } from "react";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Edit2,
  Trash2,
  ChevronDown
} from "lucide-react";

const MENU_ITEMS = [
  { id: 1, name: "Classic Masala Dosa", category: "Dosa", price: 120, veg: true, available: true, featured: true, image: "/__mockup/images/dish1.png" },
  { id: 2, name: "Mysore Masala Dosa", category: "Dosa", price: 150, veg: true, available: true, featured: false, image: "/__mockup/images/dish2.png" },
  { id: 3, name: "Onion Rava Dosa", category: "Dosa", price: 140, veg: true, available: false, featured: false, image: "/__mockup/images/dish3.png" },
  { id: 4, name: "Paneer Tikka Dosa", category: "Fusion Dosa", price: 180, veg: true, available: true, featured: true, image: "/__mockup/images/dish4.png" },
  { id: 5, name: "Filter Coffee", category: "Beverages", price: 40, veg: true, available: true, featured: false, image: "/__mockup/images/dish5.png" },
];

const ORDERS = [
  { id: "ORD-8041", customer: "Rahul Sharma", items: 3, total: 420, status: "Placed", time: "10:24 AM" },
  { id: "ORD-8042", customer: "Priya Singh", items: 2, total: 270, status: "Preparing", time: "10:15 AM" },
  { id: "ORD-8043", customer: "Amit Patel", items: 5, total: 850, status: "Out for Delivery", time: "09:45 AM" },
  { id: "ORD-8044", customer: "Neha Gupta", items: 1, total: 120, status: "Delivered", time: "09:10 AM" },
  { id: "ORD-8045", customer: "Vikram Reddy", items: 4, total: 560, status: "Cancelled", time: "08:50 AM" },
  { id: "ORD-8046", customer: "Anjali Desai", items: 2, total: 290, status: "Delivered", time: "08:30 AM" },
];

export function ShopkeeperDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#FFFDF7" }}>
      {/* Sidebar */}
      <div className="w-[260px] flex-shrink-0 flex flex-col" style={{ backgroundColor: "#1A1200" }}>
        <div className="p-6">
          <div className="font-['Playfair_Display'] text-2xl font-bold text-white mb-8">
            DOSA <span style={{ color: "#E8920A" }}>JII</span>
          </div>
          
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: "#E8920A" }}>
              SK
            </div>
            <div>
              <p className="font-['Inter'] text-white font-medium text-sm">Shopkeeper</p>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(232,146,10,0.2)", color: "#F5A623" }}>Staff</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { name: "Dashboard", icon: LayoutDashboard },
              { name: "Menu Management", icon: UtensilsCrossed },
              { name: "Order Management", icon: ClipboardList },
              { name: "Settings", icon: Settings },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-['Inter'] text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  style={isActive ? { backgroundColor: "#E8920A" } : {}}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="font-['Playfair_Display'] text-4xl font-bold" style={{ color: "#1C1C1C" }}>
            Good morning, Shopkeeper 👋
          </h1>
          <p className="font-['Inter'] mt-2" style={{ color: "#6B6B6B" }}>Here's what's happening at your restaurant today.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Menu Items", value: "24", icon: UtensilsCrossed, trend: "+2 this week", up: true },
            { label: "Today's Orders", value: "18", icon: ClipboardList, trend: "+12% vs yesterday", up: true },
            { label: "Revenue Today", value: "₹4,320", icon: TrendingUp, trend: "+8% vs yesterday", up: true },
            { label: "Pending Orders", value: "5", icon: LayoutDashboard, trend: "Requires attention", up: false },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="rounded-xl p-6 relative overflow-hidden"
                style={{ backgroundColor: "#FFFFFF", borderLeft: "4px solid #E8920A", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="font-['Inter'] text-sm font-medium" style={{ color: "#6B6B6B" }}>{stat.label}</p>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(245,201,122,0.15)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#E8920A" }} />
                  </div>
                </div>
                <h3 className="font-['Inter'] text-3xl font-bold mb-2" style={{ color: "#E8920A" }}>{stat.value}</h3>
                <p className="font-['Inter'] text-xs flex items-center gap-1" style={{ color: stat.up ? "#10B981" : "#EF4444" }}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Order Management - Takes up more space */}
          <div className="xl:col-span-2 rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(245,201,122,0.4)", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold" style={{ color: "#1C1C1C" }}>Recent Orders</h2>
              <button className="font-['Inter'] text-sm font-medium" style={{ color: "#E8920A" }}>View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-['Inter']">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(245,201,122,0.4)" }}>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Order ID</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Customer</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Items</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Total</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Status</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map((order, i) => (
                    <tr key={i} className="border-b last:border-0" style={{ borderColor: "rgba(245,201,122,0.2)" }}>
                      <td className="py-4 text-sm font-medium" style={{ color: "#1C1C1C" }}>{order.id}</td>
                      <td className="py-4 text-sm" style={{ color: "#1C1C1C" }}>{order.customer}</td>
                      <td className="py-4 text-sm" style={{ color: "#6B6B6B" }}>{order.items} items</td>
                      <td className="py-4 text-sm font-semibold" style={{ color: "#1C1C1C" }}>₹{order.total}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center w-max gap-1 cursor-pointer"
                          style={{
                            backgroundColor: 
                              order.status === "Placed" ? "#E0F2FE" :
                              order.status === "Preparing" ? "#FEF3C7" :
                              order.status === "Out for Delivery" ? "#FFEDD5" :
                              order.status === "Delivered" ? "#D1FAE5" :
                              "#FEE2E2",
                            color:
                              order.status === "Placed" ? "#0369A1" :
                              order.status === "Preparing" ? "#B45309" :
                              order.status === "Out for Delivery" ? "#C2410C" :
                              order.status === "Delivered" ? "#047857" :
                              "#B91C1C"
                          }}
                        >
                          {order.status}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </span>
                      </td>
                      <td className="py-4 text-sm" style={{ color: "#6B6B6B" }}>{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Menu Highlights */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(245,201,122,0.4)", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-['Playfair_Display'] text-xl font-bold" style={{ color: "#1C1C1C" }}>Menu Highlights</h2>
              <button 
                className="p-2 rounded-full text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920A 100%)" }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {MENU_ITEMS.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: "#FFF8EE" }}>
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-['Inter'] font-semibold text-sm truncate" style={{ color: "#1C1C1C" }}>{item.name}</h4>
                    <p className="font-['Inter'] text-xs truncate" style={{ color: "#6B6B6B" }}>{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-['Inter'] font-bold text-sm" style={{ color: "#E8920A" }}>₹{item.price}</p>
                    <div className={`w-8 h-4 mt-1 rounded-full relative cursor-pointer ${item.available ? 'bg-[#E8920A]' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${item.available ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2.5 rounded-full font-['Inter'] text-sm font-medium border transition-colors hover:bg-amber-50" style={{ borderColor: "#E8920A", color: "#E8920A" }}>
              Manage Full Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
