const { Code, validateCode, CodeModel } = require('../models/code.model');
const { c, cpp, java, node, python } = require('../utils/compile-run');
const { errorToJSON, fs } = require('../utils/global');

// Todo: Not working, will fix it soon !!
async function compress(id) { return id; }

// Todo: handle various errors
async function insertCode(data) {
    try {
        const code = new CodeModel(data);
        const isValid = validateCode(code);
        // Todo => validation
        //// console.log('isValid', isValid);
        const result = await code.save();
        result.id = await compress(result._id);
        return await result.save();
    } catch (err) {
        return errorToJSON(err);
    }
}

//* Complete
async function getCode(id, currentUser) {
    try {
        const code = await Code.findOne({ id });
        if (!code) return null;
        if (code.visibility === 'public') return code;
        return code.author === currentUser ? code : null;
    } catch (err) {
        return errorToJSON(err);
    }
}

// Todo: validation
async function updateCode(id, data) {
    try {
        if (!data || data.id) return null;
        const code = await Code.findOne({ id });
        if (!code) return null;
        const _code = new CodeModel(data);
        for (const key in data) code[key] = _code[key] || code[key];
        return await code.save();
    } catch (err) {
        return errorToJSON(err);
    }
}

//* Complete
async function deleteCode(id) {
    try {
        return await Code.deleteOne({ id });
    } catch (err) {
        return errorToJSON(err);
    }
}

//* Complete
async function getAllPublicCodes(currentUser) {
    if (currentUser) return await Code.find({ author: currentUser, visibility: 'public' });
    return await Code.find({ visibility: 'public' });
}

//* Complete
const dir = './code';
function generateFilePath(fileName, language) {
    let result = null;
    language = language.toLowerCase();

    if (language === 'c') {
        result = `${dir}/${fileName}.c`;
    } else if (language === 'c++' || language === 'cpp') {
        result = `${dir}/${fileName}.cpp`;
    } else if (language === 'python' || language === 'py') {
        result = `${dir}/${fileName}.py`;
    } else if (language === 'java') {
        result = `${dir}/${fileName}.java`;
    } else if (language === 'javascript' || language === 'js') {
        result = `${dir}/${fileName}.js`;
    }
    return result;
}

//* Complete
async function runFile({ language, code, stdin }) {
    let runner = null;
    language = language.toLowerCase();
    if (language === 'c') {
        runner = c;
    } else if (language === 'c++' || language === 'cpp') {
        runner = cpp;
    } else if (language === 'java') {
        runner = java;
    } else if (language === 'javascript' || language === 'js') {
        runner = node;
    } else if (language === 'python' || language === 'py') {
        runner = python;
    }

    if (!runner) return null;
    const path = generateFilePath('Decoder', language);
    await fs.writeFileAsync(path, code);

    const startTime = new Date();
    const result = await runner.runFile(path, { stdin });
    const endTime = new Date();

    if (!result || result.err) return result;
    const runTime = endTime.getTime() - startTime.getTime();
    if (!result.manualrunTime) result.manualrunTime = runTime;
    return result;
}

module.exports = {
    insertCode,
    getCode,
    updateCode,
    deleteCode,
    getAllPublicCodes,
    generateFilePath,
    runFile,
};