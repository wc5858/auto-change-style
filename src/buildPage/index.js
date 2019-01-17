// 根据传入的virtual-dom重新构建页面
module.exports = async function (driver,node,site) {
    
    return await driver.executeScript(function () {
        // 这部分代码是在浏览器里面执行的，只能通过executeScript传递参数进去执行
        data = arguments[0]
        try {
            console.log(data.node)
            location.href = "about:blank;"
            document.replaceChild(data.node,document.getElementsByTagName('html')[0])
        } catch(e) {
            console.log(e)
        }
        return 1
    }, {
            node,
        }
    )
}