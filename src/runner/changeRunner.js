const { Builder, By, Key, until } = require('selenium-webdriver');
const change = require('../changeStyle/index');
const saveImg = require('../util/saveImage');
const util = require('util');
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

const list = [
    // 'www.google.com',
    // 'my.vultr.com',
    //'www.bilibili.com',
    'github.com',
    //'stackoverflow.com',
    // 'news.ycombinator.com'
]

const style = 'bootstrap'

module.exports = async function () {
    let driver = await new Builder().forBrowser('chrome').build();
    let styleData = await readFile('./data/' + style + '.json')
    styleData = JSON.parse(styleData)
    try {
        for (let site of list) {
            await driver.get('https://' + site)
            let data = await change(driver, styleData)
            // let imgData = await driver.takeScreenshot()
            // saveImg(site + 'pac-' + i, imgData)
            // let hscript = await promisifiedParser(data)
            // let node = await createElement(eval(hscript))
        }

    } catch (e) {
        console.log(e)
    }
    finally {
        // await driver.quit();
    }
}
