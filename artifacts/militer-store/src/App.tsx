import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import NotFound from "@/pages/not-found";

// Public pages
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/product-detail";

// Admin pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products/index";
import AdminProductForm from "@/pages/admin/products/form";
import AdminCategories from "@/pages/admin/categories/index";
import AdminSettings from "@/pages/admin/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* ── Public storefront ──────────────────────────────── */}
      <Route path="/" component={Home} />
      <Route path="/produk" component={Catalog} />
      <Route path="/produk/:id" component={ProductDetail} />

      {/* ── Admin login (public) ───────────────────────────── */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* ── Admin dashboard (protected) ────────────────────── */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/products">
        <ProtectedRoute component={AdminProducts} />
      </Route>
      <Route path="/admin/products/new">
        <ProtectedRoute component={AdminProductForm} />
      </Route>
      <Route path="/admin/products/:id/edit">
        <ProtectedRoute component={AdminProductForm} />
      </Route>
      <Route path="/admin/categories">
        <ProtectedRoute component={AdminCategories} />
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute component={AdminSettings} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
