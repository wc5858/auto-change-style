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
]

module.exports = async function () {
    try {
        let mapper = await readJson('github-cps&bootstrap-cps')
        let data = await readJson('bootstrap-cps')
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
            function doReplace(node, reference) {
                if (!node || (typeof node == 'string') || !node.info) {
                    return
                }
                const tag = node.info.tag + '|' + node.info.class
                if (mapper[tag] && mapper[tag] != '0' && data[mapper[tag]]) {
                    let target = data[mapper[tag]]
                    node.info.css = target.info.css
                    if (!target.children) {
                        if (node.children) {
                            for (const i of node.children) {
                                doReplace(i)
                            }
                        }
                        return
                    }
                    if(!node.children) {
                        return
                    }
                    let i = 0
                    for (; i < node.children.length && i < target.children.length; i++) {
                        doReplace(node.children[i], target.children[i])
                    }
                    for (; i < node.children.length; i++) {
                        doReplace(node.children[i])
                    }
                } else {
                    if (!reference) {
                        if (!node.children) {
                            return
                        }
                        for (const i of node.children) {
                            doReplace(i)
                        }
                        return
                    } else {
                        if (reference.info) {
                            node.info.css = reference.info.css
                        }
                        if (!node.children || !reference.children) {
                            return
                        }
                        for (let i = 0; i < node.children.length && i < reference.children.length; i++) {
                            doReplace(node.children[i], reference.children[i])
                        }
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