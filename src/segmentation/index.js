const fs = require("fs")
const util = require('util')
const readFile = util.promisify(fs.readFile)

const bomJsFile = ['jquery-min', 'polyk', 'crypto-js', 'rectlib', 'bomlib']
const jsPromises = bomJsFile.map(async file => await readFile('./lib/mob/js/' + file + '.js'))
let jsData = ''

async function getJsData() {
    let data = ''
    for (let i of jsPromises) {
        data += (await i).toString()
    }
    return data
}

module.exports = async function (driver,
    {
        // 参考：http://bom.ciens.ucv.ve/old_site/
        pac = 10, // pAC represents the granularity. It is an integer value between 0 and 10. 0 small blocks while 10 represent bigger blocks
        pdc = 50, // pDC represents the maximum separation allowed between blocks
        returnType = 'wprima'
    } = {}) {

    if(jsData.length==0) {
        jsData = await getJsData()
    }

    return await driver.executeScript(function () {
        // 这部分代码是在浏览器里面执行的，只能通过executeScript传递参数进去执行
        data = arguments[0]
        try {
            eval(data.jsData)
        } catch(e) {
            console.log(e)
        }
        return startSegmentation(window, data.pac, data.pdc, data.returnType)
    }, {
            jsData,
            pac,
            pdc,
            returnType
        }
    )
}