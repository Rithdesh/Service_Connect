const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
require("dotenv").config();


// Register a user (customer, business owner or both)
const register = async (req, res) => {
  try {
    // console.log("Registering user:", req.body);
    
    const { name, email, password, role,phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      roles: Array.isArray(role) ? role : [role || 'customer']
      
    });

    await newUser.save();
    // console.log(newUser);
    

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};




const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    // console.log(process.env.SECRET);
    
    

    const token = jwt.sign(
      { 
        id: user._id,
        roles: user.roles ,
        name: user.name,
        phone: user.phone
      },
      process.env.SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        phone: user.phone
      },
    });
    console.log("Login successful",user.name,"phone:",user.phone);

    
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
    
  }
};
  

//get all the users present in the database
const getUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // exclude password
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting users:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {getUsers,login,register};
