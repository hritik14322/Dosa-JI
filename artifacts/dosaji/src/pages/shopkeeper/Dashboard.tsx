import { useGetDashboardStats, useListAllOrders, useUpdateOrderStatus, getListAllOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { UtensilsCrossed, ClipboardList, TrendingUp, LayoutGrid } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 flex items-start justify-between p-6 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-2xl" />
      <div className="pl-2">
        <p className="text-sm text-gray-500 mb-3 font-medium">{label}</p>
        <p className="text-3xl font-bold text-amber-500">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-amber-400" />
      </div>
    </div>
  );
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    Placed: "bg-blue-100 text-blue-700",
    Preparing: "bg-yellow-100 text-yellow-700",
    "Out for Delivery": "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

export default function ShopkeeperDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recentOrders, isLoading: ordersLoading } = useListAllOrders({ status: "Placed", limit: 8 });
  const updateOrderMutation = useUpdateOrderStatus();
  const queryClient = useQueryClient();

  const handleAcceptOrder = (orderId: number) => {
    updateOrderMutation.mutate({ id: orderId, data: { status: "Preparing" } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAllOrdersQueryKey() }),
    });
  };

  const firstName = user?.name?.split(" ")[0] ?? "Shopkeeper";

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-6xl">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {getGreeting()}, {firstName} 👋
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard label="Menu Items" value={String(stats?.totalMenuItems ?? 0)} icon={UtensilsCrossed} />
        <StatCard label="Today's Orders" value={String(stats?.todayOrders ?? 0)} icon={ClipboardList} />
        <StatCard label="Revenue Today" value={`₹${(stats?.todayRevenue ?? 0).toLocaleString("en-IN")}`} icon={TrendingUp} />
        <StatCard label="Pending" value={String(stats?.pendingOrders ?? 0)} icon={LayoutGrid} />
      </div>

      {/* Recent new orders */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900">New Orders</h2>
        <Link href="/shopkeeper/orders">
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {!recentOrders || recentOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-amber-100 shadow-sm">
            <p className="text-gray-400">No new orders right now.</p>
          </div>
        ) : (
          recentOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-amber-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-gray-900">Order #{order.id}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">Total: ₹{order.total}</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleAcceptOrder(order.id)}
                disabled={updateOrderMutation.isPending}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5"
              >
                Accept &amp; Prepare
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
