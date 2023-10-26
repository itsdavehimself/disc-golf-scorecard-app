const express = require('express');

const router = express.Router();

const {
  loginUser, signupUser, getFriends,
} = require('../controllers/userController');

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.get('/friends/:id', getFriends);

module.exports = router;
