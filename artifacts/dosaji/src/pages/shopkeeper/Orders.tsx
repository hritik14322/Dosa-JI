import { useState } from "react";
import { useListAllOrders, useUpdateOrderStatus, getListAllOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ShopkeeperOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: orders, isLoading } = useListAllOrders({ status: statusFilter === "all" ? undefined : statusFilter });
  const updateOrderMutation = useUpdateOrderStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUpdateStatus = (orderId: number, newStatus: any) => {
    updateOrderMutation.mutate({ id: orderId, data: { status: newStatus } }, {
      onSuccess: () => {
        toast({ title: "Order updated", description: `Order #${orderId} status changed to ${newStatus}` });
        queryClient.invalidateQueries({ queryKey: getListAllOrdersQueryKey() });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed": return "bg-blue-100 text-blue-800";
      case "Preparing": return "bg-yellow-100 text-yellow-800";
      case "OutForDelivery": return "bg-purple-100 text-purple-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif">Manage Orders</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Placed">Placed</SelectItem>
            <SelectItem value="Preparing">Preparing</SelectItem>
            <SelectItem value="OutForDelivery">Out For Delivery</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {!orders || orders.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center border">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl p-6 shadow-sm border flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg">Order #{order.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto lg:ml-0">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Customer Details</h4>
                    <p className="text-sm">{order.deliveryAddress.name} ({order.deliveryAddress.phone})</p>
                    <p className="text-sm text-muted-foreground">{order.deliveryAddress.addressLine1}, {order.deliveryAddress.city}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Items</h4>
                    <div className="text-sm max-h-20 overflow-y-auto pr-2">
                      {order.items.map(i => (
                        <div key={i.menuItemId} className="flex justify-between border-b border-muted last:border-0 py-1">
                          <span>{i.quantity}x {i.name}</span>
                          <span>₹{i.price * i.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-between items-end gap-4 min-w-[200px] border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6">
                <div className="text-right w-full">
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="font-bold text-2xl">₹{order.total}</div>
                </div>
                
                <div className="w-full space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Update Status</h4>
                  <Select 
                    value={order.status} 
                    onValueChange={(v) => handleUpdateStatus(order.id, v)}
                    disabled={updateOrderMutation.isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Placed">Placed</SelectItem>
                      <SelectItem value="Preparing">Preparing</SelectItem>
                      <SelectItem value="OutForDelivery">Out For Delivery</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
