const mongoose = require('mongoose');

const { Schema } = mongoose;

const FriendSchema = new Schema({
  name: {
    type: String, required: true, minLength: 1, maxLength: 15,
  },
  scorecards: [{ type: Schema.Types.ObjectId, ref: 'Scorecard', required: false }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Friend', FriendSchema);
