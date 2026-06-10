import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import NotFound from "@/pages/not-found";
import { Link } from "wouter";

// Pages
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Cart from "@/pages/Cart";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ShippingPolicy from "@/pages/ShippingPolicy";
import CancellationRefunds from "@/pages/CancellationRefunds";

// Shopkeeper & Admin full-page layouts
import ShopkeeperLayout from "@/layouts/ShopkeeperLayout";
import AdminLayout from "@/layouts/AdminLayout";

const queryClient = new QueryClient();

const ProtectedRoute = ({ component: Component, allowedRoles }: { component: any; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Redirect to="/" />;
  return <Component />;
};

function Footer() {
  return (
    <footer className="bg-muted border-t mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="font-serif font-bold text-lg mb-3 text-foreground">Dosa Ji</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Freshly made dosas, pizzas, burgers &amp; rolls — delivered hot to your door.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3 text-foreground uppercase tracking-wider">Quick Links</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="text-muted-foreground hover:text-foreground transition-colors">Menu</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3 text-foreground uppercase tracking-wider">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">Shipping Policy</Link></li>
              <li><Link href="/cancellation" className="text-muted-foreground hover:text-foreground transition-colors">Cancellation &amp; Refunds</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dosa Ji Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/cart" component={Cart} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/order-confirmation/:id" component={OrderConfirmation} />
          <Route path="/terms" component={TermsAndConditions} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/shipping" component={ShippingPolicy} />
          <Route path="/cancellation" component={CancellationRefunds} />

          <Route path="/orders"><ProtectedRoute component={Orders} allowedRoles={["customer"]} /></Route>
          <Route path="/profile"><ProtectedRoute component={Profile} /></Route>

          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />
    </div>
  );
}

function AppRouter() {
  const [location] = useLocation();

  if (location.startsWith("/shopkeeper")) return <ShopkeeperLayout />;
  if (location.startsWith("/admin")) return <AdminLayout />;

  return <CustomerLayout />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRouter />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
