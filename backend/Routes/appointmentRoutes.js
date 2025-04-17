const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require('../Controllers/AppointmentController'); // ✅ make sure these are correctly exported
const { authenticateJWT} = require("../Middleware/authMiddleware");

router.post('/book',authenticateJWT,createAppointment);
router.get('/get',authenticateJWT, getAppointments);
router.put('/update/:id',authenticateJWT, updateAppointment);
router.delete('/delete/:id',authenticateJWT, deleteAppointment);

module.exports = router;
