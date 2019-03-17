function getCssAttr(value, type) {
    let exp
    switch (type) {
        case ('px'):
            exp = /^(.+)px$/
            break
        case ('color'):
            exp = /^rgb\((.+)\)$/
            break
    }
    if (exp) {
        const res = exp.exec(value)
        if (res) {
            return res[1]
        }
    }
    return ''
}
function getCss(el) {
    let lcss = ""
    let cs = getComputedStyle(el)
    //if(el.localName == 'html' || el.localName =='body'){
        for (let k = 0; k < cs.length; k++) {
            const at = cs.item(k)
            lcss += at + ":" + cs.getPropertyValue(at) + ";"
        }
        return lcss
    //}
    // let body = document.getElementsByTagName('body')[0]
    // let sameTagEl = document.createElement(el.localName)
    // body.appendChild(sameTagEl)
    // let ds = getComputedStyle(sameTagEl)
    // for (let k = 0; k < cs.length; k++) {
    //     const at = cs.item(k)
    //     const value = cs.getPropertyValue(at)
    //     if (value != ds.getPropertyValue(at)) {
    //         lcss += at + ":" + value + ";"
    //     }
    // }
    // body.removeChild(sameTagEl)
    // return lcss
}
function addCss(el, css) {
    let c = css || getCss(el)
    if (!el.hasAttribute("css_added")) {
        el.setAttribute("style", c);
    }
    el.setAttribute("css_added", "true")
}
function replaceBgColor(el,bgColorData) {
    let css = getCss(el)
    let bgColor = /background-color\:rgb\(([^\)]+)/.exec(css)
    if(bgColor && bgColorData.hasOwnProperty(bgColor[1])){
        console.log(css)
        css = css.replace(/(background-color\:rgb\()([^\)]+)/,"$1"+bgColorData[bgColor[1]].mappedColor)
    }
    addCss(el, css)
}
function dealCss(cssData, bgColorData) {
    function addCssData(tag, lcss) {
        if (cssData[tag] == undefined) {
            cssData[tag] = new Set()
        }
        cssData[tag].add(lcss)
    }
    function addColorData(width, height, color) {
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
    }
    // 获取CSS信息，这里做了柯里化
    return function getCss(el) {
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
                height = getCssAttr(value, 'px')
            }
            if (at == 'width') {
                width = getCssAttr(value, 'px')
            }
            if (at == 'background-color') {
                color = getCssAttr(value, 'color')
            }

            if (value != ds.getPropertyValue(at)) {
                lcss += at + ":" + value + ";"
            }
        }

        addColorData(width, height, color)
        addCssData(el.localName, lcss)
        body.removeChild(sameTagEl)
        return lcss
    }
}
module.exports = {
    getCssAttr,
    dealCss,
    addCss,
    replaceBgColor
}