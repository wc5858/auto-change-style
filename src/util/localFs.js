const fs = require("fs");
const util = require('util');
const fsMkdir = util.promisify(fs.mkdir);
const fsStat = util.promisify(fs.stat);

async function mkdir(path) {
    try {
        return await fsStat(path)
    } catch (e) {
        return await fsMkdir(path)
    }
}

module.exports = {
    mkdir
}