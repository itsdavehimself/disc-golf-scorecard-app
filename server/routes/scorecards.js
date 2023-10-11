const express = require('express');
const {
  createScorecard, getAllScorecards, getScorecard, deleteScorecard, updateScorecard,
} = require('../controllers/scorecardController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// Get all scorecard documents
router.get('/', getAllScorecards);

// Create new scorecard document
router.post('/', createScorecard);

// Get a single scorecard
router.get('/:id', getScorecard);

// Delete a single scorecard
router.delete('/:id', deleteScorecard);

// Update a single scorecard
router.patch('/:id', updateScorecard);

module.exports = router;
