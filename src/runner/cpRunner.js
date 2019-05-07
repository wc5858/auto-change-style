const { Builder } = require('selenium-webdriver');
const { saveData } = require('../util/localFs');

const seg = require('../segmentation/index');
const cp = require('../util/component')
const list = [
    {
        site: 'bootstrap',
        protocol: 'https',
        root: 'getbootstrap.com/docs/4.2/components/',
        pages: ['alerts', 'badge', 'breadcrumb', 'buttons', 'button-group', 'card', 'carousel',
            'collapse', 'dropdowns', 'forms', 'input-group', 'jumbotron', 'list-group', 'media-object',
            'modal', 'navs', 'navbar', 'pagination', 'popovers', 'progress', 'scrollspy', 'spinners', 'toasts', 'tooltips'],
        resolved: true
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
        resolved: true
    }
]

module.exports = async function () {
    try {
        for (let site of list) {
            if (!site.resolved) {
                const map = {}
                let driver = await new Builder().forBrowser('chrome').build();
                for (let page of site.pages) {
                    await driver.get(site.protocol + '://' + site.root + page)
                    let node = await seg(driver, {
                        pac: 2,
                        returnType: 'wprima',
                        showBox: false
                    })
                    cp.getCp(map, node)
                }
                await saveData(`${site.site}-cps`, map)
            }
        }

    } catch (e) {
        console.log(e)
    } finally {
        // await driver.quit();
    }
}