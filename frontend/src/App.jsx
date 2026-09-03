import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking.jsx";
import Payment from "./components/Payment.jsx";
import Profile from "./pages/Profile.jsx";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
// import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            localStorage.getItem("adminLoggedIn") === "true" ? (
              <Admin />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
