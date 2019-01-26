const fs = require("fs");
const util = require('util');
const fsMkdir = util.promisify(fs.mkdir);
const fsStat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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
async function saveData(name, data) {
    let json = JSON.stringify(data, null, 4)
    return await writeFile(dataPath + name + '.json', json, 'utf8')
}

// 合并多个json数据文件
// 顺便计算权重
// TODO：从功能内聚的角度来讲，最好把计算权重的部分拆分出来，不过权重算法可能要调整
async function mergeData(site) {
    const cssData = {}
    function addData(tag, lcss) {
        if (cssData[tag] == undefined) {
            cssData[tag] = new Set()
        }
        cssData[tag].add(lcss)
    }
    try {
        let files = await readdir(dataPath + site)
        for (let file of files) {
            let data = await readFile(dataPath + site + '/' + file)
            data = JSON.parse(data)
            for (let tag in data) {
                for (let i of data[tag]) {
                    if (i !== "") {
                        addData(tag, i)
                    }
                }
            }
        }
        for (var k in cssData) {
            cssData[k] = [...cssData[k]]
        }
        const data = {
            cssData,
            tagWeight: {},
            cssWeight: {},
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
    saveData
}