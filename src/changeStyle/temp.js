// const blackList = ['height', 'width', 'display', 'padding', 'margin']
        // const whiteList = ['color', 'font']
        // function filter(key) {
        //     if (options && options.strategy) {
        //         for (let i of whiteList) {
        //             if (key.indexOf(i) > 0) {
        //                 return true
        //             }
        //         }
        //         return false
        //     } else {
        //         for (let i of blackList) {
        //             if (key.indexOf(i) == 0) {
        //                 return false
        //             }
        //         }
        //         return true
        //     }

        //     //return !filterKeys.includes(key) 
        // }
        // function mergeCSS(old, ne) {
        //     css = ''
        //     for (let i in old) {
        //         if (old.hasOwnProperty(i) && !filter(i)) {
        //             css += i + ':' + old[i] + ';'
        //         }
        //     }
        //     for (let i in ne) {
        //         if (ne.hasOwnProperty(i) && filter(i)) {
        //             css += i + ':' + ne[i] + ';'
        //         }
        //     }
        //     return css
        // }
        // // 替换CSS
        // function replaceCSS(el) {
        //     let oldLCSS = getLCSS(el)
        //     let d = data.styleData.cssData[el.localName]
        //     if (d == undefined) {
        //         addCSS(el, oldLCSS)
        //         return
        //     }
        //     let old = {}
        //     let o = oldLCSS.split(';')
        //     for (let x of o) {
        //         let name = x.split(':')[0]
        //         if (name !== "") {
        //             old[name] = x.split(':')[1]
        //         }
        //     }
        //     let max = 0
        //     let res
        //     for (let i of d) {
        //         let t = i.split(';')
        //         let set = new Set()
        //         for (let j in old) {
        //             set.add(j)
        //         }
        //         let ne = {}
        //         for (let k of t) {
        //             let name = k.split(':')[0]
        //             if (name !== "") {
        //                 set.add(name)
        //                 ne[name] = k.split(':')[1]
        //             }
        //         }
        //         set = [...set]
        //         // 计算余弦夹角
        //         let sumAiBi = 0
        //         let sumAiAi = 0
        //         let sumBiBi = 0
        //         for (let m of set) {
        //             if (filter(m)) {
        //                 let a, b
        //                 if (old[m] !== undefined) {
        //                     a = 1
        //                 }
        //                 if (ne[m] !== undefined) {
        //                     b = 1
        //                 }
        //                 sumAiBi += a * b
        //                 sumAiAi += a * a
        //                 sumBiBi += b * b
        //             }
        //         }
        //         let cos = sumAiBi / (Math.sqrt(sumAiAi) * Math.sqrt(sumBiBi))
        //         if (cos > max) {
        //             max = cos
        //             res = ne
        //         }
        //     }
        //     let merged = mergeCSS(old, res)
        //     console.log({
        //         oldLCSS,
        //         merged
        //     })
        //     addCSS(el, merged)
        // }