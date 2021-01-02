const { Code, validateCode } = require('../models/code.model');

// Todo: Not working, will fix it soon !!
async function compress(id) {
    return id;
}

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

        // Todo: Not working, will fix it soon !!
        // const isValid = validateCode(_code);
        const result = await _code.save();
        result.id = await compress(result._id);
        return await result.save();
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function getCode(id, author) {
    let codeData = await Code.find({ id });
    codeData = codeData[0];
    if (!codeData) return codeData;
    if (codeData.visibility.toLowerCase() === 'public') return codeData;
    return codeData.author === author ? codeData : null;
}
async function getAllCodes(author) { return await Code.find({ author: author }); }

module.exports = { insertCode, getCode, getAllCodes };