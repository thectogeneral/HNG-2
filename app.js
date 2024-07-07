const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config();

const authRouter = require('./routes/auth/index');
const apiRouter = require('./routes/api/index');

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api', apiRouter);
app.use('/auth', authRouter)

const PORT = process.env.PORT || 3000;


module.exports = app;