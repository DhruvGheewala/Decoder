const mongoose = require('mongoose');
const Joi = require('joi');

const codeSchema = new mongoose.Schema({
    id: {
        type: String
    },
    code: {
        type: String,
        required: true
    },
    input: {
        type: String,
        default: ''
    },
    output: {
        type: String,
        default: ''
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

const codeValidationSchema = Joi.object({
    code: Joi.string().required(),
    author: Joi.string().min(3).max(20).required(),
    language: Joi.string().required(),
    visibility: Joi.string().lowercase().valid('public', 'private')
});

const Code = mongoose.model('Code', codeSchema);

function getCodeModel(codeData) {
    return new Code({
        code: codeData.code,
        input: codeData.input,
        output: codeData.output,
        language: codeData.language,
        author: codeData.author,
        visibility: codeData.visibility,
    });
}

function validateCode(code) { return codeValidationSchema.validate(code); }

module.exports = {
    Code,
    validateCode,
    getCodeModel
};