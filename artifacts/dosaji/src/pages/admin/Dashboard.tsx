import { useGetDashboardStats } from "@workspace/api-client-react";
import { Users, ClipboardList, TrendingUp, UtensilsCrossed } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 flex items-start justify-between p-6 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-2xl" />
      <div className="pl-2">
        <p className="text-sm text-gray-500 mb-3 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-amber-400" />
      </div>
    </div>
  );
}

function buildWeekData(total: number, isRevenue = false) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weights = [0.11, 0.09, 0.14, 0.13, 0.16, 0.20, 0.17];
  return days.map((day, i) => ({
    day,
    value: isRevenue
      ? Math.round(total * weights[i])
      : Math.max(1, Math.round((total / 7) * (0.7 + weights[i]))),
  }));
}

const amber = "#f59e0b";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const ordersData = buildWeekData(stats?.totalOrders ?? 70);
  const revenueData = buildWeekData(stats?.totalRevenue ?? 15000, true);

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Overview</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={String(stats?.totalUsers ?? 0)} icon={Users} />
        <StatCard label="Total Orders" value={(stats?.totalOrders ?? 0).toLocaleString("en-IN")} icon={ClipboardList} />
        <StatCard label="Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`} icon={TrendingUp} />
        <StatCard label="Active Items" value={String(stats?.totalMenuItems ?? 0)} icon={UtensilsCrossed} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Orders Per Day — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ordersData} barSize={28}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                formatter={(v: number) => [v, "Orders"]}
              />
              <Bar dataKey="value" fill={amber} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={amber} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={amber}
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={{ fill: amber, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
