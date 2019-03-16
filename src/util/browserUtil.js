module.exports = {
    getCssAttr(value,type){
        let exp
        switch(type){
            case('px'):
                exp = /^(.+)px$/
                break
            case('color'):
                exp = /^rgb\((.+)\)$/
                break
        }
        if(exp){
            const res = exp.exec(value)
            if(res) {
                return res[1]
            }
        }
        return ''
    }
}