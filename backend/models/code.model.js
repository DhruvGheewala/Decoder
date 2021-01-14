const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');

const codeSchema = new mongoose.Schema({
    id: String,
    author: String,
    content: String,
    language: String,
    parent: String,
    title: String,
    stdin: String,
    stdout: String,
    stderr: String,
    visibility: String,
    time: { type: Date, default: Date.now }
}, {
    collection: 'codes'
});

const Code = mongoose.model('Code', codeSchema);
// Todo: fix codeData.content || codeData.code, etc...
function CodeModel(codeData) {
    return Code({
        author: codeData.author,
        content: codeData.content || codeData.code,
        language: codeData.language || codeData.lang,
        parent: codeData.parent || null,
        title: codeData.title || 'undefined',
        stdin: codeData.stdin || codeData.input || '',
        stdout: codeData.stdout || codeData.output || '',
        stderr: codeData.stderr || codeData.error || '',
        visibility: codeData.visibility ? codeData.visibility.toLowerCase() : 'public',
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
    CodeModel
};