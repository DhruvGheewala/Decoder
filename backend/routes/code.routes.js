const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');

const { cpp, node, python, java } = require('compile-run');
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

    // console.log(lang, filePath, stdin, code);

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

router.put('/view/:id?', (req, res) => {
    const id = req.params.id; // value or undefined

});

module.exports = router;