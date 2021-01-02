const mongoose = require('mongoose');

module.exports.connectWithDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_PATH, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log(`Connected with Database : ${connection.connection.host}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};