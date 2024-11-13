import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginPassword from "./pages/LoginPassword";
import RegisterPassword from "./pages/RegisterPassword";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Profile from "./pages/Profile";
import OtherSchedules from "./pages/OtherSchedules";
import JadwalMendatangHistory from "./pages/JadwalMendatangHistory";
import VerificationPending from "./pages/VerificationPending";
import Verify from "./pages/Verify";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login-password"
            element={
              <PublicRoute>
                <LoginPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/register-password"
            element={
              <PublicRoute>
                <RegisterPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/other-schedules"
            element={
              <ProtectedRoute>
                <OtherSchedules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jadwal-mendatang-history"
            element={
              <ProtectedRoute>
                <JadwalMendatangHistory />
              </ProtectedRoute>
            }
          />
          <Route path="/verify/:code" element={<Verify />} />
          <Route
            path="/verification-pending"
            element={<VerificationPending />}
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
