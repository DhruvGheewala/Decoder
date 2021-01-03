const { Code, validateCode, getCodeModel } = require('../models/code.model');
const { cpp, node, python, java } = require('compile-run');

function errorToJSON(error) {
    let err = {};
    for (const key in error)
        err[key] = error[key];
    console.error(err);
    return { err };
}

// Todo: Not working, will fix it soon !!
async function compress(id) {
    return id;
}

async function insertCode(data) {
    try {
        console.log(data);

        const _code = getCodeModel(data);

        const isValid = validateCode(_code);
        console.log('isValid', isValid);

        const result = await _code.save();
        result.id = await compress(result._id);
        return await result.save();
    } catch (err) {
        return errorToJSON(err);
    }
}

async function updateCode(id, data) {
    try {
        if (!data) return null;

        const code = getCodeModel(data);
        if (code.id) return { err: 'Bad request' };

        const _code = await Code.findById(id);
        if (!_code) return null;


        for (const key in data) _code[key] = code[key] || _code[key];
        return await _code.save();
    } catch (err) {
        return errorToJSON(err);
    }
}

async function getCode(id, currentUser) {
    try {
        let codeData = await Code.find({ id });
        if (!codeData.length) return null;
        codeData = codeData[0];
        if (codeData.visibility === 'public') return codeData;
        return codeData.author === currentUser ? codeData : null;
    } catch (err) {
        return errorToJSON(err);
    }
}

async function deleteCode(id) {
    try {
        return await Code.deleteOne({ id });
    } catch (err) {
        return errorToJSON(err);
    }
}

async function getAllPublicCodes(currentUser) {
    if (currentUser) return await Code.find({ author: currentUser, visibility: 'public' });
    return await Code.find({ visibility: 'public' });
}

function getRunner(lang) {
    let runner = null;
    if (lang === 'c' || lang === 'cpp') {
        runner = cpp;
    } else if (lang === 'python') {
        runner = python;
    } else if (lang === 'java') {
        runner = java;
    } else if (lang === 'javascript') {
        runner = node;
    }
    return runner;
}

const dir = './code';
function generateFilePath(fileName, lang) {
    let result = null;
    if (lang === 'c') {
        result = `${dir}/${fileName}.c`;
    } else if (lang === 'cpp') {
        result = `${dir}/${fileName}.cpp`;
    } else if (lang === 'python') {
        result = `${dir}/${fileName}.py`;
    } else if (lang === 'java') {
        result = `${dir}/${fileName}.java`;
    } else if (lang === 'javascript') {
        result = `${dir}/${fileName}.js`;
    }
    return result;
}

function getCodeData(data) {
    return {
        code: data.code,
        input: data.input,
        output: data.output,
        language: data.language,
        author: data.author,
        visibility: data.visibility ? data.visibility.toLowerCase() : 'public'
    };
}

module.exports = {
    insertCode,
    getCode,
    getAllPublicCodes,
    getRunner,
    generateFilePath,
    getCodeData,
    updateCode,
    deleteCode
};