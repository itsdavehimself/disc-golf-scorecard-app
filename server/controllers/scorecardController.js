const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Scorecard = require('../models/scorecardModel');

// Get all scorecard documents
exports.getAllScorecards = asyncHandler(async (req, res) => {
  const scorecards = await Scorecard.find({}).sort({ date: -1 });
  res.status(200).json(scorecards);
});

// Create new scorecard
exports.createScorecard = asyncHandler(async (req, res) => {
  const {
    course, date, startTime, endTime, notes, userId, players,
  } = req.body;

  try {
    const scorecard = await Scorecard.create({
      course, date, startTime, endTime, notes, userId, players,
    });
    res.status(200).json(scorecard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single scorecard
exports.getScorecard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Scorecard does not exist' });
  }

  const scorecard = await Scorecard.findById(id);

  if (!scorecard) {
    return res.status(404).json({ error: 'Scorecard does not exist' });
  }

  res.status(200).json({ scorecard });
});

// Delete a single scorecard
exports.deleteScorecard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Scorecard does not exist' });
  }

  const scorecard = await Scorecard.findOneAndDelete({ _id: id });

  if (!scorecard) {
    return res.status(400).json({ error: 'Scorecard does not exist' });
  }

  res.status(200).json(scorecard);
});

// Update a single scorecard
exports.updateScorecard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Scorecard does not exist' });
  }

  const scorecard = await Scorecard.findOneAndUpdate({ _id: id }, {
    ...req.body,
  });

  if (!scorecard) {
    return res.status(400).json({ error: 'Scorecard does not exist' });
  }

  res.status(200).json(scorecard);
});
