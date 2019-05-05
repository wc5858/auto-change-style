const { Builder } = require('selenium-webdriver');
const { rebuildHTML } = require('../util/domTree');
const getBundle = require('../util/getBundle');

const seg = require('../segmentation/index');
const list = [
    {
        site: 'github',
        protocol: 'https',
        root: 'github.com'
    }
]

module.exports = async function () {
    try {
        for (let site of list) {
            let driver = await new Builder().forBrowser('chrome').build();
            await driver.get(site.protocol + '://' + site.root)
            const bundle = getBundle('./src/util/domTree.js', 'domTree')

            let node = await driver.executeScript(function () {
                var data = arguments[0]
                try {
                    eval(data.bundle)
                } catch(e) {
                    console.log(e)
                }
                var domTree = require('domTree')
                return domTree.createTree(document.body)
            }, {
                    bundle
                }
            )
            let html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head>"
            html += rebuildHTML(node) + '</html>'
            await driver.executeScript(function () {
                var data = arguments[0]
                try {
                    document.write(data.html)
                } catch(e) {
                    console.log(e)
                }
                return 
            }, {
                    html
                }
            )
        }

    } catch (e) {
        console.log(e)
    } finally {
        // await driver.quit();
    }
}