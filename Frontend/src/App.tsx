import { Route, Routes } from "react-router-dom"
import AppNavbar from "./components/Navbar"
import { lazy, Suspense } from "react";
import LoadingState from "./components/LoadingState";

const ListingsPage = lazy(() => import("./pages/ListingPage"));
const ListingDetailPage = lazy(() => import("./pages/ListingDetailPage"));
const CreateListingPage = lazy(() => import("./pages/CreateListingPage"));

function App() {

  return (
    <>
      <AppNavbar/>
      <Suspense fallback={<LoadingState fullPage message="Loading page..." />}>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
      </Routes>
      </Suspense>
    </>
  )
}

export default App
