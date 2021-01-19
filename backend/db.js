const mongoose = require('mongoose');
const DB_PATH = `mongodb+srv://Decoder:${process.env.DB_PASS}@decodercluster.eyv5r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;  //* Url for node
// const DB_PATH = `mongodb+srv://Decoder:${process.env.DB_PASS}@decodercluster.eyv5r.mongodb.net/test`;  //* Url For Compass
// console.log('DB Path: ', DB_PATH);

module.exports.connectWithDatabase = async () => {
    try {
        const connection = await mongoose.connect(DB_PATH, {
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