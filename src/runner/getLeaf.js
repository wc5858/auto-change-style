const { Builder } = require('selenium-webdriver');
const { saveData } = require('../util/localFs');
const getBundle = require('../util/getBundle');
const list = [
    {
        site: 'bootstrap',
        protocol: 'https',
        root: 'getbootstrap.com/docs/4.2/components/',
        pages: ['alerts', 'badge', 'breadcrumb', 'buttons', 'button-group', 'card', 'carousel',
            'collapse', 'dropdowns', 'forms', 'input-group', 'jumbotron', 'list-group', 'media-object',
            'modal', 'navs', 'navbar', 'pagination', 'popovers', 'progress', 'scrollspy', 'spinners', 'toasts', 'tooltips'],
        resolved: false
    },
    {
        site: 'github',
        protocol: 'https',
        root: 'github.com',
        pages: [''],
        resolved: false
    },
    {
        site: 'element',
        protocol: 'https',
        root: 'element.eleme.cn',
        pages: ['#/zh-CN/component/installation'],
        resolved: false
    }
]

let id = 0

function getLeaf(map, node) {
    if (!node || (typeof node == 'string')) {
        return
    }
    if (!node.children) {
        if (map[node.info.tag]) {
            if (node.info.class) {
                if (!map[node.info.tag][node.info.class]) {
                    map[node.info.tag][node.info.class] = node
                }
            } else {
                map[node.info.tag][++id] = node
            }
        } else {
            map[node.info.tag] = {}
            if (node.info.class) {
                map[node.info.tag][node.info.class] = node
            } else {
                map[node.info.tag][++id] = node
            }
        }
    } else {
        for (const i of node.children) {
            getLeaf(map, i)
        }
    }
}

function compareWidth(n1, n2) {
    if (!n1 || (typeof n1 == 'string')) {
        return
    }
    if (!n1.children) {
        if (n1.info.css.width != n2.info.css.width) {
            n1.info.css.width = 'auto'
        }
    } else {
        for (let i = 0; i < n1.children.length; i++) {
            compareWidth(n1.children[i], n2.children[i])
        }
    }
}

module.exports = async function () {
    try {
        for (let site of list) {
            if (!site.resolved) {
                const leafMap = {}
                let driver = await new Builder().forBrowser('chrome').build()
                for (let page of site.pages) {
                    await driver.get(site.protocol + '://' + site.root + page)
                    await driver.manage().window().setRect({
                        height: 1000,
                        width: 1200
                    })
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
                    await driver.manage().window().setRect({
                        height: 1000,
                        width: 1210
                    })
                    let node2 = await driver.executeScript(function () {
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
                    compareWidth(node,node2)
                    getLeaf(leafMap, node)
                }
                await saveData(`${site.site}-leaf`, leafMap)
            }
        }

    } catch (e) {
        console.log(e)
    } finally {
        // await driver.quit();
    }
}