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

function cssSimilarity(cp, target) {
    if (!cp.info || !target.info) {
        return typeof cp == typeof target ? 1 : 0
    }
    let sumAiBi = 0
    let sumAiAi = 0
    let sumBiBi = 0
    for (const i in cp.info.css) {
        if (cp.info.css.hasOwnProperty(i)) {
            let a = 1
            let b = 0
            let here = cp.info.css[i]
            let there = target.info.css[i]
            if (there == undefined || here != there) {
                b = 1
            }
            sumAiBi += a * b
            sumAiAi += a * a
            sumBiBi += b * b
        }
    }
    let cos = sumAiBi / (Math.sqrt(sumAiAi) * Math.sqrt(sumBiBi))
    return cos
}

function outerSimilarity(cp, target) {
    return 0
}

function selfSimilarity(cp, target) {
    // if()
    const weightTag = 1
    const weightType = 1
    return (weightTag * (cp.info.tag == target.info.tag ? 1 : 0) + weightType * (cp.info.type == target.info.type ? 1 : 0)) / (weightTag + weightType)
}

function innerSimilarity(cp, target, usingCssSimilarity) {
    if (!cp.children && !target.children) {
        return usingCssSimilarity ? cssSimilarity(cp, target) : 1
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
    return usingCssSimilarity ? cssSimilarity(cp, target) : 1
}

function getSimilarity(cp, target, usingCssSimilarity) {
    // const weightInner = 1
    // const weightOuter = 0
    // const weightSelf = 0
    // return outerSimilarity(cp, target) * weightOuter + selfSimilarity(cp, target) * weightSelf + innerSimilarity(cp, target) * weightInner
    let res = innerSimilarity(cp, target, usingCssSimilarity) * selfSimilarity(cp, target)
    return res
}

function computeSimilarity(cp, sourceCps, usingCssSimilarity) {
    let max = 0
    let tag = ''
    for (const key in sourceCps) {
        if (sourceCps.hasOwnProperty(key)) {
            let tmp = getSimilarity(cp, sourceCps[key], usingCssSimilarity)
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