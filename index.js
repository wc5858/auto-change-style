const program = require('commander');
const segRunner = require('./src/runner/segRunner');
const styleRunner = require('./src/runner/styleRunner');
const changeRunner = require('./src/runner/changeRunner');
const cpRunner = require('./src/runner/cpRunner');
const cpRunner2 = require('./src/runner/cpRunner2');
const cpMapper = require('./src/runner/cpMapper');
const rebuild = require('./src/runner/rebuild');
const rebuild2 = require('./src/runner/rebuild2');
const getLeaf = require('./src/runner/getLeaf');
const getSites = require('./src/runner/getSites');
const compare = require('./src/runner/compare');
const replace = require('./src/runner/replace');
const optimization = require('./src/runner/optimization');

program
    .version('0.1.0')
    .option('-s, --style', 'Add style')
    .option('-a, --autoseg', 'Add autoseg')
    .option('-c, --change', 'Add change')
    .option('-p, --component', 'Add component')
    .option('-p2, --component2', 'Add component2')
    .option('-m, --mapper', 'Add mapper')
    .option('-r, --rebuild', 'Add rebuild')
    .option('-r2, --rebuild2', 'Add rebuild2')
    .option('-r, --getleaf', 'Add getleaf')
    .option('-g, --getsites', 'Add getsites')
    .option('-cpr, --compare', 'Add compare')
    .option('-re, --replace', 'Add replace')
    .option('-o, --optimization', 'Add optimization')
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
if(program.component2) {
    cpRunner2()
}
if(program.mapper) {
    cpMapper()
}
if(program.rebuild) {
    rebuild()
}
if(program.rebuild2) {
    rebuild2()
}
if(program.getleaf) {
    getLeaf()
}
if(program.getsites) {
    getSites()
}
if(program.compare) {
    compare()
}
if(program.replace) {
    replace()
}
if(program.optimization) {
    optimization()
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
