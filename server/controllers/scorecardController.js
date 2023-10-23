const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Scorecard = require('../models/scorecardModel');

// Get all scorecard documents
exports.getAllScorecards = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const scorecards = await Scorecard.find({ userId }).sort({ date: -1 });
  res.status(200).json(scorecards);
});

// Get all scorecards from specific user
exports.getUsersScorecards = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Scorecard does not exist' });
  }

  const scorecards = await Scorecard.find({ 'players.reference': id });

  if (!scorecards) {
    return res.status(404).json({ error: 'Scorecard does not exist' });
  }

  res.status(200).json({ scorecards });
});

// Create new scorecard
exports.createScorecard = asyncHandler(async (req, res) => {
  const {
    course, date, startTime, endTime, notes, players,
  } = req.body;

  try {
    const userId = req.user._id;
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
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Scorecard does not exist' });
  }

  const scorecard = await Scorecard.find({ $and: [{ userId }, { _id: id }] });

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
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Scorecard does not exist' });
  }

  const updatePromises = req.body.players.map(async (updatedPlayer) => {
    const { reference, scores } = updatedPlayer;

    const scorecard = await Scorecard.findOneAndUpdate(
      { $and: [{ userId }, { _id: id }] },
      {
        $set: {
          'players.$[player].scores': scores,
        },
      },
      {
        arrayFilters: [
          {
            'player.reference': reference,
          },
        ],
        new: true,
      },
    );

    if (!scorecard) {
      return Promise.reject(new Error('Scorecard does not exist'));
    }

    return scorecard;
  });

  try {
    const updatedScorecards = await Promise.all(updatePromises);
    res.status(200).json({ message: 'Scorecards updated successfully', updatedScorecards });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update scorecards' });
  }
});
