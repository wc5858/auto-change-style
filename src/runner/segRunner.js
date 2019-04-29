const { Builder, By, Key, until } = require('selenium-webdriver');
const seg = require('../segmentation/index');
const rebuild = require('../buildPage/index');
const saveImg = require('../util/saveImage');
// parser的回调格式和node异步方法的回调格式一致，故可以用promisify
const parser = require('html2hscript');
const util = require('util');
const promisifiedParser = util.promisify(parser);

const h = require('virtual-dom/h');
const createElement = require("virtual-dom/create-element");

const list = [
    // 'www.google.com',
    // 'my.vultr.com',
    //'www.bilibili.com',
    'github.com',
    //'stackoverflow.com',
    // 'news.ycombinator.com'
]

function checkStyle(node) {
    if(node.style) {
        console.log(node.style)
    }
    if(node.childNodes){
        for(let i of node.childNodes) {
            checkStyle(i)
        }
    }   
}

module.exports = async function () {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        for (let site of list) {
            let i =3
            // for (let i = 1; i <= 10; i++) {
                await driver.get('https://' + site);
                let data = await seg(driver, {
                    pac: i,
                    returnType : 'wprima'
                })
                // let imgData = await driver.takeScreenshot()
                // saveImg(site + 'pac-' + i, imgData)
                // let hscript = await promisifiedParser(data)
                // let node = await createElement(eval(hscript))
                // await rebuild(driver,node,site)
                // checkStyle(node)
            // }
        }

    } catch (e) {
        console.log(e)
    }
    finally {
        // await driver.quit();
    }
}
