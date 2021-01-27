require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const { connectWithDatabase } = require("./db");

const app = express();
connectWithDatabase().then(() => {
    app.listen(PORT, () =>
        console.log(`Server is running at PORT : ${PORT}`)
    );
});

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Routes
const codeRoute = require('./routes/code.routes');
const authRoute = require('./routes/user.routes');
app.use('/api/code', codeRoute);
app.use('/auth', authRoute);
app.use('/', (_req, res) => res.send('Backend is active !!'));
