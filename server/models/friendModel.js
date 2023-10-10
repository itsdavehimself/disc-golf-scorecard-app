const mongoose = require('mongoose');

const { Schema } = mongoose;

const FriendSchema = new Schema({
  name: { type: String, required: true, maxLength: 15 },
  scorecards: [{ type: Schema.Types.ObjectId, ref: 'Scorecard', required: false }],
});

module.exports = mongoose.model('Friend', FriendSchema);
