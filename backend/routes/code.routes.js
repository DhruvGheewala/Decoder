const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');

const {
    insertCode,
    getCode,
    getAllCodes,
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

    if (!runner) {
        return res.status(400).send({
            type: 'Bad Request',
            status: 400,
            message: 'Supported languages: C/C++, Python & Java'
        });
    }

    fs.writeFile(filePath, code, () => {
        const startTime = new Date();
        runner.runFile(filePath, { stdin: stdin }, (err, result) => {
            const endTime = new Date();
            const compileTime = endTime.getTime() - startTime.getTime();

            if (err) return res.status(500).send({
                type: 'Internal Server Error',
                status: 500,
                message: err
            });

            result.manualCompilationTime = compileTime;
            res.send(result);
        });
    });
});

// Todo: error handeling

router.put('/view/:id?', async (req, res) => {
    const id = req.params.id; // value or undefined

    // reading code
    if (id) {
        // One Code, One Author
        const codeData = await getCode(id, req.body.author);
        return res.status(200).send(codeData);
    }

    // All Codes, One Author
    const allData = await getAllCodes(req.body.author);
    res.status(200).send(allData);
});

router.put('/update/:id', async (req, res) => {
    const codeData = getCodeData(req.body);
    const result = await updateCode(req.params.id, codeData);
    res.status(200).send(result);
});

router.get('/view/:author', async (req, res) => {
    // All Codes, One Author
    const allData = await getAllCodes(req.params.author);
    res.status(200).send(allData);
});

router.delete('/:id', async (req, res) => {
    const result = await deleteCode(req.params.id);
    res.status(200).send(result);
})

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