const { Builder } = require('selenium-webdriver');
const { rebuildHTML } = require('../util/domTree');
const getBundle = require('../util/getBundle');
const { readJson } = require('../util/localFs');

const seg = require('../segmentation/index');
const list = [
    {
        site: 'github',
        protocol: 'https',
        root: 'github.com'
    }
    // {
    //     site: 'element',
    //     protocol: 'https',
    //     root: 'element.eleme.cn/#/zh-CN/component/installation'
    // }
]

module.exports = async function () {
    try {
        let source = await readJson('bootstrap-leaf')
        for (let site of list) {
            let driver = await new Builder().forBrowser('chrome').build();
            await driver.get(site.protocol + '://' + site.root)
            const bundle = getBundle('./src/util/domTree.js', 'domTree')

            let node = await driver.executeScript(function () {
                var data = arguments[0]
                try {
                    eval(data.bundle)
                } catch (e) {
                    console.log(e)
                }
                var domTree = require('domTree')
                let node = domTree.createTree(document.body)
                console.log(node)
                return node
            }, {
                    bundle
                }
            )
            function doReplace(node) {
                if (!node || (typeof node == 'string')) {
                    return
                }
                if (!node.children) {
                    let tag = node.info.tag
                    let cla = node.info.class
                    if(source[tag]) {
                        let mappedNode
                        if(source[tag][cla]) {
                            mappedNode = source[tag][cla]
                        } else {
                            let keys = Object.keys(source[tag])
                            mappedNode = source[tag][keys[Math.floor(Math.random()*keys.length)]]
                        }
                        node.info.css = mappedNode.info.css
                    }
                } else {
                    for (const i of node.children) {
                        doReplace(i)
                    }
                }
            }
            doReplace(node)
            let html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head>"
            html += rebuildHTML(node) + '</html>'
            await driver.executeScript(function () {
                var data = arguments[0]
                try {
                    document.write(data.html)
                } catch (e) {
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