import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <Routes>
      <Route element={!isAuthenticated ? <AuthLayout /> : <Navigate to="/home" />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:username" element={<Profile />} />
        <Route path="/search" element={<Explore />} />
        <Route
          path="/create"
          element={<div className="p-4 fw-bold">Halaman Buat Post (WIP)</div>}
        />
      </Route>

      {/* Rute Catch-All */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
    </Routes>
  );
}

export default App;
