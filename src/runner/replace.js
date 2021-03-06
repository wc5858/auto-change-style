const { Builder, By, Key, until } = require('selenium-webdriver');
const seg = require('../segmentation/index');
const rebuild = require('../buildPage/index');
const saveImg = require('../util/saveImage');
// parser的回调格式和node异步方法的回调格式一致，故可以用promisify
const parser = require('html2hscript');
const util = require('util');
const { readJson, generatorHTML, saveData } = require('../util/localFs');
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
    // 'www.cancer.gov',
    // 'stackoverflow.com',
    // 'www.getuikit.net/docs/pagination.html',
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
            contents.imgs.push({
                src: cur.info.src,
                width: cur.info.css.width,
                height: cur.info.css.height,
            });
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
                const img = source.imgs.shift();
                console.log(JSON.stringify(img))
                cur.info.src = img.src || '';
                cur.info.css.width = img.width || '';
                cur.info.css.height = img.height || '';
                // 取消最大最小宽高度限制
                cur.info.css['max-width'] = 'none';
                cur.info.css['max-height'] = 'none';
                continue;
            } 
        }
    }
    return node;
}

const t1 = 0.45;
const t2 = 0.3;

module.exports = async function (threshold1 = t1, threshold2 = t2) {
    try {
        for (let site of list) {
            let driver = await new Builder().forBrowser('chrome').build();
            const start = new Date();
            let i = 5;
            await driver.get('http://' + site);
            let node = await seg(driver, {
                pac: i,
                returnType: 'wprima',
                showBox: false,
            });
            const list = getLeafComponent(node);
            const data = await readJson('../data/bootstrap-leafComponent-2');
            const map = {}
            const maxs = []
            for (const i of list) {
                let max = 0;
                for (const j of data) {
                    const score = similarity(i, j);
                    if (score > max) {
                        max = score;
                        i.similarity = j;
                    }
                    // 找到合适的就不再继续查找
                    if (max >= threshold1) {
                        break;
                    }
                }
                maxs.push(max);
                // 找到匹配项大于这个阈值时才执行替换
                if (max >= threshold2) {
                    // 执行一次深拷贝
                    const copyNode = JSON.parse(JSON.stringify(i.similarity.node));
                    map[i.node.id] = replaceNodeContents(copyNode, searchNodeContents(i.node));
                }
            }

            // 记录发生过的max值，方便后续优化
            saveData(`log-maxs-${site}-${+new Date()}`, maxs);

            const usedId = []

            function replaceNode(node) {
                if (node.children) {
                    for (let i = 0; i < node.children.length; i++) {
                        const element = node.children[i];
                        if (element.id && map[element.id]) {
                            usedId.push(element.id)
                            node.children[i] = map[element.id];
                        } else {
                            replaceNode(element);
                        }

                    }
                }
            }

            replaceNode(node)

            saveData(`log-usedId-${site}-${+new Date()}`, usedId);

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
