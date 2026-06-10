import "./_shared/_group.css";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  ClipboardList, 
  Ticket, 
  Settings, 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2,
  CheckCircle2,
  XCircle,
  MoreVertical
} from "lucide-react";

const USERS = [
  { id: 1, name: "Arjun Verma", email: "arjun.v@example.com", role: "Customer", status: "Active", joined: "2023-11-10" },
  { id: 2, name: "Sneha Rao", email: "sneha.r@dosajii.com", role: "Shopkeeper", status: "Active", joined: "2023-08-15" },
  { id: 3, name: "Kiran Kumar", email: "kiran.admin@dosajii.com", role: "Admin", status: "Active", joined: "2023-01-05" },
  { id: 4, name: "Pooja Hegde", email: "pooja.h@example.com", role: "Customer", status: "Inactive", joined: "2024-02-20" },
  { id: 5, name: "Ravi Teja", email: "ravi.t@dosajii.com", role: "Shopkeeper", status: "Active", joined: "2024-01-12" },
  { id: 6, name: "Divya Singh", email: "divya.s@example.com", role: "Customer", status: "Active", joined: "2024-03-01" },
];

const COUPONS = [
  { id: 1, code: "WELCOME20", type: "Percent", value: "20%", minOrder: "₹300", expires: "2024-12-31", active: true },
  { id: 2, code: "PIZZA50", type: "Flat", value: "₹50", minOrder: "₹400", expires: "2024-06-30", active: true },
  { id: 3, code: "FLAT30", type: "Flat", value: "₹30", minOrder: "₹250", expires: "2024-05-15", active: false },
  { id: 4, code: "BOGO", type: "Percent", value: "100%", minOrder: "₹500", expires: "2024-08-31", active: true },
];

const CHART_DATA = [
  { day: 'Mon', orders: 32, max: 71 },
  { day: 'Tue', orders: 28, max: 71 },
  { day: 'Wed', orders: 45, max: 71 },
  { day: 'Thu', orders: 38, max: 71 },
  { day: 'Fri', orders: 52, max: 71 },
  { day: 'Sat', orders: 67, max: 71 },
  { day: 'Sun', orders: 71, max: 71 },
];

const SPARK_DATA = [
  10, 25, 15, 40, 30, 60, 50, 80, 65, 90, 85, 100
];

