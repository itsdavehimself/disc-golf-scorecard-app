const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const usersRoutes = require('./routes/users');
const scorecardRoutes = require('./routes/scorecards');
const courseRoutes = require('./routes/courses');
const friendRoutes = require('./routes/friends');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('DB Connection Error', err));

app.use(
  cors({
    origin: process.env.ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/users', usersRoutes);

app.use('/api/scorecards', scorecardRoutes);

app.use('/api/courses', courseRoutes);

app.use('/api/friends', friendRoutes);

const port = process.env.PORT;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening at http://0.0.0.0:${port}`);
});
