const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();

// Import routes
const userRoutes = require("./Routes/userRoutes");
const appointmentRoutes = require("./Routes/appointmentRoutes");
const businessRoutes = require("./Routes/BusinessRoutes");

console.log("🔥 server.js is running");

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://service-connect-rithdeshs-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected successfully");
    console.log("📂 Using DB:", mongoose.connection.name);

    // Register routes
    app.use('/user', userRoutes);
    app.use('/appointment', appointmentRoutes);
    app.use('/business', businessRoutes);

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });