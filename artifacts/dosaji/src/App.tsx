import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import NotFound from "@/pages/not-found";

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

// Shopkeeper full-page layout
import ShopkeeperLayout from "@/layouts/ShopkeeperLayout";

// Admin
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminCoupons from "@/pages/admin/Coupons";
import ShopkeeperMenu from "@/pages/shopkeeper/Menu";
import ShopkeeperOrders from "@/pages/shopkeeper/Orders";

const queryClient = new QueryClient();

const ProtectedRoute = ({ component: Component, allowedRoles }: { component: any; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Redirect to="/" />;
  return <Component />;
};

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

          <Route path="/orders"><ProtectedRoute component={Orders} allowedRoles={["customer"]} /></Route>
          <Route path="/profile"><ProtectedRoute component={Profile} /></Route>

          {/* Admin Routes */}
          <Route path="/admin"><ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} /></Route>
          <Route path="/admin/users"><ProtectedRoute component={AdminUsers} allowedRoles={["admin"]} /></Route>
          <Route path="/admin/coupons"><ProtectedRoute component={AdminCoupons} allowedRoles={["admin"]} /></Route>
          <Route path="/admin/menu"><ProtectedRoute component={ShopkeeperMenu} allowedRoles={["admin"]} /></Route>
          <Route path="/admin/orders"><ProtectedRoute component={ShopkeeperOrders} allowedRoles={["admin"]} /></Route>

          <Route component={NotFound} />
        </Switch>
      </main>

      <footer className="bg-muted py-8 text-center text-sm text-muted-foreground border-t mt-auto">
        <div className="container mx-auto px-4">
          <p className="font-serif font-bold text-lg mb-2 text-foreground">Dosa Ji</p>
          <p>&copy; {new Date().getFullYear()} Dosa Ji Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function AppRouter() {
  const [location] = useLocation();

  // Shopkeeper routes get their own full-page sidebar layout (no main navbar/footer)
  if (location.startsWith("/shopkeeper")) {
    return <ShopkeeperLayout />;
  }

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
