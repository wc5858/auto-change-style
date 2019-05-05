const program = require('commander');
const segRunner = require('./src/runner/segRunner');
const styleRunner = require('./src/runner/styleRunner');
const changeRunner = require('./src/runner/changeRunner');
const cpRunner = require('./src/runner/cpRunner');
const cpMapper = require('./src/runner/cpMapper');
const rebuild = require('./src/runner/rebuild');

program
    .version('0.1.0')
    .option('-s, --style', 'Add style')
    .option('-a, --autoseg', 'Add autoseg')
    .option('-c, --change', 'Add change')
    .option('-p, --component', 'Add component')
    .option('-m, --mapper', 'Add mapper')
    .option('-r, --rebuild', 'Add rebuild')
    .parse(process.argv);

if(program.style) {
    styleRunner()
}
if(program.autoseg) {
    segRunner()
}
if(program.change) {
    changeRunner()
}
if(program.component) {
    cpRunner()
}
if(program.mapper) {
    cpMapper()
}
if(program.rebuild) {
    rebuild()
}
// (async function example() {
//     let driver = await new Builder().forBrowser('chrome').build();
//     try {
//         // await driver.get('http://www.google.com/ncr');
//         // let res = await driver.getPageSource()
//         // parser(res, function (err, hscript) {
//         //     if (err) {
//         //         return console.error(err);
//         //     }
//         //     let node = createElement(eval(hscript))
//         //     // console.log(node)
//         // });
//         // let data = await seg(driver,{
//         //     pac:5 // 10太大了
//         // })
//         // // console.log(data)
//         // let imgData = await driver.takeScreenshot()
//         // saveImg('x',imgData)
//         // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
//         // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);

//         for (let i = 1; i <= 10; i++) {
//             await driver.get('http://www.google.com/ncr');
//             let data = await seg(driver, {
//                 pac: i // 10太大了
//             })
//             let imgData = await driver.takeScreenshot()
//             saveImg('pac-' + i, imgData)
//         }

//     } finally {
//         // await driver.quit();
//     }
// })();
