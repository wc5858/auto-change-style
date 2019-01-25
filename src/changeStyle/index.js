const getJsData = require('../util/getJsData')

// const bomJsFiles = ['./lib/mob/js/jquery-min', './lib/mob/js/polyk', './lib/crypto-js/crypto-js', './lib/mob/js/rectlib', './lib/mob/js/bomlib']

module.exports = async function (driver, styleData) {
    // const jsData = await getJsData(bomJsFiles,'bomJsFiles')

    return await driver.executeScript(function () {
        var data = arguments[0]
        console.log(data)
        var html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body>"
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
            body.removeChild(sameTagEl)
            return lcss
        }
        function addCSS(el, css) {
            var c = css || getLCSS(el)
            if (!el.hasAttribute("css_added")) {
                el.setAttribute("style", c);
            }
            el.setAttribute("css_added", "true");
        }
        function replaceCSS(el) {
            var oldLCSS = getLCSS(el)
            var d = data.styleData.cssData[el.localName]
            if (d == undefined) {
                addCSS(el, oldLCSS)
                return
            }
            var old = {}
            var o = oldLCSS.split(';')
            for (var x of o) {
                var name = x.split(':')[0]
                if (name !== "") {
                    old[name] = x.split(':')[1]
                }
            }
            var max = 0
            var res = ''
            for (var i of d) {
                var t = i.split(';')
                var set = new Set()
                for (var j in old) {
                    set.add(j)
                }
                var ne = {}
                for (var k of t) {
                    var name = k.split(':')[0]
                    if (name !== "") {
                        set.add(name)
                        ne[name] = k.split(':')[1]
                    }
                }
                set = [...set]
                let sumAiBi = 0
                let sumAiAi = 0
                let sumBiBi = 0
                for (var m of set) {
                    var a, b
                    if (old[m] !== undefined) {
                        a = 1
                    }
                    if (ne[m] !== undefined) {
                        b = 1
                    }
                    sumAiBi += a * b
                    sumAiAi += a * a
                    sumBiBi += b * b
                }
                var cos = sumAiBi / (Math.sqrt(sumAiAi) * Math.sqrt(sumBiBi))
                if (cos > max) {
                    max = cos
                    res = i
                }
            }
            addCSS(el, res)
        }
        addCSS(document.body)
        var all = document.body.getElementsByTagName("*")
        for (var k = 0; k < all.length; k++) {
            replaceCSS(all[k])
        }
        html += document.body.outerHTML + "</body></html>"
        console.log(html)
        return html
    }, {
            styleData
        }
    )
}