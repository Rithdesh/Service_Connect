import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const BusinessCreate = () => {
  const [businesses, setBusinesses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    address: "",
    services: [""],
  });
  const [showCreateModal, setShowCreateModal] = useState(false); // New state for showing create modal
  const [createFormData, setCreateFormData] = useState({
    name: "",
    phone: "",
    address: "",
    services: [''],
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all businesses for the current user
  const fetchBusinesses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/business/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusinesses(res.data.businesses);
    } catch (err) {
      console.error("Error fetching businesses:", err);
    }
  };

  // Confirm business deletion
  const confirmDelete = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };

  // Handle edit button click (open the edit modal)
  const handleEditClick = (business) => {
    setEditingBusiness(business);
    setEditFormData({
      name: business.name,
      address: business.address,
      services: [""], // Convert array to comma-separated string
    });
  };

  // Handle change in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle the submission of the edit form (save the updated business data)
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Convert services string to array before sending
    const updatedData = {
      ...editFormData,
      services: editFormData.services,
    };

    try {
      const res = await axios.put(
        `http://localhost:5000/business/update/${editingBusiness._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Business updated");
      setBusinesses((prev) =>
        prev.map((b) => (b._id === editingBusiness._id ? res.data.business : b))
      );
      setEditingBusiness(null); // Close modal after success
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // Handle business deletion
  const handleDelete = async () => {
    if (!selectedBusiness) return;
    try {
      await axios.delete(
        `http://localhost:5000/business/delete/${selectedBusiness._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBusinesses((prev) =>
        prev.filter((b) => b._id !== selectedBusiness._id)
      );
      setShowModal(false);
      setSelectedBusiness(null);
    } catch (err) {
      console.error("Error deleting business:", err);
    }
  };

const handleEditServiceChange = (index, value) => {
  const updatedServices = [...editFormData.services];
  updatedServices[index] = value;
  setEditFormData({ ...editFormData, services: updatedServices });
};

const handleCreateServiceChange = (index, value) => {
  const updatedServices = [...createFormData.services];
  updatedServices[index] = value;
  setCreateFormData({ ...createFormData, services: updatedServices });
};

  // Add a new service input field (for edit modal)
  const addService = () => {
    setEditFormData({
      ...editFormData,
      services: [...editFormData.services, ""],
    });
  };

  // Remove a service input field (for edit modal)
  const removeService = (index) => {
    const updatedServices = [...editFormData.services];
    updatedServices.splice(index, 1);
    setEditFormData({ ...editFormData, services: updatedServices });
  };

  // Handle change in the create business form (new business creation modal)
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };





  const handleCreateClick = () => {
    setCreateFormData({
      name: "",
      address: "",
      services: [""], // initialize with one empty service
    });
    setShowCreateModal(true);
  };


  // Handle submission of the create business form
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    // Convert services string to array before sending
    const newBusinessData = {
      ...createFormData,
      services: createFormData.services,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/business/create",
        newBusinessData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Business created");
      setBusinesses((prev) => [...prev, res.data.business]);
      setShowCreateModal(false); // Close the create business modal after success
    } catch (error) {
      toast.error("Business creation failed");
    }
  };

  // Add a new service input field (for create modal)
  const addCreateService = () => {
    setCreateFormData({
      ...createFormData,
      services: [...createFormData.services, ""],
    });
  };

  // Remove a service input field (for create modal)
  const removeCreateService = (index) => {
    const updatedServices = [...createFormData.services];
    updatedServices.splice(index, 1);
    setCreateFormData({ ...createFormData, services: updatedServices });
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-teal-800">
              Your Businesses
            </h1>
            <button
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg transition"
              onClick={handleCreateClick}
            >
              + Create Business
            </button>
          </div>

          {businesses.length === 0 ? (
            <p className="text-gray-600 text-center mt-12">
              No businesses found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((biz) => (
                <div
                  key={biz._id}
                  className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
                >
                  <h3 className="text-xl font-semibold text-teal-700 mb-2">
                    {biz.name}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Owner:</span> {user.name}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Phone No:</span> {user.phone}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Address:</span> {biz.address}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Services:</span>{" "}
                    {biz.services?.join(", ")}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md transition"
                      onClick={() => handleEditClick(biz)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(biz)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="text-red-600 font-semibold">
                  {selectedBusiness?.name}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingBusiness && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white p-6 rounded-lg w-96 shadow-xl"
            >
              <h3 className="text-lg font-bold mb-4">Edit Business</h3>
              <input
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                placeholder="Business Name"
                className="w-full border p-2 mb-3 rounded"
                required
              />
              <input
                name="address"
                value={editFormData.address}
                onChange={handleEditChange}
                placeholder="Address"
                className="w-full border p-2 mb-3 rounded"
                required
              />
              <label className="font-medium">Services Offered:</label>
              {editFormData.services.map((service, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) =>
                      handleEditServiceChange(index, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                    placeholder={`Service ${index + 1}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="bg-blue-500 text-white px-3 py-1 rounded mb-4 hover:bg-blue-600"
              >
                + Add Service
              </button>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingBusiness(null)}
                  className="mr-3 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
              onSubmit={handleCreateSubmit}
              className="bg-white p-6 rounded-lg w-96 shadow-xl"
            >
              <h3 className="text-lg font-bold mb-4">Create Business</h3>
              <input
                name="name"
                value={createFormData.name}
                onChange={handleCreateChange}
                placeholder="Business Name"
                className="w-full border p-2 mb-3 rounded"
                required
              />
              <input
                name="address"
                value={createFormData.address}
                onChange={handleCreateChange}
                placeholder="Address"
                className="w-full border p-2 mb-3 rounded"
                required
              />
              <label className="font-medium">Services Offered:</label>
              {createFormData.services.map((service, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) =>
                      handleCreateServiceChange(index, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                    placeholder={`Service ${index + 1}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeCreateService(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCreateService}
                className="bg-blue-500 text-white px-3 py-1 rounded mb-4 hover:bg-blue-600"
              >
                + Add Service
              </button>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mr-3 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                >
                  Create Business
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
export default BusinessCreate;
