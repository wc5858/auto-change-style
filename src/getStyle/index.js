const getJsData = require('../util/getJsData')
const browserify = require('browserify')

// const bomJsFiles = ['./lib/mob/js/jquery-min', './lib/mob/js/polyk', './lib/crypto-js/crypto-js', './lib/mob/js/rectlib', './lib/mob/js/bomlib']

let bundle

module.exports = async function (driver, returnType = 'mutidata') {
    // const jsData = await getJsData(bomJsFiles,'bomJsFiles')
    // 浏览器执行脚本获取CSS信息

    // 载入util，做browserUtil处理
    if (!bundle) {
        let b = browserify()
        b.require('./src/util/browserUtil.js', { expose: 'util' })
        //.pipe(process.stdout)
        bundle = await new Promise(function (resolve, reject) {
            b.bundle((err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res.toString())
                }
            })
        })
    }

    return await driver.executeScript(function () {
        let data = arguments[0]
        eval(data.bundle)
        let util = require('util')

        let html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body>"
        let cssData = {}
        let bgColorData = {}

        function addData(tag, lcss) {
            if (cssData[tag] == undefined) {
                cssData[tag] = new Set()
            }
            cssData[tag].add(lcss)
        }
        // 获取CSS信息
        function getLCSS(el) {
            let lcss = ""
            let cs = getComputedStyle(el)
            let body = document.getElementsByTagName('body')[0]
            let sameTagEl = document.createElement(el.localName)
            body.appendChild(sameTagEl)
            let ds = getComputedStyle(sameTagEl);
            let width, height, color
            for (let k = 0; k < cs.length; k++) {
                const at = cs.item(k)
                const value = cs.getPropertyValue(at)
                // 针对个别属性取数据
                if (at == 'height') {
                    height = util.getCssAttr(value,'px')
                }
                if (at == 'width') {
                    width = util.getCssAttr(value,'px')
                }
                if (at == 'background-color') {
                    color = util.getCssAttr(value,'color')
                }

                if (value != ds.getPropertyValue(at)) {
                    lcss += at + ":" + value + ";"
                }
            }
            if (width && height && color) {
                if (bgColorData[color]) {
                    bgColorData[color].area += width * height
                    bgColorData[color].times += 1
                } else {
                    bgColorData[color] = {
                        area: width * height,
                        times: 1
                    }
                }
            }

            addData(el.localName, lcss)
            body.removeChild(sameTagEl)
            return lcss
        }
        // 把CSS信息添加到对应元素上
        function addCSS(el) {
            if (!el.hasAttribute("css_added")) {
                el.setAttribute("style", getLCSS(el));
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