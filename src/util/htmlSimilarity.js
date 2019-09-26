const difflib = require('difflib');
const synonyms = require("synonyms");

function similarity(dom1, dom2, k = 0.5) {
    return k * structuralSimilarity(dom1.tagSequence, dom2.tagSequence) + (1 - k) * styleSimilarity(dom1.classList, dom2.classList);
}

function structuralSimilarity(tags1, tags2) {
    const s = new difflib.SequenceMatcher(null, tags1, tags2);
    return s.ratio();
}

function styleSimilarity(classList1, classList2) {
    function getWords(list) {
        const set = new Set();
        for (const i of list) {
            const words = i.split(/-|_/g);
            // TODO：分词需要优化
            // 情形1：topBar这种驼峰式写法（少见）
            // 情形2：topbar这种连写形式
            // 情形3：nav这种省略形式
            // 情形4：columns这种复数形式
            // 情形5：btn、sm、lg这种缩写形式
            // 其他还没留意到的情形
            for (const word of words) {
                if (word) {
                    set.add(word);
                    // 查找同义词库
                    const res = synonyms(word);
                    if (res && typeof res === 'object') {
                        for (const j of Object.values(res)) {
                            for (const k of j) {
                                set.add(k);
                            }
                        }
                    } else {
                        // console.log(res, word)
                    }
                }
            }
        }
        return set;
    }
    const set1 = getWords(classList1);
    const set2 = getWords(classList2);
    const common = 0;
    for (const i of set1.values()) {
        if (set2.has(set2)) {
            common++;
        }
    }
    return common / (set1.size + set2.size - common);
}

module.exports = {
    similarity,
}