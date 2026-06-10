export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold font-serif mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

      <div className="prose prose-sm max-w-none space-y-6 text-foreground">

        <section>
          <h2 className="text-xl font-bold mb-2">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Dosa Ji ("we", "our", "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
            <li><strong>Account information:</strong> Name, email address, and password when you register.</li>
            <li><strong>Order information:</strong> Delivery address, phone number, and order details when you place an order.</li>
            <li><strong>Payment information:</strong> Payment is processed securely by Razorpay. We do not store your card or UPI details.</li>
            <li><strong>Usage data:</strong> Pages visited, browser type, and device information collected automatically.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
            <li>To process and fulfil your orders.</li>
            <li>To send order confirmations and updates.</li>
            <li>To improve our website and services.</li>
            <li>To respond to your queries and provide customer support.</li>
            <li>To comply with legal and regulatory obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. Sharing of Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share your data with:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed mt-2">
            <li><strong>Payment processors:</strong> Razorpay, solely to process payments.</li>
            <li><strong>Delivery partners:</strong> To fulfil your delivery.</li>
            <li><strong>Legal authorities:</strong> If required by law or to protect our rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including SSL encryption to protect your data. However, no transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">6. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use session storage and local storage to maintain your session and cart. We may use cookies for analytics purposes. You can disable cookies in your browser settings, though this may affect the functionality of our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">7. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a href="mailto:shreejanandan1@gmail.com" className="text-amber-600 hover:underline">shreejanandan1@gmail.com</a>. We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">8. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your personal data for as long as your account is active or as needed to provide services. Order data is retained for up to 5 years for accounting and legal purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">9. Third-Party Links</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">10. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised date. Your continued use of our services after changes are posted constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">11. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            For privacy-related queries, contact us at <a href="mailto:shreejanandan1@gmail.com" className="text-amber-600 hover:underline">shreejanandan1@gmail.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
