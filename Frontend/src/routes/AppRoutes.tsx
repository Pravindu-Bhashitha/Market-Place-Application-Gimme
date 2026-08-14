import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingState from "../components/LoadingState";

const ListingsPage = lazy(() => import("../pages/ListingPage"));
const ListingDetailPage = lazy(() => import("../pages/ListingDetailPage"));
const CreateListingPage = lazy(() => import("../pages/CreateListingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingState fullPage message="Loading page..." />}>
      <Routes>
        <Route path="*" element={<div className="text-center py-5"><h3>Page not found</h3></div>} />
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <CreateListingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;