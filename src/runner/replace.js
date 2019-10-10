const { Builder, By, Key, until } = require('selenium-webdriver');
const seg = require('../segmentation/index');
const rebuild = require('../buildPage/index');
const saveImg = require('../util/saveImage');
// parser的回调格式和node异步方法的回调格式一致，故可以用promisify
const parser = require('html2hscript');
const util = require('util');
const { readJson, generatorHTML } = require('../util/localFs');
const { rebuildHTML } = require('../util/domTree');
const { getLeafComponent } = require('../util/component');
const { similarity } = require('../util/htmlSimilarity');
const promisifiedParser = util.promisify(parser);

const h = require('virtual-dom/h');
const createElement = require("virtual-dom/create-element");

const list = [
    // 'www.google.com',
    // 'my.vultr.com',
    //'www.bilibili.com',
    'github.com',
    'www.cancer.gov',
    'stackoverflow.com',
    // 'news.ycombinator.com'
];

function searchNodeContents(node) {
    const satck = [node];
    const contents = {
        texts: [],
        imgs: [],
    };
    while(satck.length > 0) {
        let cur = satck.pop();
        if (cur.type === 'text' && cur.content) {
            contents.texts.push(cur.content);
            continue;
        }
        if (!cur.info) {
            continue;
        }
        if (cur.info.tag === 'IMG') {
            contents.imgs.push(cur.info.src);
            continue;
        }
        if (cur.children) {
            satck.push(...cur.children);
        }
    }
    return contents;
}
function replaceNodeContents(node, source) {
    const satck = [node];
    while(satck.length > 0) {
        let cur = satck.pop();
        if (!cur.info) {
            continue;
        }
        if (cur.children) {
            satck.push(...cur.children);
        } else {
            if (cur.type === 'text') {
                cur.content = source.texts.shift() || '';
                continue;
            }
            if (!cur.info) {
                continue;
            }
            if (cur.info.tag === 'IMG') {
                cur.info.src = source.imgs.shift() || '';
                continue;
            } 
        }
    }
    return node;
}

module.exports = async function () {
    try {
        for (let site of list) {
            let driver = await new Builder().forBrowser('chrome').build();
            const start = new Date();
            let i = 5;
            await driver.get('https://' + site);
            let node = await seg(driver, {
                pac: i,
                returnType: 'wprima',
                showBox: false,
            });
            const list = getLeafComponent(node);
            const data = await readJson('../data/element-leafComponent-2');
            const map = {}
            for (const i of list) {
                let max = 0;
                for (const j of data) {
                    const score = similarity(i, j);
                    if (score > max) {
                        max = score;
                        i.similarity = j;
                    }
                }
                map[i.node.id] = replaceNodeContents(i.similarity.node, searchNodeContents(i.node))
            }

            function replaceNode(node) {
                if (node.children) {
                    for (let i = 0; i < node.children.length; i++) {
                        const element = node.children[i];
                        if (element.id && map[element.id]) {
                            node.children[i] = map[element.id];
                        } else {
                            replaceNode(element);
                        }

                    }
                }
            }

            replaceNode(node)

            let html = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head>"
            html += rebuildHTML(node) + '</html>'

            await generatorHTML(html);
            const time = new Date() - start;
            console.log(time / 1000 / 60);
        }

    } catch (e) {
        console.log(e);
    }
    finally {
        // await driver.quit();
    }
}
