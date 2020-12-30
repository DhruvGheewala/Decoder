const mongoose = require('mongoose');

mongoose.connect(process.env.DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => console.log(`Database successfully connected, Path: ${process.env.DB_PATH}`))
    .catch((err) => console.log(`Error in Database Connection: ${JSON.stringify(err, undefined, 2)}`));

module.exports = mongoose;