const mongoose = require('mongoose');
const Joi = require('joi');

const folderSchema = new mongoose.Schema({
    id: String,
    author: String,
    codes: [String],
    folders: [String],
    parent: { type: String, default: null },
    title: { type: String, default: 'new folder' },
    visibility: { type: String, default: 'public' },
    time: { type: Date, default: Date.now }
}, {
    collection: 'folders'
});

const Folder = mongoose.model('Folder', folderSchema);
function getFolderModel(folderData) {
    return new Folder({
        code: folderData.code,
        input: folderData.input,
        output: folderData.output,
        language: folderData.language,
        author: folderData.author,
        visibility: folderData.visibility,
    });
}

const folderValidationSchema = Joi.object({
    author: Joi.string().min(3).max(20).required(),
    visibility: Joi.string().lowercase().valid('public', 'private')
});

function validateFolder(folder) { return folderValidationSchema.validate(folder); }

module.exports = {
    Folder,
    validateFolder,
    getFolderModel
};