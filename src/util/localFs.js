const fs = require("fs");
const util = require('util');
const fsMkdir = util.promisify(fs.mkdir);
const fsStat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const c = require('child_process');

const dataPath = './data/'

// 目录不存在时创建目录
async function mkdir(path) {
    try {
        return await fsStat(path)
    } catch (e) {
        return await fsMkdir(path)
    }
}

// 保存json数据
async function saveData(name, data, dir) {
    if (dir) {
        mkdir(dir)
    }
    let json = JSON.stringify(data, null, 4)
    return await writeFile((dir || dataPath) + name + '.json', json, 'utf8')
}

async function readJson(file) {
    let data = await readFile(dataPath + file + '.json')
    return JSON.parse(data)
}

async function generatorReport(data) {
    try {
        let html = await readFile('./src/util/report_modal.html')
        html = html.toString().replace('{{ data }}', JSON.stringify(data, null, 4))
        mkdir('./report/')
        const url = `./report/${+new Date()}_report.html`
        await writeFile(url, html, 'utf8')
        c.exec(`start ${url}`)
    } catch(e) {
        console.log(e)
    }
}

async function generatorCompare(data) {
    try {
        let html = await readFile('./src/util/compare_modal.html')
        html = html.toString().replace('{{ data }}', JSON.stringify(data, null, 4))
        mkdir('./compare/')
        const url = `./compare/${+new Date()}_compare.html`
        await writeFile(url, html, 'utf8')
        c.exec(`start ${url}`)
    } catch(e) {
        console.log(e)
    }
}

// 合并多个json数据文件
// 顺便计算权重
// TODO：从功能内聚的角度来讲，最好把计算权重的部分拆分出来，不过权重算法可能要调整
async function mergeData(site) {
    const cssData = {}
    const bgColorData = {}
    function addData(tag, lcss) {
        if (cssData[tag] == undefined) {
            cssData[tag] = new Set()
        }
        cssData[tag].add(lcss)
    }
    try {
        let totalBgColorArea = 0
        let totalBgColorTimes = 0
        let files = await readdir(dataPath + site)
        for (let file of files) {
            let data = await readFile(dataPath + site + '/' + file)
            data = JSON.parse(data)
            for (let tag in data.cssData) {
                for (let i of data.cssData[tag]) {
                    if (i !== "") {
                        addData(tag, i)
                    }
                }
            }
            for (let color in data.bgColorData) {
                let area = data.bgColorData[color].area
                let times = data.bgColorData[color].times
                if(bgColorData[color]){
                    bgColorData[color].area+=area
                    bgColorData[color].times+=times
                } else {
                    bgColorData[color]= {
                        area:area,
                        times:times
                    }
                }
                totalBgColorArea += area
                totalBgColorTimes += times
            }
        }
        for (var k in cssData) {
            cssData[k] = [...cssData[k]]
        }
        for (var k in bgColorData) {
            bgColorData[k].areaRatio = bgColorData[k].area / totalBgColorArea
            bgColorData[k].timesRatio = bgColorData[k].times / totalBgColorTimes
        }
        const data = {
            cssData,
            tagWeight: {},
            cssWeight: {},
            bgColorData
        }
        let count = 0;
        let cssCount = {};
        for (let tag in cssData) {
            count += cssData[tag].length
            for (let i of cssData[tag]) {
                let css = i.split(';')
                for (let style of css) {
                    if (style !== "") {
                        let name = style.split(':')[0]
                        if (cssCount[name] == undefined) {
                            cssCount[name] = 0
                        }
                        ++cssCount[name]
                    }
                }
            }
        }
        for (let tag in cssData) {
            data.tagWeight[tag] = cssData[tag].length / count
        }
        let total = 0;
        for (let name in cssCount) {
            total += cssCount[name]
        }
        for (let name in cssCount) {
            data.cssWeight[name] = cssCount[name] / total
        }
        saveData(site, data)
    } catch (e) {
        console.log(e)
    }

}

module.exports = {
    mkdir,
    mergeData,
    saveData,
    readJson,
    generatorReport,
    generatorCompare,
}