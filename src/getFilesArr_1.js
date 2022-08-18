import nodeApi from '../utils/node-api.js';
import path from 'path';
import fs from 'fs';
let allArrObj = {

}
let courseDir = 'output';
let rootDir = __dirname.replace('/dist', '')
let outDir = path.resolve(rootDir, courseDir)
const files = fs.readdirSync(outDir)
for (let i = 0; i < files.length; i++) {
    const courseName = files[i]
    const stat = fs.lstatSync(dirPath + '/' + courseName)
    if (stat.isDirectory() === true) {
        let coursePath = path.resolve(outDir, courseName);
        let arr = nodeApi.loadFileNameByPath4Ext(coursePath, ['txt'], (item) => {
            item[1].unshift(courseDir)
            return item
        }, [])
        allArrObj[courseName] = arr
    }
}
// 清空下载内容
// deleteFileInDir('/Users/wzyan/Documents/selfspace/ffmpeg-download/Web前端面试涨薪名企培养计划', ['mp4'])
// 生成的数据结构存储的文件地址
let commandArrTxtPath = `${rootDir}/result.js`

let content = `
        export default ${JSON.stringify(allArrObj)}
        `
// 先清空再写
fs.unlinkSync(commandArrTxtPath)
nodeApi.writeFileRecursive(commandArrTxtPath, content)

