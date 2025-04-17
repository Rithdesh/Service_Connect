const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Middleware to authenticate the user using JWT

const authenticateJWT = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; // { id: user._id, roles: [...] }
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

// Middleware to check specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // console.log("User roles form auth middleware:", roles); // Debugging line
    try{
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "Authorization error", error: "User roles not found" });
    }

    const hasRole = roles.some(role => req.user.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    next();
       }catch(error){
    console.error("Authorization error:", error.message);
    res.status(403).json({ message: "Authorization error", error: error.message });
    };
  };
}

module.exports = { authenticateJWT, authorizeRoles };
