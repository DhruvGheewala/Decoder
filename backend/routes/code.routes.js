const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');
const sendResponse = require('../utils/sendResponse');

const {
    insertCode,
    getCode,
    getAllPublicCodes,
    getRunner,
    generateFilePath,
    getCodeData,
    updateCode,
    deleteCode
} = require('../controllers/code.controller');

router.post('/compile', (req, res) => {
    const lang = req.body.language;
    const code = req.body.code;
    const stdin = req.body.stdin;

    const runner = getRunner(lang);
    const filePath = generateFilePath('Decoder', lang);

    if (!runner)
        return sendResponse('Supported languages: C/C++, Python & Java', res, 400);

    fs.writeFile(filePath, code, () => {
        const startTime = new Date();
        runner.runFile(filePath, { stdin: stdin }, (err, result) => {
            const endTime = new Date();
            const compileTime = endTime.getTime() - startTime.getTime();
            if (err) return sendResponse(err, res, 500);
            result.manualCompilationTime = compileTime;
            sendResponse(result, res);
        });
    });
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
    const codeData = getCodeData(req.body);
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
    const codeData = getCodeData(req.body);
    const result = await insertCode(codeData);
    res.status(200).send(result);
});

router.get('/all', async (req, res) => {
    const result = await getAllPublicCodes();
    res.status(200).send(result);
});

const languages = ['c', 'cpp', 'python', 'java', 'javascript'];
router.get('/defaults/:language?', async (req, res) => {
    const language = req.params.language;
    if (language) {
        const path = generateFilePath('template', language);
        if (path === null) return res.status(400).send({
            type: 'Bad Request',
            status: 400,
            message: 'Supported languages: C/C++, Python & Java'
        });

        fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
            if (err) return res.status(404).send(err);
            return res.status(200).send({ language, code: data });
        });
    } else {
        let result = [];
        languages.forEach(language => {
            console.log(language);
            const path = generateFilePath('template', language);
            fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
                if (err) return res.status(404).send(err);
                result.push({ language, code: data });
                if (result.length === languages.length)
                    return res.status(200).send(result);
            });
        });
    }
});

module.exports = router;