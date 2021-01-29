const os = require('os');
const { fs, errorToJSON, exec } = require('../utils/global');
const { c, node, python } = require('compile-run');

const osCompile = {
    'exe': ['windows_nt'],
    'out': ['darwin', 'linux']
};

class C {
    runFile = async (path, { stdin }) => {
        const osType = os.type().toLowerCase();

        // compiling...
        try {
            if (osCompile.exe.indexOf(osType) >= 0) await exec(`gcc ${path} -o assets/code/c.exe`);
            else if (osCompile.out.indexOf(osType) >= 0) await exec(`gcc ${path} -o assets/code/c.out`);
        } catch (err) {
            return errorToJSON(err);
        }

        // Writing stdin into input file
        await fs.writeFileAsync('assets/code/input.txt', stdin);

        // Running...
        let result = null;

        const startTime = new Date();
        if (osCompile.exe.indexOf(osType) >= 0) result = await exec('cd assets/code && c.exe < input.txt');
        else if (osCompile.out.indexOf(osType) >= 0) result = await exec('cd assets/code && ./c.out < input.txt');
        const endTime = new Date();

        const runTime = endTime.getTime() - startTime.getTime();
        result.manualrunTime = runTime;
        return result;
    }
};

class Cpp {
    async runFile(path, { stdin }) {
        const osType = os.type().toLowerCase();

        // compiling...
        try {
            if (osCompile.exe.indexOf(osType) >= 0) await exec(`g++ ${path} -o assets/code/cpp.exe`);
            else if (osCompile.out.indexOf(osType) >= 0) await exec(`g++ ${path} -o assets/code/cpp.out`);
        } catch (err) {
            return errorToJSON(err);
        }

        // Writing stdin into input file
        await fs.writeFileAsync('assets/code/input.txt', stdin);

        // Running...
        let result = null;

        const startTime = new Date();
        if (osCompile.exe.indexOf(osType) >= 0) result = await exec('cd assets/code && cpp.exe < input.txt');
        else if (osCompile.out.indexOf(osType) >= 0) result = await exec('cd assets/code && ./cpp.out < input.txt');
        const endTime = new Date();

        const runTime = endTime.getTime() - startTime.getTime();
        result.manualrunTime = runTime;
        return result;
    }
};

class Java {
    runFile = async (path, { stdin }) => {
        // compiling...
        try {
            await exec(`javac ${path}`);
        } catch (err) {
            return errorToJSON(err);
        }

        // Writing stdin into input file
        await fs.writeFileAsync('assets/code/input.txt', stdin);

        // Running...
        const startTime = new Date();
        let result = await exec('cd assets/code && java Decoder < input.txt');
        const endTime = new Date();

        const runTime = endTime.getTime() - startTime.getTime();
        result.manualrunTime = runTime;
        return result;
    }
};

// const axios = require('axios').default;

var request = require('request');
class CppApi {
    runFile = async (path, { stdin }) => {
        // compiling...
        try {
            const code = await fs.readFileAsync(path, { encoding: 'utf-8' });
            const program = {
                script: code,
                language: "cpp14",
                versionIndex: "0",
                clientId: process.env.compileClient,
                clientSecret: process.env.compileClientSecret
            };

            request({
                url: 'https://api.jdoodle.com/v1/execute',
                method: "POST",
                json: program
            }, (error, response, body) => {
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                console.log('body:', body);
            });
        } catch (err) {
            return errorToJSON(err);
        }

        // Writing stdin into input file
        await fs.writeFileAsync('assets/code/input.txt', stdin);

        // Running...
        const startTime = new Date();
        let result = await exec('cd assets/code && java Decoder < input.txt');
        const endTime = new Date();

        const runTime = endTime.getTime() - startTime.getTime();
        result.manualrunTime = runTime;
        return result;
    };
};

class JavaApi {

};

// const c = new C();
// const cpp = new Cpp();
// const java = new Java();

const cpp = new CppApi();
const java = new JavaApi();

module.exports = {
    c,
    cpp,
    java,
    node,
    python
};