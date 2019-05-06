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

function outerSimilarity(cp, target) {
    return 0
}

function selfSimilarity(cp, target) {
    const weightTag = 3
    const weightType = 1
    return (weightTag * (cp.tag == target.tag ? 1 : 0) + weightType * (cp.type == target.type ? 1 : 0)) / (weightTag + weightType)
}

function innerSimilarity(cp, target) {
    if (!cp.children && !target.children) {
        return 1
    }
    if (!cp.children || !target.children) {
        return 0
    }
    // if (target.children.length < cp.children.length) {
    //     return 0
    // }
    // let count = 0
    // for (let i = 0; i < cp.children.length; i++) {
    //     count += innerSimilarity(cp.children[i], target.children[i])
    // }
    // return count / cp.children.length
    if (target.children.length != cp.children.length) {
        return 0
    }
    for (let i = 0; i < cp.children.length; i++) {
        if (innerSimilarity(cp.children[i], target.children[i]) == 0) {
            return 0
        }
    }
    return 1
}

function getSimilarity(cp, target) {
    // const weightInner = 1
    // const weightOuter = 0
    // const weightSelf = 0
    // return outerSimilarity(cp, target) * weightOuter + selfSimilarity(cp, target) * weightSelf + innerSimilarity(cp, target) * weightInner
    return innerSimilarity(cp, target) * selfSimilarity(cp, target)
}

function computeSimilarity(cp, sourceCps) {
    let max = 0
    let tag = ''
    for (const key in sourceCps) {
        if (sourceCps.hasOwnProperty(key)) {
            let tmp = getSimilarity(cp, sourceCps[key])
            if (tmp > max) {
                max = tmp
                tag = key
            }
        }
    }
    return {
        max,
        tag
    }
}

module.exports = {
    getCp,
    computeSimilarity
}