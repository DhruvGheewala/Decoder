const mongoose = require('mongoose');
const Joi = require('joi');

const codeSchema = new mongoose.Schema({
    id: String,
    author: String,
    content: String,
    language: String,
    parent: { type: String, default: null },
    title: { type: String, default: 'undefined' },
    stdin: { type: String, default: '' },
    stdout: { type: String, default: '' },
    stderr: { type: String, default: '' },
    visibility: { type: String, default: 'public' },
    time: { type: Date, default: Date.now }
}, {
    collection: 'codes'
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

const codeValidationSchema = Joi.object({
    author: Joi.string().min(3).max(20).required(),
    content: Joi.string().required(),
    language: Joi.string().required(),
    visibility: Joi.string().lowercase().valid('public', 'private')
});

function validateCode(code) { return codeValidationSchema.validate(code); }

module.exports = {
    Code,
    validateCode,
    getCodeModel
};