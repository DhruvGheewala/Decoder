const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');

const { cpp, node, python, java } = require('compile-run');
const { insertCode, getCode, getAllCodes } = require('../controllers/code.controller');

const dir = './code';
router.post('/compile', (req, res) => {
    const lang = req.body.language;
    const code = req.body.code;
    const stdin = req.body.stdin;
    const fileName = "Decoder";

    let runner = null;
    let filePath = dir + '/';

    if (lang === 'c_cpp') {
        runner = cpp;
        filePath += fileName + '.cpp';
    } else if (lang === 'python') {
        runner = python;
        filePath += fileName + '.py';
    } else if (lang === 'java') {
        runner = java;
        filePath += fileName + '.java';
    } else if (lang === 'javascript') {
        runner = node;
        filePath += fileName + '.js';
    }

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

router.put('/view/:id?', async (req, res) => {
    const id = req.params.id; // value or undefined
    if (id) {
        // One Code, One Author
        const codeData = await getCode(id, req.body.author);
        return res.status(200).send(codeData);
    }

    // All Codes, One Author
    const allData = await getAllCodes(req.body.author);
    res.status(200).send(allData);
});

router.get('/view/:author', async (req, res) => {
    // All Codes, One Author
    const allData = await getAllCodes(req.params.author);
    res.status(200).send(allData);
});

router.post('/save', async (req, res) => {
    const data = req.body;
    const codeData = {
        code: data.code,
        input: data.input,
        output: data.output,
        language: data.language,
        author: data.author,
        visibility: data.visibility
    };

    const result = await insertCode(codeData);
    res.status(200).send(result);
});

module.exports = router;