import { AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function CancellationRefunds() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold font-serif mb-2">Cancellation &amp; Refunds</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Since we deal in freshly prepared food, cancellations are only accepted before the kitchen begins preparation. Please read our policy carefully.
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-foreground">

        <section>
          <h2 className="text-xl font-bold mb-3">Cancellation Policy</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-green-800">Within 2 minutes of placing the order</p>
                <p className="text-sm text-green-700">Full cancellation allowed. 100% refund issued.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-amber-800">After 2 minutes — order being prepared</p>
                <p className="text-sm text-amber-700">Cancellation may not be possible. Please contact us immediately and we will do our best to assist.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-red-800">After dispatch / Out for delivery</p>
                <p className="text-sm text-red-700">Cancellations are not accepted once the order is out for delivery.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Refund Policy</h2>

          <h3 className="font-semibold mb-1 mt-3">Eligible for Full Refund</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
            <li>Order cancelled within the allowed window (within 2 minutes).</li>
            <li>Order not delivered within 90 minutes of confirmation with no prior communication.</li>
            <li>Incorrect or missing items in the delivered order.</li>
            <li>Food quality issues substantiated with photo evidence submitted within 30 minutes of delivery.</li>
            <li>Double payment due to technical error.</li>
          </ul>

          <h3 className="font-semibold mb-1 mt-4">Not Eligible for Refund</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
            <li>Change of mind after preparation has begun.</li>
            <li>Incorrect address provided by the customer.</li>
            <li>Customer unavailable at delivery address despite multiple contact attempts.</li>
            <li>Spice level or taste preference complaints (we recommend contacting us before ordering).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Refund Process</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
            <li>Approved refunds are processed within <strong>5–7 business days</strong> to the original payment method.</li>
            <li>For online payments via Razorpay, the refund will be credited to the source account (UPI, bank account, or card).</li>
            <li>Cash on Delivery refunds will be processed via bank transfer — please provide your bank details when raising a request.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">How to Request a Cancellation or Refund</h2>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground leading-relaxed">
            <li>Email us at <a href="mailto:support@dosaji.com" className="text-amber-600 hover:underline">support@dosaji.com</a> with your order number and reason.</li>
            <li>Or call us at <strong>+91-XXXXXXXXXX</strong> during business hours (9 AM – 11 PM).</li>
            <li>Our team will review your request and respond within 24 hours.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Disputes</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you are not satisfied with our resolution, you may raise a dispute through the Razorpay payment portal or contact your bank. We are committed to resolving all concerns fairly and promptly.
          </p>
        </section>

      </div>
    </div>
  );
}
