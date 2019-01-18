const getJsData = require('../util/getJsData')

const bomJsFiles = ['./lib/mob/js/jquery-min', './lib/mob/js/polyk', './lib/crypto-js/crypto-js', './lib/mob/js/rectlib', './lib/mob/js/bomlib']

module.exports = async function (driver,
    {
        // 参考：http://bom.ciens.ucv.ve/old_site/
        pac = 10, // pAC represents the granularity. It is an integer value between 0 and 10. 0 small blocks while 10 represent bigger blocks
        pdc = 50, // pDC represents the maximum separation allowed between blocks
        returnType = 'wprima'
    } = {}) {

    const jsData = await getJsData(bomJsFiles,'bomJsFiles')

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