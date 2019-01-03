const fs = require("fs")
const util = require('util')
const readFile = util.promisify(fs.readFile)



module.exports = async function (driver,
    {
        // 参考：http://bom.ciens.ucv.ve/old_site/
        pac = 10, // pAC represents the granularity. It is an integer value between 0 and 10. 0 small blocks while 10 represent bigger blocks
        pdc = 50, // pDC represents the maximum separation allowed between blocks
        returnType = 'wprima'
    } = {}) {
    const bomJsFile = ['jquery-min', 'polyk', 'crypto-js', 'rectlib', 'bomlib']
    let jsData = []
    for (let i = 0; i < bomJsFile.length; i++) {
        jsData[i] = (await readFile('./lib/mob/js/' + bomJsFile[i] + '.js')).toString()
    }
    return await driver.executeScript(function () {
        // 这部分代码是在浏览器里面执行的，只能通过executeScript传递参数进去执行
        data = arguments[0]
        eval(data.jsData.join(''))
        return startSegmentation(window, data.pac, data.pdc, data.returnType)
    }, {
            jsData,
            pac,
            pdc,
            returnType
        }
    )
}