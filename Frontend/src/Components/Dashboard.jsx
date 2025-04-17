import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-teal-100 to-cyan-100 px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Welcome, {user.name}!
          </h1>

          {user.roles?.includes("customer") && (
            <section className="mb-8">
              <button className="text-xl font-semibold mb-2 text-teal-700">
                Your Appointments
              </button>
              <p className="text-gray-600">
                View and manage your upcoming appointments.
              </p>
              {/* Add appointment list component here */}
            </section>
          )}

          {user.roles?.includes("business_owner") && (
            <section>
              <h2 className="text-xl font-semibold mb-2 text-teal-700">
                Business Overview
              </h2>
              <p className="text-gray-600">
                Manage your business and view appointments booked by customers.
              </p>
              {/* Add business management component here */}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
