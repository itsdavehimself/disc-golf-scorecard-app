const express = require('express');

const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

const {
  getAllFriends,
  getFriend,
  deleteFriendScorecard,
  deleteFriend,
  addFriend,
  updateFriend,
} = require('../controllers/friendController');

router.get('/', getAllFriends);

router.get('/:id', getFriend);

router.post('/', addFriend);

router.put('/:id', updateFriend);

router.delete('/:friendId/scorecard/:scorecardId', deleteFriendScorecard);

router.delete('/:id', deleteFriend);

module.exports = router;
