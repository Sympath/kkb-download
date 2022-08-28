function filterName(name) {
    const reg = /[`()（）\r\n[\]]/gim
    name = name.replace(/、/g, '.')
    // 处理空格
    name = name.replace(/ /g, '-')
    return name.replace(reg, '')
}

module.exports = {
    filterName
}