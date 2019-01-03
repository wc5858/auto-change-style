const { Builder, By, Key, until } = require('selenium-webdriver');
const parser = require('html2hscript');
const h = require('virtual-dom/h');
const createElement = require("virtual-dom/create-element");
const seg = require('./src/segmentation/index');


(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://www.google.com/ncr');
        let res = await driver.getPageSource()
        parser(res, function (err, hscript) {
            if (err) {
                return console.error(err);
            }
            let node = createElement(eval(hscript))
            // console.log(node)
        });
        data = await seg(driver,{
            pac:5
        })
        console.log(data)
        // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
        // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    } finally {
        // await driver.quit();
    }
})();
