// imports
const mongoose = require('mongoose');
const utils = require('../util');
const { Schema } = mongoose;

// schema definition
const userSchema = new Schema({
  img: {
    type: String,
    default: 'https://res.cloudinary.com/s4whf65/image/upload/v1661179042/avatars/vgj2dxxqucypsx7tkpfv.jpg'
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },

  // 🔐 Role to support admin features
  role: {
    type: String,
    enum: ['blogger', 'admin'],  // explicitly restrict values
    default: 'blogger'
  },

  job: {
    type: String,
    default: ''
  },
  joined: {
    type: String,
    default: utils.getCurretDate()
  },
  address: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  }
});

// model
const User = mongoose.model('User', userSchema);

// exports
module.exports = {
  User
};
