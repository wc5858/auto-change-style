const { Builder } = require('selenium-webdriver');
const { readJson, saveData } = require('../util/localFs');

const seg = require('../segmentation/index');
const cp = require('../util/component')

const data = 'element-cps'
const source = 'github-cps'

const usingCssSimilarity = false

module.exports = async function () {
    try {
        let d = await readJson(data)
        let s = await readJson(source)
        let result = {}
        let arr = []
        for (const key in d) {
            if (d.hasOwnProperty(key)) {
                let r = cp.computeSimilarity(d[key], s, usingCssSimilarity)
                arr.push(r.max)
                if (r.max > (usingCssSimilarity ? 0.22 : 0.49)) {
                    result[key] = r.tag
                } else {
                    result[key] = '0'
                }
            }
        }
        arr.sort((a, b) => a - b)
        console.log(arr[Math.round(arr.length * 0.2)])
        await saveData(`${data}&${source}`, result)
    } catch (e) {
        console.log(e)
    } finally {
        // await driver.quit();
    }
}