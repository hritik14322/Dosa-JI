import { useParams } from "wouter";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation() {
  const params = useParams();
  const orderId = Number(params.id);

  const { data: order, isLoading, error } = useGetOrder(orderId, {
    query: {
      enabled: !!orderId,
      queryKey: getGetOrderQueryKey(orderId)
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4 text-destructive">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
        <Link href="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-card rounded-xl p-8 shadow-sm border text-center mb-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-bold font-serif mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">Your order #{order.id} has been placed successfully.</p>
        <div className="bg-muted/50 rounded-lg p-4 inline-block">
          <span className="text-sm text-muted-foreground block mb-1">Current Status</span>
          <span className="font-bold text-primary text-xl">{order.status}</span>
        </div>
      </div>

      <div className="bg-card rounded-xl p-8 shadow-sm border">
        <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
        <div className="space-y-4 mb-8">
          {order.items.map((item) => (
            <div key={item.menuItemId} className="flex justify-between">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground ml-2">x{item.quantity}</span>
              </div>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-2 text-sm border-t pt-4 mb-4 pb-4">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery Charge</span>
            <span>₹{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>GST (5%)</span>
            <span>₹{order.gst}</span>
          </div>
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{order.couponDiscount}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between font-bold text-lg pt-4 border-t">
          <span>Total Paid</span>
          <span>₹{order.total}</span>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h3 className="font-bold mb-2">Delivery Details</h3>
          <p className="text-sm text-muted-foreground">{order.deliveryAddress.name}</p>
          <p className="text-sm text-muted-foreground">{order.deliveryAddress.phone}</p>
          <p className="text-sm text-muted-foreground">{order.deliveryAddress.addressLine1}</p>
          {order.deliveryAddress.addressLine2 && <p className="text-sm text-muted-foreground">{order.deliveryAddress.addressLine2}</p>}
          <p className="text-sm text-muted-foreground">{order.deliveryAddress.city}, {order.deliveryAddress.pincode}</p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/orders"><Button variant="outline">View All Orders</Button></Link>
      </div>
    </div>
  );
}
