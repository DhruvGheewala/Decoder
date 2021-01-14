const express = require('express');
const router = express.Router();

const _ = require('lodash');
const fs = require('fs');
const sendResponse = require('../utils/sendResponse');

const {
    runFile,
    generateFilePath,
    insertCode,
    getCode,
    updateCode,
    deleteCode,
    getAllPublicCodes
} = require('../controllers/code.controller');

// /api/code
router.post('/compile', async (req, res) => {
    let { language, code, stdin } = _.pick(req.body, ['language', 'code', 'stdin']);
    stdin = stdin ?? '';
    code = code ?? '';

    const result = await runFile(language, code, stdin);
    console.log('sadasdadad');
    if (result.err) return sendResponse(result.err, res, 404);
    sendResponse(result, res);
});

// Private codes will be send back only iff code[id].author === currentUser
router.get('/view/:currentUser/:id?', async (req, res) => {
    const id = req.params.id;
    const currentUser = req.params.currentUser;

    if (id) {
        const codeData = await getCode(id, currentUser);
        if (!codeData)
            return sendResponse('Code not found or Bad request, Please try again', res, 404);
        if (codeData.err)
            return sendResponse(codeData.err, res, 400);
        return sendResponse(codeData, res);
    }

    const allData = await getAllPublicCodes(currentUser);
    if (!allData)
        return sendResponse('Code not found or Bad request, Please try again', res, 404);
    sendResponse(allData, res);
});

router.put('/update/:id', async (req, res) => {
    const codeData = _.pick(req.body, ['code', 'input', 'output', 'language', 'author', 'visibility']);
    const result = await updateCode(req.params.id, codeData);
    if (!result)
        return sendResponse('Code not found or Bad request, Please try again', res, 404);
    if (result.err)
        return sendResponse(result.err, res, 400);
    sendResponse(result, res);
});

router.delete('/delete/:id', async (req, res) => {
    const result = await deleteCode(req.params.id);
    sendResponse(result, res);
});

// Todo: error handeling

router.post('/save', async (req, res) => {
    const codeData = _.pick(req.body, ['code', 'input', 'output', 'language', 'author', 'visibility']);
    const result = await insertCode(codeData);
    sendResponse(result, res);
});

router.get('/all', async (req, res) => {
    const result = await getAllPublicCodes();
    sendResponse(result, res);
});

const languages = ['C', 'C++', 'Python', 'Java', 'Javascript'];
router.get('/defaults/:language?', async (req, res) => {
    const language = req.params.language;
    if (language) {
        const path = generateFilePath('template', language);
        if (path === null)
            return sendResponse('Supported languages: C, C++, Python, Java & Javascript', res, 400);

        fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
            if (err) return sendResponse(err, res, 404);
            return sendResponse({ language, code: data }, res);
        });
    } else {
        let array = [];
        let result = {};
        languages.forEach(language => {
            const path = generateFilePath('template', language);
            fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
                if (err) return sendResponse(err, res, 404);
                array.push({ language, code: data });
                if (array.length === languages.length) {
                    array.forEach(element => result[element.language] = element.code);
                    return sendResponse(result, res);
                }
            });
        });
    }
});

module.exports = router;