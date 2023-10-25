const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Friend = require('../models/friendModel');
const requireAuth = require('../middleware/requireAuth');

const createToken = (_id) => jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });

// Passport.js configuration for local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Login user
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const token = createToken(user._id);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.status(200).json({ message: 'Login successful', user, token });
    });
  })(req, res, next);
};

// Signup user

exports.signupUser = [
  body('email')
    .trim()
    .isEmail()
    .escape()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(async (email) => {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        throw new Error('Email already in use');
      }
    }),

  body('username')
    .trim()
    .isLength({ min: 4, max: 14 })
    .withMessage('Username must be between 4 and 14 characters long')
    .escape()
    .withMessage('Please enter a valid username')
    .isAlphanumeric()
    .withMessage('Usernames must only contain letters A-Z or numbers 0-9')
    .custom(async (username) => {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        throw new Error('Username already in use');
      }
    }),

  body('password')
    .trim()
    .escape()
    .isStrongPassword({
      minLength: 8, maxLength: 20, minUppercase: 1, minNumbers: 1, minSymbols: 1,
    })
    .withMessage('Please enter a valid password'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      await user.save();
      res.status(200).json({ user, token });
    }
  }),
];

exports.getFriends = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const { friends } = user;
  res.status(200).json(friends);
});

exports.updateFriends = asyncHandler(async (req, res) => {
  requireAuth(req, res, () => {
    const userId = req.user._id;

    try {
      const newFriend = new Friend({
        name: req.body.name,
        createdBy: userId,
      });

      newFriend.save().then((savedFriend) => {
        const friendId = savedFriend._id;

        User.findOneAndUpdate(
          { _id: userId },
          { $push: { friends: friendId } },
          { new: true },
        ).then((updatedUser) => {
          if (!updatedUser) {
            return res.status(400).json({ error: 'User does not exist' });
          }
          return res.status(200).json(savedFriend);
        });
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});
