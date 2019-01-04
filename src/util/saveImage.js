// 将base64图片保存为png格式
const fs = require("fs")
const util = require('util')
const writeFile = util.promisify(fs.writeFile)

module.exports = async function (name, imgData) {
    // const base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
    const dataBuffer = new Buffer(imgData, 'base64')
    return await writeFile("./screenshots/" + name + ".png", dataBuffer)
}
