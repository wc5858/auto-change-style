const getJsData = require('../util/getJsData')

// const bomJsFiles = ['./lib/mob/js/jquery-min', './lib/mob/js/polyk', './lib/crypto-js/crypto-js', './lib/mob/js/rectlib', './lib/mob/js/bomlib']

module.exports = async function (driver, returnType = 'cssdata') {
    // const jsData = await getJsData(bomJsFiles,'bomJsFiles')
    // 浏览器执行脚本获取CSS信息
    return await driver.executeScript(function () {
        var data = arguments[0]
        var html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body>"
        var cssData = {}

        function addData(tag, lcss) {
            if (cssData[tag] == undefined) {
                cssData[tag] = new Set()
            }
            cssData[tag].add(lcss)
        }
        // 获取CSS信息
        function getLCSS(el) {
            var lcss = ""
            var cs = getComputedStyle(el)
            var body = document.getElementsByTagName('body')[0]
            var sameTagEl = document.createElement(el.localName)
            body.appendChild(sameTagEl)
            var ds = getComputedStyle(sameTagEl);
            for (var k = 0; k < cs.length; k++) {
                var at = cs.item(k)
                if (cs.getPropertyValue(at) != ds.getPropertyValue(at)) {
                    lcss += at + ":" + cs.getPropertyValue(at) + ";"
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
        var all = document.body.getElementsByTagName("*")
        for (var k = 0; k < all.length; k++) {
            addCSS(all[k])
        }
        html += document.body.outerHTML + "</body></html>"
        for(var k in cssData) {
            cssData[k] = [...cssData[k]]
        }
        switch(returnType) {
            // 返回结构化的css数据，或者返回抽取附带样式信息的html文本
            case 'cssdata': return JSON.stringify(cssData)
            case 'html': return html
        }
    }, {
            
        }
    )
}