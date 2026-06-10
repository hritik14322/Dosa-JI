import { useListMyOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Orders() {
  const { data: orders, isLoading } = useListMyOrders();

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

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-8">You haven't placed any orders with us.</p>
        <Link href="/menu"><Button>Order Now</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold font-serif mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-card rounded-xl p-6 shadow-sm border flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="space-y-2 flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-lg">Order #{order.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </div>
              <div className="text-sm line-clamp-1 mt-2">
                {order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
              </div>
            </div>
            
            <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
              <div className="font-bold text-xl">₹{order.total}</div>
              <Link href={`/order-confirmation/${order.id}`}>
                <Button variant="outline" size="sm" className="w-full md:w-auto">View Details</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
