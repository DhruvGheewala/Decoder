const mongoose = require('mongoose');
const Joi = require('joi');

const codeSchema = new mongoose.Schema({
    id: {
        type: String,
        // required: true
    },
    code: {
        type: String,
        required: true
    },
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        default: 'public',
    },
    timePublished: {
        type: Date,
        default: Date.now
    }
});

const Code = mongoose.model('Code', codeSchema);

// Todo: Not working, will fix it soon !!

function validateCode(code) {
    const schema = {
        code: Joi.string().required(),
        author: Joi.string().min(2).max(10).required(),
        visibility: Joi.string().required().lowercase().valid('public', 'private')
    }
    return Joi.valid(code, schema);
}

module.exports = { Code, validateCode };