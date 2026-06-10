import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApplyCoupon, useCreateOrder, useCreatePaymentOrder } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, subtotal, total, couponCode, couponDiscount, setCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const applyCouponMutation = useApplyCoupon();
  const createPaymentOrderMutation = useCreatePaymentOrder();
  const createOrderMutation = useCreateOrder();

  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [address, setAddress] = useState({
    name: "", phone: "", addressLine1: "", addressLine2: "", city: "", pincode: ""
  });

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    if (!isAuthenticated) {
      toast({ title: "Login required", description: "Please log in to apply coupon codes.", variant: "destructive" });
      return;
    }
    applyCouponMutation.mutate({ data: { code: couponInput.trim().toUpperCase(), orderTotal: subtotal } }, {
      onSuccess: (res) => {
        setCoupon(couponInput.trim().toUpperCase(), res.discount ?? 0);
        toast({ title: "Coupon applied! 🎉", description: res.message });
      },
      onError: (err: any) => {
        const msg = err?.error || err?.message || "Invalid or expired coupon code";
        toast({ title: "Coupon not applied", description: msg, variant: "destructive" });
        setCoupon(null, 0);
      }
    });
  };

  const handleRemoveCoupon = () => {
    setCoupon(null, 0);
    setCouponInput("");
  };

  const placeOrder = (rzpOrderId: string, rzpPaymentId: string, rzpSignature?: string) => {
    createOrderMutation.mutate({
      data: {
        items: items.map(i => ({
          menuItemId: i.menuItemId,
          name: i.name + (i.selectedSize ? ` (${i.selectedSize})` : ""),
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
        deliveryAddress: address,
        couponCode: couponCode ?? undefined,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: rzpPaymentId,
        razorpaySignature: rzpSignature ?? null,
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        setLocation(`/order-confirmation/${order.id}`);
      },
      onError: (err: any) => {
        toast({ title: "Checkout failed", description: err.error || "An error occurred", variant: "destructive" });
      }
    });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({ title: "Login required", description: "Please login to checkout" });
      setLocation("/login");
      return;
    }
    if (items.length === 0) return;
    if (!address.name || !address.phone || !address.addressLine1 || !address.city || !address.pincode) {
      toast({ title: "Missing details", description: "Please fill all required address fields", variant: "destructive" });
      return;
    }

    try {
      const paymentOrder = await createPaymentOrderMutation.mutateAsync({ data: { amount: total } });

      // ── Real Razorpay checkout ──────────────────────────────────────────────
      if (paymentOrder.keyId) {
        // Dynamically load the Razorpay checkout script
        await new Promise<void>((resolve, reject) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((window as any).Razorpay) { resolve(); return; }
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
          document.body.appendChild(s);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay({
          key: paymentOrder.keyId,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency ?? "INR",
          order_id: paymentOrder.id,
          name: "Dosa Ji",
          description: `Order for ${address.name}`,
          image: "/favicon.svg",
          prefill: { name: address.name, contact: address.phone },
          theme: { color: "#f59e0b" },
          handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            placeOrder(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
          },
        });

        rzp.on("payment.failed", (response: any) => {
          toast({
            title: "Payment failed",
            description: response?.error?.description || "Your payment could not be processed. Please try again.",
            variant: "destructive",
          });
        });

        rzp.open();
        return; // Order is placed inside the handler callback above
      }

      // ── Mock / dev mode (no Razorpay keys set) ────────────────────────────
      placeOrder(paymentOrder.id || `rzp_mock_${Date.now()}`, `pay_mock_${Date.now()}`);
    } catch (err: any) {
      toast({ title: "Payment failed", description: err?.message || err?.error || "Failed to initiate payment", variant: "destructive" });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button onClick={() => setLocation("/menu")}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Cart Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.menuItemId}:${item.selectedSize ?? ""}`} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.selectedSize && (
                          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">{item.selectedSize}</span>
                        )}
                      </div>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => updateQty(item.menuItemId, item.quantity - 1, item.selectedSize)} className="px-2 py-1 hover:bg-muted">-</button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item.menuItemId, item.quantity + 1, item.selectedSize)} className="px-2 py-1 hover:bg-muted">+</button>
                      </div>
                      <span className="text-xs text-gray-400">₹{item.price} each</span>
                      <button onClick={() => removeItem(item.menuItemId, item.selectedSize)} className="text-sm text-destructive hover:underline ml-auto">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input id="addressLine1" value={address.addressLine1} onChange={e => setAddress({ ...address, addressLine1: e.target.value })} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input id="addressLine2" value={address.addressLine2} onChange={e => setAddress({ ...address, addressLine2: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} required />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {couponCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
                <div>
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Coupon Applied</span>
                  <p className="font-bold text-green-800">{couponCode}</p>
                </div>
                <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Coupon Code"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                  className="uppercase placeholder:normal-case"
                />
                <Button variant="outline" onClick={handleApplyCoupon} disabled={applyCouponMutation.isPending}>
                  {applyCouponMutation.isPending ? "..." : "Apply"}
                </Button>
              </div>
            )}

            <div className="space-y-2 text-sm mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span>₹40</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (5%)</span>
                <span>₹{(subtotal * 0.05).toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full h-12 text-lg"
              onClick={handleCheckout}
              disabled={createPaymentOrderMutation.isPending || createOrderMutation.isPending}
            >
              {(createPaymentOrderMutation.isPending || createOrderMutation.isPending) ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
