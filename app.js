const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config();

const authRouter = require('./routes/auth/index');
const apiRouter = require('./routes/api/index');

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello HNG11!')
  })

app.use('/api', apiRouter);
app.use('/auth', authRouter)

module.exports = app;