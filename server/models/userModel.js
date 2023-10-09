const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 50 },
  last_name: { type: String, required: true, maxLength: 50 },
  email: {
    type: String, required: true, unique: true, maxLength: 60,
  },
  username: {
    type: String, required: true, unique: true, maxLength: 30,
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);