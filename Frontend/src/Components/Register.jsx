import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roles: [],
  });

  const [inputFocus, setInputFocus] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "roles") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          roles: [...prev.roles, value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          roles: prev.roles.filter((role) => role !== value),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFocus = (field) => {
    setInputFocus((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMsg(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-emerald-50 via-teal-100 to-cyan-100 px-4 sm:px-6">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl border border-emerald-100">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
          Create Your Account
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm text-center rounded-lg animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <div
              className={`relative ${
                inputFocus.name ? "ring-2 ring-emerald-400 ring-opacity-50" : ""
              }`}
            >
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200 ${
                  inputFocus.name ? "border-emerald-400" : "border-gray-300"
                }`}
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <div
              className={`relative ${
                inputFocus.email
                  ? "ring-2 ring-emerald-400 ring-opacity-50"
                  : ""
              }`}
            >
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200 ${
                  inputFocus.email ? "border-emerald-400" : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div
              className={`relative ${
                inputFocus.phone
                  ? "ring-2 ring-emerald-400 ring-opacity-50"
                  : ""
              }`}
            >
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus("phone")}
                onBlur={() => handleBlur("phone")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200 ${
                  inputFocus.phone ? "border-emerald-400" : "border-gray-300"
                }`}
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div
              className={`relative ${
                inputFocus.password
                  ? "ring-2 ring-emerald-400 ring-opacity-50"
                  : ""
              }`}
            >
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200 ${
                  inputFocus.password ? "border-emerald-400" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Roles - Checkboxes */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Role(s)
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="roles"
                  value="customer"
                  checked={formData.roles.includes("customer")}
                  onChange={handleChange}
                  className="text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Customer</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="roles"
                  value="business_owner"
                  checked={formData.roles.includes("business_owner")}
                  onChange={handleChange}
                  className="text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Business Owner</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
              isLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 hover:shadow-md"
            }`}
          >
            {isLoading ? (
              <span className="flex justify-center items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing up...
              </span>
            ) : (
              "Register"
            )}
          </button>

          {/* Link to Login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="text-teal-600 hover:text-emerald-700 font-medium"
              >
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
