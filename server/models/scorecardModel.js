const mongoose = require('mongoose');

const { Schema } = mongoose;

const ScorecardSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: false },
  notes: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  players: [
    {
      name: { type: String },
      scores: [
        {
          holeNumber: { type: Number, required: true },
          holePar: { type: Number, required: true },
          score: { type: Number, required: true },
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Scorecard', ScorecardSchema);
