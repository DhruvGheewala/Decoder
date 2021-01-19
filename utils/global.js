const util = require('util');

const child_process = require('child_process');
const exec = util.promisify(child_process.exec);

const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const errorToJSON = (error) => {
    let err = {};
    for (const key in error)
        err[key] = error[key];
    console.error(err);
    return { err };
}

const importAll = () => {
    return {
        moduleObj: null,
        from(moduleName) {
            this.moduleObj = require(moduleName);
            Object.keys(this.moduleObj)
                .forEach(key => global[key] = this.moduleObj[key]);
        }
    }
}

module.exports = {
    exec,
    errorToJSON,
    importAll,
    fs: {
        readFileAsync,
        writeFileAsync
    }
}