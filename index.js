const { Builder, By, Key, until } = require('selenium-webdriver');
const parser = require('html2hscript');
const h = require('virtual-dom/h');
const createElement = require("virtual-dom/create-element");

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://www.google.com/ncr');
        let res = await driver.getPageSource()
        parser(res, function (err, hscript) {
            let node = createElement(eval(hscript))
            console.log(node)
        });
        // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
        // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    } finally {
        // await driver.quit();
    }
})();

// parser("<div>xx</div>", function (err, hscript) {
//     console.log(hscript)
//     console.log(typeof hscript)
//     console.log(eval(hscript))
//     let node = createElement(eval(hscript))
//     console.log(node)
// });