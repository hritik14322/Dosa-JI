import { MapPin, Clock, Phone, AlertCircle } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold font-serif mb-2">Shipping Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="font-bold text-sm">30–45 Minutes</p>
          <p className="text-xs text-muted-foreground">Average delivery time</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="font-bold text-sm">Local Delivery</p>
          <p className="text-xs text-muted-foreground">Within service area</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <Phone className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="font-bold text-sm">Live Tracking</p>
          <p className="text-xs text-muted-foreground">Order status updates</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-foreground">

        <section>
          <h2 className="text-xl font-bold mb-2">1. Delivery Area</h2>
          <p className="text-muted-foreground leading-relaxed">
            We currently deliver within our local service area. Please enter your pincode at checkout to confirm availability at your address. We are continuously expanding our delivery zone.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Delivery Time</h2>
          <p className="text-muted-foreground leading-relaxed">
            Orders are typically delivered within <strong>30 to 45 minutes</strong> of order confirmation. Delivery times may be longer during peak hours, festivals, or adverse weather conditions. We will notify you if there is a significant delay.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. Delivery Charges</h2>
          <p className="text-muted-foreground leading-relaxed">
            A flat delivery charge of <strong>₹40</strong> applies to all orders, regardless of order value or distance within our delivery area. This charge is displayed at checkout before payment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. Order Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            Once your order is placed, you can track its status from the "My Orders" section in your account. Order statuses include: <strong>Pending → Confirmed → Preparing → Out for Delivery → Delivered</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">5. Failed Delivery</h2>
          <p className="text-muted-foreground leading-relaxed">
            In case of a failed delivery (e.g., customer unavailable, incorrect address), our delivery partner will attempt to contact you via the phone number provided. If unreachable, the order may be cancelled and a refund issued as per our Cancellation and Refunds Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">6. Delivery Hours</h2>
          <p className="text-muted-foreground leading-relaxed">
            We accept orders and deliver every day from <strong>9:00 AM to 11:00 PM</strong>. Orders placed after closing hours will be processed the next day.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">7. Contact for Delivery Issues</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any concerns about your delivery, please contact us immediately at <a href="mailto:shreejanandan1@gmail.com" className="text-amber-600 hover:underline">shreejanandan1@gmail.com</a> or call us at +91 95071 07204.
          </p>
        </section>

      </div>
    </div>
  );
}
