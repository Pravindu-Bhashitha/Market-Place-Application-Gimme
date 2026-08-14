import { Route, Routes } from "react-router-dom"
import AppNavbar from "./components/Navbar"
import { lazy, Suspense } from "react";
import LoadingState from "./components/LoadingState";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ListingsPage = lazy(() => import("./pages/ListingPage"));
const ListingDetailPage = lazy(() => import("./pages/ListingDetailPage"));
const CreateListingPage = lazy(() => import("./pages/CreateListingPage"));

function App() {

  return (
    <>
      <AppNavbar />
      <Suspense fallback={<LoadingState fullPage message="Loading page..." />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ListingsPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
