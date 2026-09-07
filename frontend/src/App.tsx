import { Suspense, lazy, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Spinner } from "@/components/ui/Spinner";

import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { ProductDetail } from "@/pages/ProductDetail";
import { Cart } from "@/pages/Cart";
import { Wishlist } from "@/pages/Wishlist";
import { About } from "@/pages/About";
import { NotFound } from "@/pages/NotFound";

// Route-level code splitting: checkout, auth, account, and the whole admin
// area are behind auth or used less often than the storefront, so they
// don't need to be in the initial bundle every shopper downloads.
const Checkout = lazy(() => import("@/pages/Checkout").then((m) => ({ default: m.Checkout })));
const Login = lazy(() => import("@/pages/auth/Login").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("@/pages/auth/Register").then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword").then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword").then((m) => ({ default: m.ResetPassword })));

const Profile = lazy(() => import("@/pages/account/Profile").then((m) => ({ default: m.Profile })));
const Orders = lazy(() => import("@/pages/account/Orders").then((m) => ({ default: m.Orders })));
const OrderDetail = lazy(() => import("@/pages/account/OrderDetail").then((m) => ({ default: m.OrderDetail })));
const Addresses = lazy(() => import("@/pages/account/Addresses").then((m) => ({ default: m.Addresses })));

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts").then((m) => ({ default: m.AdminProducts })));
const AdminProductForm = lazy(() => import("@/pages/admin/AdminProductForm").then((m) => ({ default: m.AdminProductForm })));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders").then((m) => ({ default: m.AdminOrders })));
const AdminOrderDetail = lazy(() => import("@/pages/admin/AdminOrderDetail").then((m) => ({ default: m.AdminOrderDetail })));

function PageFallback() {
  return <Spinner className="min-h-[60vh]" />;
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/login" element={withSuspense(<Login />)} />
          <Route path="/register" element={withSuspense(<Register />)} />
          <Route path="/forgot-password" element={withSuspense(<ForgotPassword />)} />
          <Route path="/reset-password" element={withSuspense(<ResetPassword />)} />

          <Route
            path="/checkout"
            element={<ProtectedRoute>{withSuspense(<Checkout />)}</ProtectedRoute>}
          />

          <Route
            path="/account"
            element={<ProtectedRoute>{withSuspense(<Profile />)}</ProtectedRoute>}
          />
          <Route
            path="/account/orders"
            element={<ProtectedRoute>{withSuspense(<Orders />)}</ProtectedRoute>}
          />
          <Route
            path="/account/orders/:id"
            element={<ProtectedRoute>{withSuspense(<OrderDetail />)}</ProtectedRoute>}
          />
          <Route
            path="/account/addresses"
            element={<ProtectedRoute>{withSuspense(<Addresses />)}</ProtectedRoute>}
          />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin routes render their own full-page (sidebar) chrome, not the storefront Layout. */}
        <Route path="/admin" element={<AdminRoute>{withSuspense(<AdminDashboard />)}</AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute>{withSuspense(<AdminProducts />)}</AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute>{withSuspense(<AdminProductForm />)}</AdminRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminRoute>{withSuspense(<AdminProductForm />)}</AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute>{withSuspense(<AdminOrders />)}</AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute>{withSuspense(<AdminOrderDetail />)}</AdminRoute>} />
      </Routes>
    </>
  );
}
