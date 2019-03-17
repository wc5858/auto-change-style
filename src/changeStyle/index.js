const getJsData = require('../util/getJsData')
const getBundle = require('../util/getBundle')
// const bomJsFiles = ['./lib/mob/js/jquery-min', './lib/mob/js/polyk', './lib/crypto-js/crypto-js', './lib/mob/js/rectlib', './lib/mob/js/bomlib']

module.exports = async function (driver, styleData, options) {
    // const jsData = await getJsData(bomJsFiles,'bomJsFiles')
    let bundle = getBundle('./src/util/browserUtil.js', 'util')

    // 传入styleData，在浏览器里执行脚本更换样式
    return await driver.executeScript(function () {
        let data = arguments[0]
        eval(data.bundle)
        let util = require('util')

        const options = data.options
        const originBgColorData = data.styleData.bgColorData
        let cssData = {}
        let bgColorData = {}
        const getCss = util.dealCss(cssData, bgColorData)
        let html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body>"

        let all = document.body.getElementsByTagName("*")
        for (let k = 0; k < all.length; k++) {
            getCss(all[k])
        }

        let totalArea = 0
        let totalTimes = 0
        for (let i in bgColorData) {
            totalArea += bgColorData[i].area
            totalTimes += bgColorData[i].times
        }
        for (let i in bgColorData) {
            bgColorData[i].areaRatio = bgColorData[i].area / totalArea
            bgColorData[i].timesRatio = bgColorData[i].area / totalTimes
        }

        const HIGH = 0.4
        const MID = 0.1

        function analysisColor(data) {
            let colors = {
                area: {
                    high: [],
                    mid: [],
                    low: []
                },
                times: {
                    high: [],
                    mid: [],
                    low: []
                }
            }
            for (let i in data) {
                if (data.hasOwnProperty(i)) {
                    colors.area[data[i].areaRatio > HIGH ? 'high' : (data[i].areaRatio > MID ? 'mid' : 'low')].push(i)
                    colors.times[data[i].timesRatio > HIGH ? 'high' : (data[i].timesRatio > MID ? 'mid' : 'low')].push(i)
                }
            }
            return colors
        }

        const originColors = analysisColor(originBgColorData)

        const mappingType = 'area'
        function establishMapping() {
            for (let i in bgColorData) {
                let source = originColors[mappingType][bgColorData[i].areaRatio > HIGH ? 'high' : (bgColorData[i].areaRatio > MID ? 'mid' : 'low')]
                bgColorData[i].mappedColor = source[Math.floor(Math.random() * source.length)]
            }
        }
        establishMapping()
        
        console.log(bgColorData)
        
        util.addCss(document.body)
        // 对每个元素都进行处理
        for (let k = 0; k < all.length; k++) {
            util.replaceBgColor(all[k],bgColorData)
        }
        html += document.body.outerHTML + "</body></html>"
        location.href = 'about:blank'
        document.write(html)
        //util.addCss(document.querySelector('html'))
        console.log(html)
        return html
    }, {
            styleData,
            options,
            bundle
        }
    )
}