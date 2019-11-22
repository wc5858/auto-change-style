const { Builder, By, Key, until } = require("selenium-webdriver");
const change = require("../changeStyle/index");
const saveImg = require("../util/saveImage");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
const getJsData = require("../util/getJsData");

const list = [
  // 'www.google.com',
  // 'my.vultr.com',
  //'www.bilibili.com',
  "github.com"
  //'stackoverflow.com',
  // 'news.ycombinator.com'
];

module.exports = async function() {
  let driver = await new Builder().forBrowser("chrome").build();
  // 注意这里使用getJsData不用getBundle，两者机制有区别
  let bundle = getJsData(["./lib/tinyColor/tinycolor-min"], "tinyColor");
  try {
    for (let site of list) {
      await driver.get(
        "file:///C:/Users/%E7%8E%8B%E9%A9%B0%E7%8C%8B/Documents/GitHub/auto-change-style/html/github_element.html"
      );
      await driver.executeScript(
        function() {
          let data = arguments[0];
          eval(data.bundle);
          // 这部分代码是在浏览器里面执行的，只能通过executeScript传递参数进去执行
          /*
                    规则1：宽度溢出，
                 */
          function isElement(node) {
            return node ? node.nodeType == (Node.ELEMENT_NODE || 1) : false;
          }
          function dealTree(node) {
            // 颜色修复
            if (isElement(node)) {
              node.style["-webkit-text-fill-color"] = "unset";
              const bgColor = tinycolor(getComputedStyle(node).backgroundColor);
              const color = tinycolor(getComputedStyle(node).color);
              if (
                !tinycolor.isReadable(bgColor, color, {
                  level: "AA",
                  size: "large"
                })
              ) {
                node.style.color = (bgColor.isDark()
                  ? color.lighten(50)
                  : color.darken(50)
                ).toRgbString();
              }
            }
            // 溢出修复
            if (!node.childNodes) {
              return;
            }
            setTimeout(() => {
              const {
                scrollWidth,
                scrollHeight,
                clientWidth,
                clientHeight
              } = node;
              //console.log(node.tagName, scrollWidth, scrollHeight, clientWidth, clientHeight)
              if (scrollWidth && clientWidth && scrollWidth > clientWidth) {
                let l = 0;
                let flag = false;
                // 找到是哪个子元素发生的溢出
                for (const i of node.childNodes) {
                  //console.log(i.tagName, i.clientWidth, clientWidth)
                  if (i.clientWidth > clientWidth) {
                    if (!i.innerText) {
                      continue;
                    }
                    const l = i.innerText.length;
                    // if (i.style.display === 'block') {
                    // 块元素判断是否真实发生文本溢出
                    //console.log(l * parseInt(getComputedStyle(i).fontSize), clientWidth)
                    if (
                      l * parseInt(getComputedStyle(i).fontSize) >
                      clientWidth
                    ) {
                      flag = true;
                      i.style.width = "auto";
                      i.style.height = "auto";
                    }
                    // }
                  }
                }
                if (flag) {
                  node.style.height = "auto";
                } else {
                  if (node.tagName !== "BODY") {
                    node.style.overflow = "hidden";
                  }
                }
              }
              if (scrollHeight && clientHeight && scrollHeight > clientHeight) {
                // 只有单个文本节点且文本节点
                if (
                  node.childNodes &&
                  node.childNodes.length === 1 &&
                  node.childNodes[0].nodeType === (Node.TEXT_NODE || 3)
                ) {
                  // 文本节点内容量有限
                  if (scrollHeight < 2 * clientHeight) {
                    node.style.width = "auto";
                    return;
                  }
                }
                // console.log(node)
                if (scrollHeight > 6 * clientHeight) {
                  node.style.overflow = "hidden";
                } else {
                  node.style.height = "auto";
                }
              }
            }, 0);
            for (const element of node.childNodes) {
              dealTree(element);
            }
          }
          dealTree(document.body);
          return null;
        },
        {
          bundle
        }
      );
    }
  } catch (e) {
    console.log(e);
  } finally {
    // await driver.quit();
  }
};
