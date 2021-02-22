// *route: /api/code/...
const express = require('express');
const router = express.Router();

const _ = require('lodash');
const sendResponse = require('../utils/sendResponse');
const controller = require('../controllers/code.controller');
const { fs } = require('../utils/global');


// *Complete
router.post('/compile', async (req, res) => {
    let { language, content, stdin } = req.body;
    stdin = stdin ? stdin : '';
    content = content ? content : '';
    const result = await controller.runFile({ language, code: content, stdin });
    if (!result) return sendResponse('Bad Request', res);
    if (result.err) return sendResponse(result.err, res, 404);
    sendResponse(result, res);
});

/**
 * *Complete
 * Todo: send request to save code in user Database too !!
 */
router.post('/save', async (req, res) => {
    const codeData = _.pick(req.body, ['content', 'stdin', 'stdout', 'language', 'author', 'visibility', 'title', 'stderr']);
    const result = await controller.insertCode(codeData);
    if (!result) return sendResponse('Bad Request', res, 400);
    if (result.err) return sendResponse(result.err, res, 500);
    sendResponse(result, res);
});

// *Complete
router.get('/defaults/:language', async (req, res) => {
    const { language } = req.params;
    const path = controller.generateFilePath('template', language);
    if (!path) return sendResponse('Bad Request', res, 400);

    try {
        const data = await fs.readFileAsync(path, { encoding: 'utf-8' });
        return sendResponse({ language, content: data }, res);
    } catch (err) {
        return sendResponse('Bad Request', res, 400);
    }
});

// *Complete
const languages = ['C', 'C++', 'Python', 'Java', 'Javascript'];
router.get('/defaults', async (_req, res) => {
    let array = [];
    let result = {};

    for (const language of languages) {
        const path = controller.generateFilePath('template', language);
        try {
            const data = await fs.readFileAsync(path, { encoding: 'utf-8' });
            array.push({ language, content: data });
        } catch (err) {
            return sendResponse('Bad Request', res, 400);
        }
    }
    array.forEach(element => result[element.language] = element.content);
    return sendResponse(result, res);
});

// *Complete
router.get('/all', async (_req, res) => {
    const result = await controller.getAllPublicCodes();
    sendResponse(result, res);
});

// *Complete
router.get('/view/:currentUser', async (req, res) => {
    const { currentUser } = req.params;
    const allData = await controller.getAllPublicCodes(currentUser);
    if (!allData) return sendResponse('User not found, Please try again', res, 404);
    sendResponse(allData, res);
});

/**
 * Todo: authenticate jwt token
 * !Private codes will be send back only iff code[id].author === currentUser
 * *Complete
 */
router.get('/view/:currentUser/:id', async (req, res) => {
    const { id, currentUser } = req.params;
    console.log(id, currentUser);
    const codeData = await controller.getCode(id, currentUser);
    if (!codeData) return sendResponse('Code not found, Please try again', res, 404);
    if (codeData.err) return sendResponse(codeData.err, res, 500);
    return sendResponse(codeData, res);
});

// *Complete
router.put('/update/:id', async (req, res) => {
    const codeData = _.pick(req.body, ['content', 'input', 'output', 'language', 'author', 'visibility']);
    const result = await controller.updateCode(req.params.id, codeData);
    if (!result) return sendResponse('Invalid id, Please try again', res, 404);
    if (result.err) return sendResponse(result.err, res, 400);
    sendResponse(result, res);
});

/**
 * *Complete
 * *will not return an error on no deletion
 */
router.delete('/delete/:id', async (req, res) => {
    const result = await controller.deleteCode(req.params.id);
    sendResponse(result, res);
});

module.exports = router;