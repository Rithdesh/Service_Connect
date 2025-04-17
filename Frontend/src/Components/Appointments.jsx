import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/appointment/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched appointments:", res.data);
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleDelete = (id) => {
    setAppointmentToDelete(id);
  };


const confirmDeleteAppointment = async () => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/appointment/delete/${appointmentToDelete}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 200) {
      toast.success("Appointment deleted successfully!");
      setAppointments((prev) =>
        prev.filter((a) => a._id !== appointmentToDelete)
      );
      setAppointmentToDelete(null);
    } else {
      throw new Error("Failed to delete appointment");
    }
  } catch (error) {
    console.error("Delete failed", error);
    toast.error("Failed to delete appointment");
    setAppointmentToDelete(null);
  }
};



  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
    setEditForm({
      date: appointment.date.split("T")[0],
      time: appointment.time,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/appointment/update/${editingAppointment._id}`,
        { ...editForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Edit failed", error);
      toast.error("Failed to update appointment", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-teal-800">
          My Appointments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {appointments.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                {app.businessName}
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Date:</span>{" "}
                {new Date(app.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Time:</span> {app.time}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Status:</span> {app.status}
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEditClick(app)}
                  className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app._id)}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-teal-700">
              Edit Appointment
            </h3>
            <form onSubmit={handleEditSubmit}>
              <label className="block mb-2 font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleEditChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <label className="block mb-2 font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={editForm.time}
                onChange={handleEditChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {appointmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this appointment?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAppointment}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Appointment;
