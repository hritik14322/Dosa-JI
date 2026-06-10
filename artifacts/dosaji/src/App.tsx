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
