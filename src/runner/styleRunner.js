const { Builder, By, Key, until } = require('selenium-webdriver');
const getStyle = require('../getStyle/index');
const rebuild = require('../buildPage/index');
// parser的回调格式和node异步方法的回调格式一致，故可以用promisify
const parser = require('html2hscript');
const util = require('util');
const promisifiedParser = util.promisify(parser);
const { mkdir, mergeData, saveData } = require('../util/localFs');

const h = require('virtual-dom/h');
const createElement = require("virtual-dom/create-element");

const list = [
    {
        site: 'bootstrap',
        protocol: 'https',
        root: 'getbootstrap.com/docs/4.2/components/',
        pages: ['alerts', 'badge', 'breadcrumb', 'buttons', 'button-group', 'card', 'carousel',
            'collapse', 'dropdowns', 'forms', 'input-group', 'jumbotron', 'list-group', 'media-object',
            'modal', 'navs', 'navbar', 'pagination', 'popovers', 'progress', 'scrollspy', 'spinners', 'toasts', 'tooltips'],
        resolved: true
    }
]

const parallel = false

module.exports = async function () {
    try {
        for (let site of list) {
            if (!site.resolved) {
                await mkdir('./data/' + site.site)
                if (parallel) {
                    // 并行写法，会很卡，但是效率比较高
                    site.pages.forEach(async page => {
                        let driver = await new Builder().forBrowser('chrome').build()
                        await driver.get(site.protocol + '://' + site.root + page)
                        let data = await getStyle(driver)
                        data = JSON.parse(data)
                        await saveData(site.site + '/' + page, data)
                        driver.quit()
                    })
                } else {
                    // 串行写法
                    let driver = await new Builder().forBrowser('chrome').build();
                    for (let page of site.pages) {
                        await driver.get(site.protocol + '://' + site.root + page)
                        let data = await getStyle(driver)
                        data = JSON.parse(data)
                        await saveData(site.site + '/' + page, data)
                    }
                }
            }
            mergeData(site.site)

        }

    } catch (e) {
        console.log(e)
    }
    finally {
        // await driver.quit();
    }
}