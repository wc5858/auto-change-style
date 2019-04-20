function nodeFactory(options) {
    return Object.assign({
        children: []
    }, options)
}

function createTree(domNode) {
    const type = domNode && domNode.nodeType
    if (!type) {
        return
    }
    // Node是浏览器环境的全局对象
    if (type == Node.TEXT_NODE || 3) {
        const text = domNode.textContent.trim()
        if (text) {
            return nodeFactory({
                content: text
            })
        }
    }
}