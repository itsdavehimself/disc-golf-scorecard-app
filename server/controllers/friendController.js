const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Friend = require('../models/friendModel');

exports.getAllFriends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const friends = await Friend.find({ createdBy: userId }).sort({ 'scorecards.length': -1 });
  res.status(200).json(friends);
});

exports.getFriend = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  const friend = await Friend.findById(id);

  if (!friend) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  res.status(200).json({ friend });
});

exports.addFriend = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const newFriend = new Friend({
    name: req.body.name,
    createdBy: userId,
  });

  if (!newFriend) {
    return res.status(400).json({ error: 'Error creating new friend' });
  }

  if (newFriend) {
    newFriend.save();
  }

  return res.status(200).json(newFriend);
});

exports.updateFriendScorecards = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { scorecards } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  const friend = await Friend.findOneAndUpdate(
    { _id: id },
    { $push: { scorecards: { $each: scorecards } } },
  );

  if (!friend) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }
  res.status(200).json({ friend });
});

exports.deleteFriendScorecard = asyncHandler(async (req, res) => {
  const { friendId, scorecardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(friendId) || !mongoose.Types.ObjectId.isValid(scorecardId)) {
    return res.status(404).json({ error: 'Friend or Scorecard does not exist' });
  }

  const friend = await Friend.findById(friendId);

  if (!friend) {
    return;
  }

  try {
    const updatedFriend = await Friend.findByIdAndUpdate(
      friendId,
      { $pull: { scorecards: scorecardId } },
      { new: true },
    );

    if (!updatedFriend) {
      return res.status(400).json({ error: 'Friend or Scorecard does not exist' });
    }

    res.status(200).json(updatedFriend);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

exports.deleteFriend = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  const friend = await Friend.findOneAndDelete({ _id: id });

  if (!friend) {
    return res.status(404).json({ error: 'Friend does not exist' });
  }

  res.status(200).json({ friend });
});
