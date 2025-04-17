const express = require("express");
const router = express.Router();
const {
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getAllBusinesses, 
  AllBusinesses,
} = require("../Controllers/BusinessController");

const { authenticateJWT, authorizeRoles } = require("../Middleware/authMiddleware");

// Create a business - Only for business owners
router.post("/create", authenticateJWT, authorizeRoles("business_owner"), createBusiness);

// Update a business
router.put("/update/:id", authenticateJWT, authorizeRoles("business_owner"), updateBusiness);

// Delete a business
router.delete("/delete/:id", authenticateJWT, authorizeRoles("business_owner"), deleteBusiness);

// Retrieve all businesses owned by the current user
router.get("/all", authenticateJWT,authorizeRoles("business_owner"), getAllBusinesses);

//retrieve all the available businesses in the system
router.get("/allBusinesses", authenticateJWT, AllBusinesses);


module.exports = router;
