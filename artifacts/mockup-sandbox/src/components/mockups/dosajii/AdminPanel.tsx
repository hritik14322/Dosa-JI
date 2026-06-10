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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const USERS = [
  { id: 1, name: "Arjun Verma", email: "arjun.v@example.com", role: "Customer", status: "Active", joined: "2023-11-10" },
  { id: 2, name: "Sneha Rao", email: "sneha.r@dosajii.com", role: "Shopkeeper", status: "Active", joined: "2023-08-15" },
  { id: 3, name: "Kiran Kumar", email: "kiran.admin@dosajii.com", role: "Admin", status: "Active", joined: "2023-01-05" },
  { id: 4, name: "Pooja Hegde", email: "pooja.h@example.com", role: "Customer", status: "Inactive", joined: "2024-02-20" },
  { id: 5, name: "Ravi Teja", email: "ravi.t@dosajii.com", role: "Shopkeeper", status: "Active", joined: "2024-01-12" },
  { id: 6, name: "Divya Singh", email: "divya.s@example.com", role: "Customer", status: "Active", joined: "2024-03-01" },
];

const COUPONS = [
  { id: 1, code: "WELCOME50", type: "Flat", value: "₹50", minOrder: "₹200", expires: "2024-12-31", active: true },
  { id: 2, code: "DOSALOVE", type: "Percent", value: "15%", minOrder: "₹300", expires: "2024-06-30", active: true },
  { id: 3, code: "WEEKEND20", type: "Percent", value: "20%", minOrder: "₹500", expires: "2024-05-15", active: false },
];

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 4500 },
  { name: 'Fri', revenue: 7000 },
  { name: 'Sat', revenue: 9000 },
  { name: 'Sun', revenue: 8500 },
];

export function AdminPanel() {
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white border-2 border-white/20" style={{ backgroundColor: "#E8920A" }}>
              AD
            </div>
            <div>
              <p className="font-['Inter'] text-white font-medium text-sm">Admin User</p>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Admin</span>
            </div>
          </div>

          <nav className="space-y-2">
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
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="font-['Playfair_Display'] text-4xl font-bold" style={{ color: "#1C1C1C" }}>
              Admin Overview
            </h1>
            <p className="font-['Inter'] mt-2" style={{ color: "#6B6B6B" }}>System statistics and management.</p>
          </div>
          <button 
            className="px-6 py-2.5 rounded-full text-white font-['Inter'] font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920A 100%)" }}
          >
            Download Report
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Users", value: "342", icon: Users },
            { label: "Total Orders", value: "1,847", icon: ClipboardList },
            { label: "Revenue", value: "₹2,84,320", icon: TrendingUp },
            { label: "Active Menu Items", value: "24", icon: UtensilsCrossed },
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
                <h3 className="font-['Inter'] text-3xl font-bold" style={{ color: "#1C1C1C" }}>{stat.value}</h3>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(245,201,122,0.4)", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <h2 className="font-['Playfair_Display'] text-xl font-bold mb-6" style={{ color: "#1C1C1C" }}>Orders per Day (Last 7 Days)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B6B6B" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B6B6B" }} />
                  <Tooltip cursor={{ fill: 'rgba(245,201,122,0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="revenue" fill="#E8920A" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(245,201,122,0.4)", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <h2 className="font-['Playfair_Display'] text-xl font-bold mb-6" style={{ color: "#1C1C1C" }}>Revenue Last 30 Days</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B6B6B" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B6B6B" }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#E8920A" strokeWidth={3} dot={{ r: 4, fill: "#E8920A", strokeWidth: 2, stroke: "#FFF" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* User Management */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(245,201,122,0.4)", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-['Playfair_Display'] text-xl font-bold" style={{ color: "#1C1C1C" }}>User Management</h2>
              <button className="font-['Inter'] text-sm font-medium" style={{ color: "#E8920A" }}>View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-['Inter']">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(245,201,122,0.4)" }}>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>User</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Role</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Status</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: "#6B6B6B" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((user) => (
                    <tr key={user.id} className="border-b last:border-0" style={{ borderColor: "rgba(245,201,122,0.2)" }}>
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
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coupon Management */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(245,201,122,0.4)", boxShadow: "0 2px 16px rgba(232,146,10,0.10)" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-['Playfair_Display'] text-xl font-bold" style={{ color: "#1C1C1C" }}>Active Coupons</h2>
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-['Inter'] font-medium text-white transition-transform hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920A 100%)" }}
              >
                <Plus className="w-3.5 h-3.5" /> Create
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-['Inter']">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(245,201,122,0.4)" }}>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Code</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Value</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Min Order</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6B6B" }}>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {COUPONS.map((coupon) => (
                    <tr key={coupon.id} className="border-b last:border-0" style={{ borderColor: "rgba(245,201,122,0.2)" }}>
                      <td className="py-3">
                        <span className="font-mono text-sm font-bold tracking-wider px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="py-3 text-sm font-medium" style={{ color: "#1C1C1C" }}>{coupon.value}</td>
                      <td className="py-3 text-sm text-gray-500">{coupon.minOrder}</td>
                      <td className="py-3">
                        <div className={`w-8 h-4 rounded-full relative cursor-pointer ${coupon.active ? 'bg-[#E8920A]' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${coupon.active ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Restaurant Settings Preview */}
          <div className="xl:col-span-2 rounded-xl p-6" style={{ backgroundColor: "#FFF8EE", border: "1px dashed rgba(245,201,122,0.8)" }}>
             <h2 className="font-['Playfair_Display'] text-xl font-bold mb-4" style={{ color: "#1C1C1C" }}>Restaurant Settings</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Restaurant Name</label>
                  <input type="text" defaultValue="DOSA JII" className="w-full px-3 py-2 rounded-md border border-amber-200 bg-white text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Tagline</label>
                  <input type="text" defaultValue="Premium South Indian" className="w-full px-3 py-2 rounded-md border border-amber-200 bg-white text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Delivery Charge</label>
                  <input type="text" defaultValue="₹40" className="w-full px-3 py-2 rounded-md border border-amber-200 bg-white text-sm focus:outline-none focus:border-amber-500" />
                </div>
             </div>
             <button className="px-6 py-2 rounded-full text-white font-['Inter'] font-medium text-sm transition-transform hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920A 100%)" }}>
               Save Settings
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
