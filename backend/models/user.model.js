const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    method:{
        type: String,
        required: true
    },
    googleId: {
        type: String,
        default: ''
    },
    mailToken: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    myblogs: {
        type : [{id: String}],
        default : []
    },
    mycodes: {
        type : [{id: String}],
        default : []
    },
    myaccouts: {
        type: [{url: String, profile: String}],
        default: []
    },
    settings: {
        mode: String,
        theme: String,
        code: String
    }
}, {
    collection: 'users'
})

userSchema.plugin(uniqueValidator, { message: 'Email already in use.' });
module.exports = mongoose.model('User', userSchema)