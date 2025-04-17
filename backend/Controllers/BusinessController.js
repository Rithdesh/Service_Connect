const Business = require("../Models/Business");
const User = require("../Models/User");

// Middleware to check if user has "business_owner" role
const isBusinessOwner = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.roles.includes("business_owner")) {
    return res.status(403).json({ message: "Access denied. Not a business owner." });
  }
  console.log("User roles:", user.roles); // Debugging line
  
  next();
};

// Create business
const createBusiness = async (req, res) => {
  try {
    const { name, description, address,  services } = req.body;

    const newBusiness = new Business({
      name,
      description,
      address,
      services,
      owner: req.user.id,
    });

    await newBusiness.save();
    res.status(201).json({ message: "Business created successfully", business: newBusiness });
  } catch (err) {
    res.status(500).json({ message: "Failed to create business", error: err.message });
  }
};

// Update business
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ _id: req.params.id});
    if (!business) return res.status(404).json({ message: "Business not found" });

    Object.assign(business, req.body);
    await business.save();

    res.status(200).json({ message: "Business updated successfully", business });
  } catch (err) {
    res.status(500).json({ message: "Failed to update business", error: err.message });
  }
};

// Delete business
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!business) return res.status(404).json({ message: "Business not found or unauthorized" });

    res.status(200).json({ message: "Business deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete business", error: err.message });
  }
};

//retrieve all the business owned by the current user
const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.user.id }).populate('owner', 'name email phone');
    res.status(200).json({ businesses });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve businesses", error: err.message });
  }
};

//retrieve all teh business available inthe system
const AllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate('owner', 'name phone');
    res.status(200).json({ businesses });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve businesses", error: err.message });
  }
};

module.exports = {
  createBusiness,
  updateBusiness,
  deleteBusiness,
  isBusinessOwner,
  getAllBusinesses,
  AllBusinesses,
};
