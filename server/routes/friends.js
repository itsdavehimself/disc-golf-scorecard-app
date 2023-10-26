const express = require('express');

const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

const {
  getAllFriends, getFriend, updateFriendScorecards, deleteFriendScorecard, deleteFriend, addFriend,
} = require('../controllers/friendController');

router.get('/', getAllFriends);

router.get('/:id', getFriend);

router.post('/', addFriend);

router.put('/:id', updateFriendScorecards);

router.delete('/:friendId/scorecard/:scorecardId', deleteFriendScorecard);

router.delete('/:id', deleteFriend);

module.exports = router;
