import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
const Business = () => {
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem("token"); // make sure token is stored here
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/business/allBusinesses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched businesses:", response.data); // <-- See what's returned
      setBusinesses(response.data.businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  fetchBusinesses();
}, []);


  const handleBook = (business) => {
    navigate("/book", { state: { business } });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 py-8 px-4 ">
        <h2 className="text-3xl font-bold text-center mb-8 text-teal-800">
          Available Businesses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {businesses.map((biz) => (
            <div
              key={biz._id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                {biz.name}
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Owner:</span> {biz.owner?.name}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Phone No:</span> {biz.owner?.phone}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Address:</span> {biz.address}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Services:</span>{" "}
                {biz.services?.join(", ")}
              </p>
              <button
                onClick={() => handleBook(biz)}
                className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition duration-200"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Business;
