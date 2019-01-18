const fs = require("fs")
const util = require('util')
const readFile = util.promisify(fs.readFile)

let jsData = new Map()

async function getJsData(jsPromises) {
    let data = ''
    for (let i of jsPromises) {
        data += (await i).toString()
    }
    return data
}

module.exports = async function (jsFiles, key) {
    const jsPromises = jsFiles.map(async file => await readFile(file + '.js'))
    if (!jsData.has(key)) {
        jsData.set(key, await getJsData(jsPromises))
    }
    return jsData.get(key)
}