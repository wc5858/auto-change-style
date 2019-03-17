const getJsData = require('../util/getJsData')
const getBundle = require('../util/getBundle')
const browserify = require('browserify')

// const bomJsFiles = ['./lib/mob/js/jquery-min', './lib/mob/js/polyk', './lib/crypto-js/crypto-js', './lib/mob/js/rectlib', './lib/mob/js/bomlib']

module.exports = async function (driver, returnType = 'mutidata') {
    // const jsData = await getJsData(bomJsFiles,'bomJsFiles')
    // 浏览器执行脚本获取CSS信息

    // 载入util，做browserUtil处理
    let bundle = getBundle('./src/util/browserUtil.js','util')

    return await driver.executeScript(function () {
        let data = arguments[0]
        eval(data.bundle)
        let util = require('util')

        let html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body>"
        let cssData = {}
        let bgColorData = {}

        // 把CSS信息添加到对应元素上
        function addCSS(el) {
            if (!el.hasAttribute("css_added")) {
                el.setAttribute("style", util.dealCss(el,cssData,bgColorData));
            }
            el.setAttribute("css_added", "true");
        }
        addCSS(document.body)
        let all = document.body.getElementsByTagName("*")
        for (let k = 0; k < all.length; k++) {
            addCSS(all[k])
        }
        html += document.body.outerHTML + "</body></html>"
        for (let k in cssData) {
            cssData[k] = [...cssData[k]]
        }
        switch (data.returnType) {
            // 返回结构化的css数据，或者返回抽取附带样式信息的html文本
            case 'cssdata': return JSON.stringify(cssData)
            case 'mutidata': return JSON.stringify({ cssData, bgColorData })
            case 'html': return html
        }
    }, {
            returnType,
            bundle
        }
    )
}