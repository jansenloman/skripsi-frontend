import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginPassword from "./pages/LoginPassword";
import RegisterPassword from "./pages/RegisterPassword";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Profile from "./pages/Profile";
import JadwalKuliah from "./pages/JadwalKuliah";
import JadwalMendatang from "./pages/JadwalMendatang";
import JadwalMendatangHistory from "./pages/JadwalMendatangHistory";
import VerificationPending from "./pages/VerificationPending";
import Verify from "./pages/Verify";
import { AnimatePresence } from "framer-motion";
import GenerateSchedule from "./pages/GenerateSchedule";
// import SchedulePreview from "./pages/SchedulePreview";
import Settings from "./pages/Settings";
import { Toaster } from "react-hot-toast";
import ScheduleList from "./pages/ScheduleList";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
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
            path="/jadwal-kuliah"
            element={
              <ProtectedRoute>
                <JadwalKuliah />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jadwal-mendatang"
            element={
              <ProtectedRoute>
                <JadwalMendatang />
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
          <Route
            path="/generate-schedule"
            element={
              <ProtectedRoute>
                <GenerateSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule-list"
            element={
              <ProtectedRoute>
                <ScheduleList />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/schedule-preview"
            element={
              <ProtectedRoute>
                <SchedulePreview />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
