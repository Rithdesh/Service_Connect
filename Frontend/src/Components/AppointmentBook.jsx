import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import Navbar from "./Navbar";


const AppointmentBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { business } = location.state;

  const [formData, setFormData] = useState({
    customerName: "",
    date: "",
    time: "",
    service: business.services[0],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/appointment/book`,
        {
          ...formData,
          businessName: business.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Booking success"); // Debugging line  
      toast.success("Appointment booked successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Booking failed! Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };


  return (
    <>
    <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-teal-700 text-center">
            Book Appointment
          </h2>
          <div className="mb-4 text text-gray-700">
            <p>
              <span className="font-medium text-teal-800">Business:</span>{" "}
              {business.name}
            </p>
            <p>
              <span className="font-medium text-teal-800">Address:</span>{" "}
              {business.address}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-200"
            >
              Confirm Appointment
            </button>
          </form>
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </>
  );
};

export default AppointmentBook;
