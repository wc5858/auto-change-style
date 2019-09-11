const { Builder } = require('selenium-webdriver');
const { saveData } = require('../util/localFs');

// https://www.alexa.com/topsites/category 在控制台执行下面的语句可以获取目录内容
// Array.from($('#alx-content > div > section > div.row-fluid.TopSites.Alexarest > section.page-product-content.summary > span > span > div > div > div > div > ul > li')).map(i => i.innerText.replace(/\s/g, '_'))
// 排除了"Adult"、"Games"、"World"
const categories = [
    // "Arts",
    // "Business",
    // "Computers",
    // "Health",
    "Home",
    // "Kids_and_Teens",
    // "News",
    "Recreation",
    // "Reference",
    // "Regional",
    // "Science",
    // "Shopping",
    // "Society",
    // "Sports",
]

module.exports = async function () {
    categories.forEach(async i => {
        const driver = await new Builder().forBrowser('chrome').build()
        try {
            await driver.get(`https://www.alexa.com/topsites/category/Top/${i}`)
            const sites = await driver.executeScript(() =>
                Array.from(document.querySelectorAll('.site-listing > .DescriptionCell > p > a')).map((i, idx) => ({ url: i.innerText, rank: idx + 1 })))
                
            for (const j of sites) {
                try {
                    const promise = new Promise(resolve => {
                        timer = setTimeout(resolve, 30000)
                    })
                    const now = new Date();
                    // await Promise.race([
                    //     promise,
                    //     driver.get('http://' + j.url) 
                    // ])
                    // const loadTime = new Date() - now
                    // clearTimeout(timer)
                    // driver.quit()
                    // j.loadTime = loadTime >= 29998 ? 'timeout' : loadTime
                    await driver.get('http://' + j.url)
                    j.loadTime = new Date() - now
                    console.log(j.loadTime)
                } catch (e) {
                    console.log(e)
                    j.loadTime = 'error'
                }
            }
            saveData(i, sites, './sites/')
        } catch (e) {
            console.log(e)
        } finally {
            driver.quit()
        }
    })
}