const { Builder, By, Key, until } = require('selenium-webdriver');
const seg = require('../segmentation/index');
const rebuild = require('../buildPage/index');
const saveImg = require('../util/saveImage');
// parser的回调格式和node异步方法的回调格式一致，故可以用promisify
const parser = require('html2hscript');
const util = require('util');
const { readJson, generatorCompare, saveData } = require('../util/localFs');
const { rebuildHTML } = require('../util/domTree');
const { getLeafComponent } = require('../util/component');
const { similarity } = require('../util/htmlSimilarity');
const promisifiedParser = util.promisify(parser);

const h = require('virtual-dom/h');
const createElement = require("virtual-dom/create-element");

const list = [
    // 'www.google.com',
    // 'my.vultr.com',
    //'www.bilibili.com',
    // 'github.com',
    'www.cancer.gov',
    //'stackoverflow.com',
    // 'news.ycombinator.com'
];

module.exports = async function () {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        for (let site of list) {
            const start = new Date();
            let i = 5;
            await driver.get('https://' + site);
            let node = await seg(driver, {
                pac: i,
                returnType: 'wprima',
                showBox: false,
            });
            const list = getLeafComponent(node);
            const data = await readJson('../data/bootstrap-leafComponent-2');
            for (const i of list) {
                let max = 0;
                for (const j of data) {
                    const score = similarity(i, j);
                    if (score > max) {
                        max = score;
                        i.similarity = j;
                    }
                }
            }
            saveData('compare.json', list);
            await generatorCompare(list);
            const time = new Date() - start;
            console.log(time / 1000 / 60);
        }

    } catch (e) {
        console.log(e);
    }
    finally {
        // await driver.quit();
    }
}
