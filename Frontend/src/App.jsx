import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Leads from "./pages/Leads";
import LeadForm from "./pages/LeadForm"; // Import the LeadForm component
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/">Home</Link> | <Link to="/signup">Signup</Link> |{" "}
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/new"
          element={
            <ProtectedRoute>
              <LeadForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/:id/edit"
          element={
            <ProtectedRoute>
              <LeadForm />
            </ProtectedRoute>
          }
        />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/verify-email" element={<VerifyEmail />} />
        
      </Routes>
    </div>
  );
}