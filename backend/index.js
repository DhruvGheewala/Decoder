require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT;
const mongoose = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// const blogController = require('./controllers/blog');
// const userController = require('./controllers/user');
// const codeController = require('./controllers/code');

// app.use('/blog', blogController);
// app.use('/user', userController);
// app.use('/code', codeController);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, (err) => {
    if (err) {
        console.log('error : connecting to port !!');
    }
    else {
        console.log(`Server started at port : ${PORT}`);
    }
});