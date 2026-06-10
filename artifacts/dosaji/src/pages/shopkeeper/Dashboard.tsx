import { useGetDashboardStats, useListAllOrders, useUpdateOrderStatus, getListAllOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ShopkeeperDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recentOrders, isLoading: ordersLoading } = useListAllOrders({ status: "Placed", limit: 10 });
  const updateOrderMutation = useUpdateOrderStatus();
  const queryClient = useQueryClient();

  const handleAcceptOrder = (orderId: number) => {
    updateOrderMutation.mutate({ id: orderId, data: { status: "Preparing" } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllOrdersQueryKey() });
      }
    });
  };

  if (statsLoading || ordersLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif mb-8">Shopkeeper Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.todayOrders || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{stats?.pendingOrders || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₹{stats?.todayRevenue || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">New Orders</h2>
        <Link href="/shopkeeper/orders"><Button variant="outline">View All</Button></Link>
      </div>

      <div className="space-y-4">
        {!recentOrders || recentOrders.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center border">
            <p className="text-muted-foreground">No new orders at the moment.</p>
          </div>
        ) : (
          recentOrders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl p-6 shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold">Order #{order.id}</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">{order.status}</Badge>
                  <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm mb-1">{order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}</div>
                <div className="text-sm text-muted-foreground">Total: ₹{order.total}</div>
              </div>
              <Button 
                onClick={() => handleAcceptOrder(order.id)} 
                disabled={updateOrderMutation.isPending}
                className="w-full md:w-auto"
              >
                Accept & Prepare
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
