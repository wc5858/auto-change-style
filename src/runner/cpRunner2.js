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
        resolved: false
    },
    {
        site: 'github',
        protocol: 'https',
        root: 'github.com',
        pages: [''],
        resolved: true
    },
    {
        site: 'element',
        protocol: 'https',
        root: 'element.eleme.cn/#/zh-CN/component/',
        pages: [
            'container', 
            'color', 'typography', 'border', 'icon', 'button', 'link', 'radio',
            'checkbox', 'input', 'input-number', 'select', 'cascader', 'switch', 'slider', 'time-picker', 'date-picker',
            'datetime-picker', 'upload', 'rate', 'color-picker', 'transfer', 'form',
            'table', 'tag', 'progress', 'tree', 'pagination', 'badge', 'avatar',
            'alert',
            'loading', 'message', 'message-box', 'notification', 'menu', 'tabs', 'breadcrumb',
            'page-header', 'dropdown',
            'steps',
            'dialog', 'tooltip', 'popover', 'card', 'carousel',
            'collapse', 'timeline', 'divider', 'calendar', 'image', 'backtop', 'infiniteScroll', 'drawer'
        ],
        resolved: false
    },
    // [...document.getElementById('Components$Menu').querySelectorAll('.ant-menu-item a')].map(i => { const arr = i.href.split('/'); return arr[arr.length - 2]; })
    {
        site: 'ant',
        protocol: 'https',
        root: 'ant.design/components/',
        pages: [
            "button-cn",
            "icon-cn", 
            "typography-cn", 
            "grid-cn",
            "layout-cn",
            "affix-cn",
            "breadcrumb-cn",
            "dropdown-cn", "menu-cn", "pagination-cn", "page-header-cn", "steps-cn", 
            "auto-complete-cn", "checkbox-cn", "cascader-cn", "date-picker-cn",
            // "form-cn", 
            "input-number-cn", "input-cn", "mentions-cn", "rate-cn", "radio-cn", "switch-cn", 
            "slider-cn", "select-cn", "tree-select-cn", "transfer-cn", "time-picker-cn", "upload-cn", 
            "avatar-cn", "badge-cn", "comment-cn", "collapse-cn", "carousel-cn", "card-cn", "calendar-cn", 
            "descriptions-cn", "empty-cn", "list-cn", "popover-cn", "statistic-cn", "tree-cn", "tooltip-cn", 
            "timeline-cn", "tag-cn", "tabs-cn",
            // "table-cn",
            "alert-cn", "drawer-cn", "modal-cn", "message-cn", 
            "notification-cn", "progress-cn", "popconfirm-cn", "result-cn", "spin-cn", "skeleton-cn", "anchor-cn", 
            "back-top-cn", "config-provider-cn", "divider-cn", "locale-provider-cn", "mention-cn",
        ],
        resolved: false
    }
]

module.exports = async function () {
    try {
        for (let site of list) {
            if (!site.resolved) {
                const res = {}
                let driver = await new Builder().forBrowser('chrome').build();
                for (let page of site.pages) {
                    console.log(page)
                    await driver.get(site.protocol + '://' + site.root + page);
                    let node = await seg(driver, {
                        pac: 4,
                        returnType: 'wprima',
                        showBox: false
                    });
                    const list = cp.getLeafComponent(node);
                    for (const item of list) {
                        const tag = item.tagSequence.join(' ') + '|' + item.classList.join(' ')
                        if (res[tag]) {
                            // console.log(tag);
                            res[tag].times++;
                        } else {
                            res[tag] = item;
                            res[tag].times = 1;
                        }
                    }
                }
                const resArr = Object.values(res);
                await saveData(`${site.site}-leafComponent-2`, resArr);
            }
        }

    } catch (e) {
        console.log(e)
    } finally {
        // await driver.quit();
    }
}