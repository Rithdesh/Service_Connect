import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

import Dashboard from "./Components/Dashboard";
import Business from "./Components/Businesses";
import Appointment from "./Components/Appointments";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AppointmentBook from "./Components/AppointmentBook";
import BusinessCreate from "./Components/BusinessCreate";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/businesses"
          element={
            <ProtectedRoute>
              <Business />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book"
          element={
            <ProtectedRoute allowedRoles={["customer", "business_owner"]}>
              <AppointmentBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Appointments"
          element={
            <ProtectedRoute allowedRoles={["customer", "business_owner"]}>
              <Appointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mybusinesses"
          element={
            <ProtectedRoute allowedRoles={[ "business_owner"]}>
              <BusinessCreate />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      </Routes>
      <ToastContainer position="top-center" autoClose={5000} />
    </>
  );
}

export default App;
