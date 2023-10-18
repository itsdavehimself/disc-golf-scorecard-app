const express = require('express');

const router = express.Router();

const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

const {
  loginUser, signupUser, getFriends, updateFriends,
} = require('../controllers/userController');

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.get('/friends/:id', getFriends);

router.patch('/friends', updateFriends);

module.exports = router;
