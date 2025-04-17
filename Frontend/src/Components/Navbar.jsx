import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setRoles(user.roles || []);
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center rounded-b-xl border-b-2 border-emerald-100">
      <h1 className="text-2xl font-bold text-emerald-600">
        Service Connect
      </h1>
      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="text-gray-700 hover:text-teal-500 font-medium"
        >
          Dashboard
        </Link>
        <Link
          to="/businesses"
          className="text-gray-700 hover:text-teal-500 font-medium"
        >
          Businesses
        </Link>

          <Link
            to="/Appointments"
            className="text-gray-700 hover:text-teal-500 font-medium"
          >
            My Appointments
          </Link>

        {roles.includes("business_owner") && (
            <Link
              to="/mybusinesses"
              className="text-gray-700 hover:text-teal-500 font-medium"
            >
              My Business
            </Link>       
        )}

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
