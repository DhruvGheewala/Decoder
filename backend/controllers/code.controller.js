const { Code, validateCode, getCodeModel } = require('../models/code.model');
const { cpp, node, python, java } = require('compile-run');

// Todo: Not working, will fix it soon !!
async function compress(id) {
    return id;
}

async function insertCode(data) {
    try {
        const _code = getCodeModel(data);
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

async function updateCode(id, data) {
    try {
        const code = getCodeModel(data);
        const _code = await Code.findById(id);
        for (const key in data) {
            _code[key] = code[key] || _code[key];
        }
        console.log(_code);
        return await _code.save();
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function getCode(id, author) {
    try {
        let codeData = await Code.find({ id });
        codeData = codeData[0];
        if (!codeData) return codeData;
        if (codeData.visibility.toLowerCase() === 'public') return codeData;
        return codeData.author === author ? codeData : null;
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function deleteCode(id) {
    try {
        return await Code.deleteOne({ id });
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function getAllCodes(author) { return await Code.find({ author: author }); }
async function getAllPublicCodes() { return await Code.find({ visibility: 'public' }); }

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
        visibility: data.visibility
    };
}

module.exports = {
    insertCode,
    getCode,
    getAllCodes,
    getAllPublicCodes,
    getRunner,
    generateFilePath,
    getCodeData,
    updateCode,
    deleteCode
};