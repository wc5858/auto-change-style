function getCss(node) {
    let css = {}
    let cs = getComputedStyle(node)
    for (const i of cs) {
        css[i] = cs.getPropertyValue(i)
    }
    return css
}

function getNodeInfo(node){
    const data = {
        bomtype: node.getAttribute('bomtype') || null,
        offsetWidth: node.offsetWidth,
        offsetHeight: node.offsetHeight,
        scrollWidth: node.scrollWidth,
        scrollHeight: node.scrollHeight,
        css: getCss(node),
        tag: node.tagName,
        class: node.classList.value.split(' ')
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
    return node ? (node.tagName || node.nodeName) in excludeList : false
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
        if(typeof i == 'string') {
            text += i
        } else {
            if(text) {
                children.push(text,i)
                text = ''
            } else {
                children.push(i)
            }
        }
    }
    if(text) {
        children.push(text)
    }
    return children
}

function createTree(domNode) {
    if (!domNode) {
        return null
    }
    if (isText(domNode)) {
        return domNode.textContent.trim() || null
    }
    if(isElement(domNode)) {
        if(isExcluded(domNode)) {
            return null
        }
        const node = nodeFactory({
            info: getNodeInfo(domNode)
        })
        let children = []
        for (const element of domNode.childNodes) {
            const i = createTree(element)
            if(i) {
                children.push(i)
            }
        }
        // 合并连续text节点
        children = mergeChildren(children)
        if(children.length == 0) {
            if(node.info.offsetWidth * node.info.offsetHeight) {
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

module.exports = {
    createTree
}