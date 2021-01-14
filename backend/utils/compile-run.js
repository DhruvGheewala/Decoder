const os = require('os');
const { fs, errorToJSON } = require('../utils/global');
const { node, python } = require('compile-run');

const osCompile = {
    'exe': ['windows_nt'],
    'out': ['darwin', 'linux']
};

class C {
    runFile = async (path, { stdin }) => {
        const osType = os.type().toLowerCase();

        // compiling...
        try {
            if (osCompile.exe.indexOf(osType) >= 0) await exec(`gcc ${path} -o code/c.exe`);
            else if (osCompile.out.indexOf(osType) >= 0) await exec(`gcc ${path} -o code/c.out`);
        } catch (err) {
            return errorToJSON(err);
        }

        // Writing stdin into input file
        await fs.writeFileAsync('code/input.txt', stdin);

        // Running...
        let result = null;

        const startTime = new Date();
        if (osCompile.exe.indexOf(osType) >= 0) result = await exec('cd code && c.exe < input.txt');
        else if (osCompile.out.indexOf(osType) >= 0) result = await exec('cd code && ./c.out < input.txt');
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
            if (osCompile.exe.indexOf(osType) >= 0) await exec(`g++ ${path} -o code/cpp.exe`);
            else if (osCompile.out.indexOf(osType) >= 0) await exec(`g++ ${path} -o code/cpp.out`);
        } catch (err) {
            return errorToJSON(err);
        }

        // Writing stdin into input file
        await fs.writeFileAsync('code/input.txt', stdin);

        // Running...
        let result = null;

        const startTime = new Date();
        if (osCompile.exe.indexOf(osType) >= 0) result = await exec('cd code && cpp.exe < input.txt');
        else if (osCompile.out.indexOf(osType) >= 0) result = await exec('cd code && ./cpp.out < input.txt');
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
        await fs.writeFileAsync('code/input.txt', stdin);

        // Running...
        const startTime = new Date();
        let result = await exec('cd code && java Decoder < input.txt');
        const endTime = new Date();

        const runTime = endTime.getTime() - startTime.getTime();
        result.manualrunTime = runTime;
        return result;
    }
};

module.exports = {
    c: new C(),
    cpp: new Cpp(),
    java: new Java(),
    node,
    python
};