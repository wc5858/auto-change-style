function getCp(map, node, parent, index) {
    if (!node) {
        return
    }
    if (node.info && node.info.bomtype) {
        let tag = node.info.tag + '|' + node.info.class
        if (!map[tag]) {
            map[tag] = node
        }
        if (parent) {
            parent.children[index] = {
                type: 'slot',
                slotName: tag
            }
        }
    }
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            getCp(map, node.children[i], node, i)
        }
    }
}



module.exports = {
    getCp
}