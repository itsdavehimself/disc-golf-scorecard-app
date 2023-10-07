const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB CONNECTED')).catch((err) => console.log('DB Connection Error', err));

app.use(cors({ origin: true, credentials: true }));

const testRoutes = require('./routes/test');

app.use('/', testRoutes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on ${port}`));
