const Joi = require('joi');
const { Code, validateCode } = require('../models/code.model');

async function insertCode(data) {
    try {
        const _code = new Code({
            code: data.code,
            input: data.input,
            output: data.output,
            language: data.language,
            author: data.author,
            visibility: data.visibility,
        });

        const isValid = validateCode(_code);
        console.log(isValid);
        if (isValid) await _code.save();
    } catch (err) {
        console.error(err);
    }
}

async function getCode(id, author) {
    const code = await Code.find();
    return code;
}

async function getAllCodes(author) {

}

module.exports = { insertCode, getCode, getAllCodes };