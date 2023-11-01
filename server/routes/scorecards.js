const express = require('express');
const {
  createScorecard,
  getAllScorecards,
  getScorecard,
  deleteScorecard,
  updateScorecard,
  getUsersScorecards,
  updateFriendsNames,
} = require('../controllers/scorecardController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// Get all scorecard documents
router.get('/', getAllScorecards);

// Get all scorecards from specific user ID
router.get('/user/:id', getUsersScorecards);

// Create new scorecard document
router.post('/', createScorecard);

// Get a single scorecard
router.get('/:id', getScorecard);

// Delete a single scorecard
router.delete('/:id', deleteScorecard);

// Update a single scorecard
router.patch('/:id', updateScorecard);

// Update many scorecards with a friend's new name
router.patch('/', updateFriendsNames);

module.exports = router;
