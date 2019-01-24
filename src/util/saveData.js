const fs = require("fs")
const util = require('util')
const writeFile = util.promisify(fs.writeFile)

module.exports = async function (name, data) {
    let json = JSON.stringify(data, null, 4)
    return await writeFile("./data/" + name + ".json", json, 'utf8')
}