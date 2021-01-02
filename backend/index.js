require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const mongoose = require('./db');

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Routes
const codeRoute = require('./routes/code.routes');
app.use('/api/code', codeRoute);

app.listen(PORT, (err) => {
    if (err) return console.error(`error : connecting to port !!, ${JSON.stringify(err, undefined, 2)}`);
    console.log(`Server is running on Port: ${PORT}`);
});