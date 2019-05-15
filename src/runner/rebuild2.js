const { Builder } = require('selenium-webdriver');
const { rebuildHTML } = require('../util/domTree');
const getBundle = require('../util/getBundle');
const { readJson } = require('../util/localFs');

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



const PRE_LIFE_CIRCLE = 'pre'
const AFTER_LIFE_CIRCLE = 'aft'

let countParentDiff = 0
let count = 0

function dealTree(node, parent, lifeCircle) {
    if (!node || (typeof node == 'string')) {
        return
    }
    if (!node.children) {
        if (lifeCircle == AFTER_LIFE_CIRCLE){
            count++
        }
        if (parent) {
            let x = node.info.offsetLeft
            let y = node.info.offsetTop
            let w = node.info.offsetWidth
            let h = node.info.offsetHeight
            let X = parent.info.offsetLeft
            let Y = parent.info.offsetTop
            let W = parent.info.offsetWidth
            let H = parent.info.offsetHeight
            if (x >= X && y >= Y && (x + w) <= (X + W) && (y + h) <= (Y + H)) {
                node.info[lifeCircle] = 1 //1代表父子关系
            } else {
                node.info[lifeCircle] = 0
            }
            console.log(node.info[PRE_LIFE_CIRCLE],node.info[AFTER_LIFE_CIRCLE])
            if (lifeCircle == AFTER_LIFE_CIRCLE && node.info[PRE_LIFE_CIRCLE] != node.info[AFTER_LIFE_CIRCLE]) {
                countParentDiff++
            }
        }
    } else {
        for (const i of node.children) {
            dealTree(i, node, lifeCircle)
        }
    }
}

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

            let countLeaf = 0
            let replaced = 0

            function doReplace(node) {
                if (!node || (typeof node == 'string')) {
                    return
                }
                if (!node.children) {
                    countLeaf++
                    let tag = node.info.tag
                    let cla = node.info.class
                    if (source[tag]) {
                        let mappedNode
                        // 随机选取
                        // if(source[tag][cla]) {
                        //     mappedNode = source[tag][cla]
                        // } else {
                        //     let keys = Object.keys(source[tag])
                        //     mappedNode = source[tag][keys[Math.floor(Math.random()*keys.length)]]
                        // }
                        let tmp = null
                        let min = Infinity
                        for (const key in source[tag]) {
                            if (source[tag].hasOwnProperty(key)) {
                                const element = source[tag][key]
                                let widthDiff = Math.abs(element.info.offsetWidth - node.info.offsetWidth) / node.info.offsetWidth
                                let heightDiff = Math.abs(element.info.offsetHeight - node.info.offsetHeight) / node.info.offsetHeight
                                if (widthDiff + heightDiff < min) {
                                    min = widthDiff + heightDiff
                                    tmp = element
                                }
                            }
                        }
                        if (tmp) {
                            node.info.css = tmp.info.css
                            replaced++
                        }
                    }
                } else {
                    for (const i of node.children) {
                        doReplace(i)
                    }
                }
            }

            dealTree(node, null, PRE_LIFE_CIRCLE)

            doReplace(node)
            console.log(`${replaced} of ${countLeaf} has been replaced`)

            let html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head>"
            html += rebuildHTML(node) + '</html>'
            let newNode = await driver.executeScript(function () {
                var data = arguments[0]
                try {
                    document.write(data.html)
                    eval(data.bundle)
                } catch (e) {
                    console.log(e)
                }
                var domTree = require('domTree')
                let node = domTree.createTree(document.body)
                console.log(node)
                return node
            }, {
                    html,
                    bundle
                }
            )
            dealTree(node, null, AFTER_LIFE_CIRCLE)
            console.log(`${countParentDiff} of ${count} 改变了节点关系`)
        }

    } catch (e) {
        console.log(e)
    } finally {
        // await driver.quit();
    }
}