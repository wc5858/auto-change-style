function getCss(node) {
    let css = {}
    let cs = getComputedStyle(node)
    for (const i of cs) {
        css[i] = cs.getPropertyValue(i)
    }
    return css
}

function mergeCss(css) {
    let cssString = ''
    for (const i in css) {
        if (css.hasOwnProperty(i)) {
            cssString += `${i}:${css[i]};`
        }
    }
    return cssString
}

function getNodeInfo(node) {
    const data = {
        bomtype: node.getAttribute('bomtype') || null,
        pre: node.getAttribute('parent'),
        offsetWidth: node.offsetWidth,
        offsetHeight: node.offsetHeight,
        scrollWidth: node.scrollWidth,
        scrollHeight: node.scrollHeight,
        offsetLeft: node.offsetLeft,
        offsetTop: node.offsetTop,
        css: getCss(node),
        tag: node.tagName,
        class: node.classList.value.split(' ')
    }
    if (data.tag == 'IMG') {
        data.src = node.currentSrc
    }
    return data
}

function nodeFactory(options) {
    return Object.assign({
        // children: []
    }, options || {})
}

function isExcluded(node) {
    const excludeList = ["SCRIPT", "STYLE", "AREA", "HEAD", "META", "FRAME", "FRAMESET", "BR", "HR", "NOSCRIPT"]
    return node ? excludeList.includes(node.tagName || node.localName) : false
}

function isText(node) {
    // Node是浏览器环境的全局对象
    return node ? node.nodeType == (Node.TEXT_NODE || 3) : false
}

function isElement(node) {
    return node ? node.nodeType == (Node.ELEMENT_NODE || 1) : false
}

function mergeChildren(tmp) {
    const children = []
    let text = ''
    for (let i of tmp) {
        if (typeof i == 'string') {
            text += i
        } else {
            if (text) {
                children.push(text, i)
                text = ''
            } else {
                children.push(i)
            }
        }
    }
    if (text) {
        children.push(text)
    }
    return children
}

function createTree(domNode) {
    if (!domNode) {
        return null
    }
    if (isText(domNode)) {
        if (!domNode.textContent || domNode.textContent.trim() == '') {
            return null
        }
        return domNode.textContent || null
    }
    if (isElement(domNode)) {
        if (isExcluded(domNode)) {
            return null
        }
        const node = nodeFactory({
            info: getNodeInfo(domNode)
        })
        let children = []
        for (const element of domNode.childNodes) {
            const i = createTree(element)
            if (i) {
                children.push(i)
            }
        }
        // 合并连续text节点
        children = mergeChildren(children)
        if (children.length == 0) {
            if (node.info.offsetWidth * node.info.offsetHeight) {
                node.type = 'empty'
            } else {
                return null
            }
        } else if (children.length == 1 && typeof children[0] == 'string') {
            node.type = 'text'
            node.content = children[0]
        } else {
            node.children = children
        }
        return node
    }
    return null
}

function rebuildHTML(treeNode) {
    if (!treeNode) {
        return ''
    }
    if (typeof treeNode == 'string') {
        return treeNode
    }
    if (!treeNode.info) {
        return ''
    }
    let innerHTML = treeNode.children ? treeNode.children.reduce((pre, cur) => pre + rebuildHTML(cur), '') : (treeNode.content ? treeNode.content : '')
    const tag = treeNode.info.tag
    return `<${tag} class="" parent="${treeNode.info.pre}" ${tag == 'IMG' ? `src="${treeNode.info.src}"` : ''} style='${mergeCss(treeNode.info.css)}'>${innerHTML}</${tag}>`
}

module.exports = {
    createTree,
    rebuildHTML
}