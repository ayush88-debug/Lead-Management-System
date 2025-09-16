import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Leads from "./pages/Leads";
import LeadForm from "./pages/LeadForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout"; // Import the new Layout component

export default function App() {
  return (
    <Routes>
      {/* Protected Routes will now use the Layout with the Navbar */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Leads />} />
        <Route path="leads/new" element={<LeadForm />} />
        <Route path="leads/:id/edit" element={<LeadForm />} />
      </Route>

      {/* Public Routes do not have the Navbar */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}