export function AdminPanel() {
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white border-2 border-white/20" style={{ backgroundColor: "#E8920A" }}>
              AD
            </div>
            <div>
              <p className="font-['Inter'] text-white font-medium text-sm">admin@dosaji.com</p>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">Admin</span>
            </div>
          </div>

          <nav className="space-y-2 flex-1 overflow-y-auto">
            {[
              { name: "Dashboard", icon: LayoutDashboard },
              { name: "Users", icon: Users },
              { name: "Menu", icon: UtensilsCrossed },
              { name: "Orders", icon: ClipboardList },
              { name: "Coupons", icon: Ticket },
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
            Admin Overview
          </h1>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Users", value: "412", icon: Users },
            { label: "Total Orders", value: "2,341", icon: ClipboardList },
            { label: "Revenue", value: "₹3,64,820", icon: TrendingUp },
            { label: "Active Items", value: "28", icon: UtensilsCrossed },
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
                <h3 className="font-['Inter'] text-3xl font-bold" style={{ color: "#1C1C1C" }}>{stat.value}</h3>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Bar Chart */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <h2 className="font-['Playfair_Display'] text-xl font-bold mb-6" style={{ color: "#1C1C1C" }}>Orders Per Day — Last 7 Days</h2>
            <div className="h-64 flex items-end justify-between gap-2 pb-6 pt-2 border-b border-gray-100">
              {CHART_DATA.map((data, i) => {
                const heightPercent = (data.orders / data.max) * 100;
                return (
                  <div key={i} className="flex flex-col items-center flex-1 gap-2 h-full justify-end group">
                    <div className="text-xs font-medium text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">{data.orders}</div>
                    <div 
                      className="w-full max-w-[40px] rounded-t-sm transition-all duration-500 ease-out hover:brightness-110" 
                      style={{ backgroundColor: "#E8920A", height: `${heightPercent}%` }}
                    />
                    <div className="text-xs text-gray-500 font-['Inter'] mt-2">{data.day}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Line/Sparkline Chart */}
          <div className="rounded-xl p-6 flex flex-col" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <h2 className="font-['Playfair_Display'] text-xl font-bold mb-6" style={{ color: "#1C1C1C" }}>Revenue Last 7 Days</h2>
            <div className="flex-1 flex items-center justify-center">
              <svg className="w-full h-48 overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(232,146,10,0.3)" />
                    <stop offset="100%" stopColor="rgba(232,146,10,0)" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 50 ${SPARK_DATA.map((val, i) => `L ${(i / (SPARK_DATA.length - 1)) * 100} ${50 - (val / 100) * 40}`).join(' ')} L 100 50 Z`}
                  fill="url(#lineGrad)"
                />
                <path
                  d={`${SPARK_DATA.map((val, i) => `${i===0?'M':'L'} ${(i / (SPARK_DATA.length - 1)) * 100} ${50 - (val / 100) * 40}`).join(' ')}`}
                  fill="none"
                  stroke="#E8920A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {SPARK_DATA.map((val, i) => (
                  <circle 
                    key={i}
                    cx={(i / (SPARK_DATA.length - 1)) * 100} 
                    cy={50 - (val / 100) * 40} 
                    r="1.5" 
                    fill="#FFFFFF"
                    stroke="#E8920A"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          
          {/* User Management */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <h2 className="font-['Playfair_Display'] text-xl font-bold mb-6" style={{ color: "#1C1C1C" }}>User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-['Inter']">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(232,146,10,0.1)" }}>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>User</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Role</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Status</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Joined</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: "#6B6B6B" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-[#FFF8EE] transition-colors" style={{ borderColor: "rgba(232,146,10,0.1)" }}>
                      <td className="py-3">
                        <p className="text-sm font-medium" style={{ color: "#1C1C1C" }}>{user.name}</p>
                        <p className="text-xs" style={{ color: "#6B6B6B" }}>{user.email}</p>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'Shopkeeper' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">
                        {user.status === "Active" ? (
                          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-sm text-gray-500">{user.joined}</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">Change Role</button>
                          <button className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Deactivate</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coupon Management */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-['Playfair_Display'] text-xl font-bold" style={{ color: "#1C1C1C" }}>Coupon Management</h2>
              <button 
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-['Inter'] font-medium text-white transition-opacity hover:opacity-90 shadow-md"
                style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920A 100%)" }}
              >
                <Plus className="w-3.5 h-3.5" /> Create Coupon
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-['Inter']">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(232,146,10,0.1)" }}>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Code</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Type</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Value</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Min Order</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Expiry</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Active</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: "#6B6B6B" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {COUPONS.map((coupon) => (
                    <tr key={coupon.id} className="border-b last:border-0 hover:bg-[#FFF8EE] transition-colors" style={{ borderColor: "rgba(232,146,10,0.1)" }}>
                      <td className="py-3">
                        <span className="font-mono text-sm font-bold tracking-wider px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="py-3 text-sm" style={{ color: "#6B6B6B" }}>{coupon.type}</td>
                      <td className="py-3 text-sm font-bold" style={{ color: "#E8920A" }}>{coupon.value}</td>
                      <td className="py-3 text-sm text-gray-500">{coupon.minOrder}</td>
                      <td className="py-3 text-sm text-gray-500">{coupon.expires}</td>
                      <td className="py-3">
                        <div className={`w-8 h-4 rounded-full relative cursor-pointer ${coupon.active ? 'bg-[#E8920A]' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${coupon.active ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Restaurant Settings Form Card */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
          <h2 className="font-['Playfair_Display'] text-xl font-bold mb-6" style={{ color: "#1C1C1C" }}>Restaurant Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Restaurant Name</label>
              <input type="text" defaultValue="Dosa Ji" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Tagline</label>
              <input type="text" defaultValue="Delicious Fast Food" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Address</label>
              <input type="text" defaultValue="123 Food Street, Foodie City" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Phone</label>
              <input type="text" defaultValue="+91 98765 43210" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Delivery Charge</label>
              <input type="text" defaultValue="₹30" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">GST %</label>
              <input type="text" defaultValue="5" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Free delivery above</label>
              <input type="text" defaultValue="₹299" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors" />
            </div>
          </div>
          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button className="px-8 py-2.5 rounded-full text-white font-['Inter'] font-medium text-sm transition-opacity hover:opacity-90 shadow-md" style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920A 100%)" }}>
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
