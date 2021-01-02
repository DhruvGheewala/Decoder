const mongoose = require('mongoose');
const Joi = require('joi');

const codeSchema = new mongoose.Schema({
    code: String,
    input: { type: String, default: '' },
    output: { type: String, default: '' },
    language: String,
    author: String,
    visibility: String,
    timePublished: { type: Date, default: Date.now }
});

const Code = mongoose.model('Code', codeSchema);

function validateCode(code) {
    const schema = {
        code: Joi.string().required(),
        author: Joi.string().min(2).max(10).required(),
        visibility: Joi.string().required().lowercase().valid('public', 'private')
    }
    return Joi.valid(code, schema);
}

exports.Code = Code;
exports.validateCode = validateCode;