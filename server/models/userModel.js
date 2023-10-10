const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String, required: true, unique: true, maxLength: 60,
  },
  username: {
    type: String, required: true, unique: true, maxLength: 30,
  },
  password: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'Friend', required: false }],
});

module.exports = mongoose.model('User', UserSchema);
