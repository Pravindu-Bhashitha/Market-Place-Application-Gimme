import AppNavbar from "./components/Navbar"
import AppRoutes from "./routes/AppRoutes";


function App() {

  return (
    <>
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <AppNavbar />
        <div className="flex-grow-1 d-flex justify-content-center">
          <AppRoutes />
        </div>
      </div>
    </>
  )
}

export default App
