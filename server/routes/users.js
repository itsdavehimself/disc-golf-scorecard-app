const express = require('express');

const router = express.Router();

const {
  loginUser, signupUser, getFriends, updateFriends,
} = require('../controllers/userController');

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.get('/friends/:id', getFriends);

router.patch('/friends/:id', updateFriends);

module.exports = router;
