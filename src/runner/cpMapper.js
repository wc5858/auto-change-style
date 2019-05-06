const { Builder } = require('selenium-webdriver');
const { readJson,saveData } = require('../util/localFs');

const seg = require('../segmentation/index');
const cp = require('../util/component')

const data = 'github-cps'
const source = 'bootstrap-cps'

module.exports = async function () {
    try {
        let d = await readJson(data)
        let s = await readJson(source)
        let result = {}
        for (const key in d) {
            if (d.hasOwnProperty(key)) {
                let r = cp.computeSimilarity(d[key],s)
                if(r.max > 0.5) {
                    result[key] = r.tag
                } else {
                    result[key] = '0'
                }
            }
        }
        await saveData(`${data}&${source}`, result)
    } catch (e) {
        console.log(e)
    } finally {
        // await driver.quit();
    }
}