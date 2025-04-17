const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone:{
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['customer', 'business_owner'],
    default: ['customer'], // all users are customers by default
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
