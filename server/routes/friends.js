const express = require('express');

const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

const { getAllFriends, getFriend } = require('../controllers/friendController');

router.get('/', getAllFriends);

router.get('/:id', getFriend);

module.exports = router;
