const { Code, validateCode, getCodeModel } = require('../models/code.model');
const { node, python } = require('compile-run');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFileAsync = util.promisify(fs.writeFile);

function errorToJSON(error) {
    let err = {};
    for (const key in error)
        err[key] = error[key];
    console.error(err);
    return errorToJSON(err);
}

// Todo: Not working, will fix it soon !!
async function compress(id) {
    return id;
}

async function insertCode(data) {
    try {
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

const dir = './code';
function generateFilePath(fileName, language) {
    let result = null;
    language = language.toLowerCase();

    if (language === 'c') {
        result = `${dir}/${fileName}.c`;
    } else if (language === 'c++') {
        result = `${dir}/${fileName}.cpp`;
    } else if (language === 'python') {
        result = `${dir}/${fileName}.py`;
    } else if (language === 'java') {
        result = `${dir}/${fileName}.java`;
    } else if (language === 'javascript') {
        result = `${dir}/${fileName}.js`;
    }
    return result;
}

class C {
    runFile = async (path, { stdin }, callback) => {
        // compiling...
        try {
            await exec(`gcc ${path} -o code/c.exe`);
        } catch (err) {
            return errorToJSON(err);
        }

        await writeFileAsync('code/input.txt', stdin);

        // Running...
        const startTime = new Date();
        let result = await exec('cd code && c.exe < input.txt');
        const endTime = new Date();
        const runTime = endTime.getTime() - startTime.getTime();
        result.manualrunTime = runTime;
        return result;
    }
};

class Cpp {
    async runFile(path, { stdin }) {
        // compiling...
        try {
            await exec(`g++ ${path} -o code/cpp.exe`);
        } catch (err) {
            return errorToJSON(err);
        }

        await writeFileAsync('code/input.txt', stdin);

        // Running...
        const startTime = new Date();
        let result = await exec('cd code && cpp.exe < input.txt');
        const endTime = new Date();
        const runTime = endTime.getTime() - startTime.getTime();
        result.manualrunTime = runTime;
        return result;
    }
};

class Java {
    runFile = async (path, { stdin }, callback) => {
        // compiling...
        try {
            await exec(`javac ${path}`);
        } catch (err) {
            return errorToJSON(err);
        }

        writeFileAsync('code/input.txt', stdin);

        // Running...
        const startTime = new Date();
        let result = await exec('cd code && java Decoder < input.txt');
        const endTime = new Date();
        const runTime = endTime.getTime() - startTime.getTime();
        result.manualrunTime = runTime;
        return result;
    }
};

async function runFile(language, code, stdin) {
    language = language.toLowerCase();
    let runner = null;
    if (language === 'c') {
        runner = new C();
    } else if (language === 'c++') {
        runner = new Cpp();
    } else if (language === 'java') {
        runner = new Java();
    } else if (language === 'javascript') {
        runner = node;
    } else if (language === 'python') {
        runner = python;
    }

    if (!runner) return { err: 'Available languages are C, C++, Java, Python & Javascript' };
    const path = generateFilePath('Decoder', language);
    await writeFileAsync(path, code);

    const startTime = new Date();
    const result = await runner.runFile(path, { stdin });
    if (result.err) return result;

    const endTime = new Date();
    const runTime = endTime.getTime() - startTime.getTime();
    if (!result.manualrunTime) result.manualrunTime = runTime;
    return result;
}

module.exports = {
    insertCode,
    getCode,
    getAllPublicCodes,
    runFile,
    generateFilePath,
    updateCode,
    deleteCode
};