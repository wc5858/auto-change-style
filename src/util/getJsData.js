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
    // 并行读js文件，返回promise对象数组
    const jsPromises = jsFiles.map(async file => await readFile(file + '.js'))
    if (!jsData.has(key)) {
        // 如果key对应的文件不存在，串行拼合js文件
        // 目的是使得文件构成一个单例，不需要每次都重新读文件
        jsData.set(key, await getJsData(jsPromises))
    }
    return jsData.get(key)
}