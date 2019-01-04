const { Builder, By, Key, until } = require('selenium-webdriver');
const seg = require('../segmentation/index');
const saveImg = require('../util/saveImage');

const list = [
    //'www.google.com',
    //'www.bilibili.com',
    //'github.com',
    //'stackoverflow.com',
    'news.ycombinator.com'
]

module.exports = async function () {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        for (let site of list) {
            for (let i = 1; i <= 10; i++) {
                await driver.get('https://' + site);
                let data = await seg(driver, {
                    pac: i
                })
                let imgData = await driver.takeScreenshot()
                saveImg(site + 'pac-' + i, imgData)
            }
        }

    } catch (e) {
        console.log(e)
    }
    finally {
        // await driver.quit();
    }
}
