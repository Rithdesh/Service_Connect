const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    owner: {
      type: String,
    },
    businessName: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
