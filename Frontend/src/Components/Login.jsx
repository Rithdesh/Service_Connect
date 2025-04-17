import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [inputFocus, setInputFocus] = useState({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (field) => {
    setInputFocus((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-emerald-50 via-teal-100 to-cyan-100 px-4 sm:px-6">
    <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl border border-emerald-100">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
        Welcome Back
      </h2>

      {errorMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm text-center rounded-lg animate-pulse">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="mb-4">
          <p className="font-semibold text-gray-700 mb-2">Email</p>
          <div
            className={`relative ${
              inputFocus.email ? "ring-2 ring-emerald-400 ring-opacity-50" : ""
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

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-gray-700 mb-2">
              Password
            </label>
          </div>
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
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              onClick={() => navigate("/register")}
              className="text-teal-600 hover:text-emerald-700 font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  </div>
);
};

export default Login;
