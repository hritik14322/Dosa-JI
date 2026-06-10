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
  { id: 1, name: "Double Cheeseburger", category: "Burger", price: 180, veg: false, available: true, featured: true, image: "/__mockup/images/dish1.png" },
  { id: 2, name: "Margherita Pizza", category: "Pizza", price: 250, veg: true, available: true, featured: true, image: "/__mockup/images/dish2.png" },
  { id: 3, name: "Peri Peri Fries", category: "Fries", price: 120, veg: true, available: false, featured: false, image: "/__mockup/images/dish3.png" },
  { id: 4, name: "Spicy Paneer Wrap", category: "Wrap", price: 160, veg: true, available: true, featured: false, image: "/__mockup/images/dish4.png" },
  { id: 5, name: "Oreo Thick Shake", category: "Shake", price: 150, veg: true, available: true, featured: false, image: "/__mockup/images/shake.png" },
];

const ORDERS = [
  { id: "#DJ001", customer: "Rahul Sharma", items: "2× Margherita, 1× Fries", total: 620, status: "Placed", time: "10:24 AM" },
  { id: "#DJ002", customer: "Priya Singh", items: "1× Double Cheeseburger, 1× Shake", total: 330, status: "Preparing", time: "10:15 AM" },
  { id: "#DJ003", customer: "Amit Patel", items: "3× Spicy Paneer Wrap", total: 480, status: "Out for Delivery", time: "09:45 AM" },
  { id: "#DJ004", customer: "Neha Gupta", items: "1× Margherita Pizza", total: 250, status: "Delivered", time: "09:10 AM" },
  { id: "#DJ005", customer: "Vikram Reddy", items: "2× Double Cheeseburger, 2× Fries", total: 600, status: "Cancelled", time: "08:50 AM" },
  { id: "#DJ006", customer: "Anjali Desai", items: "4× Oreo Thick Shake", total: 600, status: "Delivered", time: "08:30 AM" },
];

export function ShopkeeperDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#FFFDF7" }}>
      {/* Sidebar */}
      <div className="w-[260px] flex-shrink-0 flex flex-col" style={{ backgroundColor: "#1A1200" }}>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <img src="/__mockup/images/dosa-ji-logo.png" className="w-10 h-10 rounded-full object-cover bg-white" alt="Logo" />
            <div className="font-['Playfair_Display'] text-2xl font-bold" style={{ color: "#E8920A" }}>
              Dosa Ji
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: "#E8920A" }}>
              SK
            </div>
            <div>
              <p className="font-['Inter'] text-white font-medium text-sm">shop@dosaji.com</p>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(232,146,10,0.2)", color: "#E8920A" }}>Shopkeeper</span>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full font-['Inter'] text-sm font-medium transition-colors ${
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
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Menu Items", value: "28", icon: UtensilsCrossed },
            { label: "Today's Orders", value: "23", icon: ClipboardList },
            { label: "Revenue Today", value: "₹5,847", icon: TrendingUp },
            { label: "Pending", value: "7", icon: LayoutDashboard },
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
                  <div className="p-2 rounded-full border border-amber-100" style={{ backgroundColor: "rgba(245,201,122,0.15)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#E8920A" }} />
                  </div>
                </div>
                <h3 className="font-['Inter'] text-3xl font-bold" style={{ color: "#E8920A" }}>{stat.value}</h3>
              </div>
            );
          })}
        </div>

        {/* Menu Management */}
        <div className="mb-12 rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold" style={{ color: "#1C1C1C" }}>Menu Management</h2>
            <button 
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-['Inter'] font-medium text-sm shadow-md transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920A 100%)" }}
            >
              <Plus className="w-4 h-4" /> Add New Dish
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Inter']">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(232,146,10,0.2)" }}>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider pl-4" style={{ color: "#6B6B6B" }}>Item</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Category</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Price</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Type</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Available</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Featured</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-right pr-4" style={{ color: "#6B6B6B" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {MENU_ITEMS.map((item, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-[#FFF8EE] transition-colors" style={{ borderColor: "rgba(232,146,10,0.1)" }}>
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover border border-amber-100" />
                        <span className="text-sm font-medium" style={{ color: "#1C1C1C" }}>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm" style={{ color: "#6B6B6B" }}>{item.category}</td>
                    <td className="py-4 text-sm font-semibold" style={{ color: "#E8920A" }}>₹{item.price}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: item.veg ? "#D1FAE5" : "#FEE2E2",
                          color: item.veg ? "#047857" : "#B91C1C"
                        }}
                      >
                        {item.veg ? "Veg" : "Non-veg"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer ${item.available ? 'bg-[#E8920A]' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.available ? 'left-[22px]' : 'left-0.5'}`} />
                      </div>
                    </td>
                    <td className="py-4">
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer ${item.featured ? 'bg-[#E8920A]' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.featured ? 'left-[22px]' : 'left-0.5'}`} />
                      </div>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-500 hover:text-red-600 transition-colors rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Management */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
          <div className="mb-6">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold" style={{ color: "#1C1C1C" }}>Order Management</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Inter']">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(232,146,10,0.2)" }}>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider pl-4" style={{ color: "#6B6B6B" }}>Order ID</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Customer</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider w-[35%]" style={{ color: "#6B6B6B" }}>Items</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Total</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Status</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider pr-4" style={{ color: "#6B6B6B" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((order, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-[#FFF8EE] transition-colors" style={{ borderColor: "rgba(232,146,10,0.1)" }}>
                    <td className="py-4 pl-4 text-sm font-medium" style={{ color: "#1C1C1C" }}>{order.id}</td>
                    <td className="py-4 text-sm" style={{ color: "#1C1C1C" }}>{order.customer}</td>
                    <td className="py-4 text-sm" style={{ color: "#6B6B6B" }}>{order.items}</td>
                    <td className="py-4 text-sm font-bold" style={{ color: "#E8920A" }}>₹{order.total}</td>
                    <td className="py-4">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border shadow-sm"
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
                            "#B91C1C",
                          borderColor:
                            order.status === "Placed" ? "#BAE6FD" :
                            order.status === "Preparing" ? "#FDE68A" :
                            order.status === "Out for Delivery" ? "#FED7AA" :
                            order.status === "Delivered" ? "#A7F3D0" :
                            "#FECACA"
                        }}
                      >
                        {order.status}
                        <ChevronDown className="w-3 h-3 ml-1.5 opacity-70" />
                      </div>
                    </td>
                    <td className="py-4 text-sm pr-4" style={{ color: "#6B6B6B" }}>{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
