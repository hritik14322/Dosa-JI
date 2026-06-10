import { useState } from "react";
import { Navbar } from "./_shared/Navbar";
import { Footer } from "./_shared/Footer";
import { Minus, Plus, Trash2, Tag, ArrowRight } from "lucide-react";
import "./_shared/_group.css";

const CART_ITEMS = [
  { id: 1, name: "Ghee Roast Masala Dosa", price: 120, qty: 1, img: "/__mockup/images/masala-dosa.png" },
  { id: 2, name: "Ghee Ven Pongal", price: 80, qty: 2, img: "/__mockup/images/ven-pongal.png" },
  { id: 3, name: "Authentic Filter Coffee", price: 40, qty: 2, img: "/__mockup/images/filter-coffee.png" }
];

export function CartCheckout() {
  const [items, setItems] = useState(CART_ITEMS);
  const [couponCode, setCouponCode] = useState("");

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = 30;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  const updateQty = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--dosa-bg)" }}>
      <Navbar scrolled={true} cartCount={items.length} currentPage="cart" />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-10 font-['Inter'] text-sm font-medium">
            <span style={{ color: "var(--dosa-amber)" }} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">1</span>
              Delivery Details
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100">2</span>
              Payment
            </span>
          </div>

          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-8 text-gray-900">Checkout</h1>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left Column: Cart Items */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: "1px solid var(--dosa-card-border)", boxShadow: "var(--dosa-shadow)" }}>
                  <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                    <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-gray-900">Your Order</h2>
                    <button onClick={() => setItems([])} className="text-sm font-['Inter'] font-medium text-red-500 hover:text-red-600 transition-colors">
                      Clear Cart
                    </button>
                  </div>

                  <div className="space-y-6">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4 md:gap-6 items-center">
                        <img src={item.img} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-amber-100/50" />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-['Inter'] font-semibold text-gray-900">{item.name}</h3>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: "var(--dosa-card-border)" }}>
                              <button onClick={() => updateQty(item.id, -1)} className="p-2 hover:bg-amber-50 transition-colors text-gray-600"><Minus className="w-4 h-4" /></button>
                              <span className="w-10 text-center font-medium font-['Inter'] text-gray-900">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="p-2 hover:bg-amber-50 transition-colors text-gray-600"><Plus className="w-4 h-4" /></button>
                            </div>
                            
                            <span className="font-bold text-lg" style={{ color: "var(--dosa-amber)" }}>₹{item.price * item.qty}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-sm font-medium font-['Inter'] hover:underline" style={{ color: "var(--dosa-amber)" }}>
                      <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5">
                <div className="sticky top-[100px] bg-white rounded-2xl p-6 md:p-8" style={{ border: "1px solid var(--dosa-card-border)", boxShadow: "var(--dosa-shadow)" }}>
                  <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                  {/* Coupon */}
                  <div className="flex gap-2 mb-8">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Coupon code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                        style={{ borderColor: "var(--dosa-card-border)" }}
                      />
                    </div>
                    <button className="px-5 py-2.5 rounded-lg font-medium text-sm font-['Inter'] bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                      Apply
                    </button>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 font-['Inter'] text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.length} items)</span>
                      <span className="font-medium text-gray-900">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-gray-900">₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & GST (5%)</span>
                      <span className="font-medium text-gray-900">₹{gst}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-['Inter'] font-semibold text-gray-900">Total</span>
                    <span className="font-['Playfair_Display'] font-bold text-2xl" style={{ color: "var(--dosa-amber)" }}>₹{total}</span>
                  </div>

                  {/* Action */}
                  <button className="w-full py-4 rounded-full text-white font-semibold font-['Inter'] text-lg transition-transform hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2" style={{ background: "linear-gradient(to right, var(--dosa-saffron), var(--dosa-amber))" }}>
                    Proceed to Payment <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl p-12 text-center" style={{ border: "1px solid var(--dosa-card-border)", boxShadow: "var(--dosa-shadow)" }}>
              <div className="w-32 h-32 mx-auto mb-6 bg-amber-50 rounded-full flex items-center justify-center">
                <img src="/__mockup/images/idli-sambar.png" alt="Empty Cart" className="w-20 h-20 opacity-50 grayscale" />
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-gray-900 mb-3">Your cart is feeling empty</h2>
              <p className="font-['Inter'] text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any of our delicious South Indian delicacies yet.</p>
              <button className="px-8 py-3 rounded-full text-white font-semibold font-['Inter'] transition-transform hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2 shadow-md" style={{ background: "linear-gradient(to right, var(--dosa-saffron), var(--dosa-amber))" }}>
                Browse Menu
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
