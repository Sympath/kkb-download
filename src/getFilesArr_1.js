import {
    loadFileNameByPath4Ext,
    writeFileRecursive
} from '../utils/node-api.js';
import path from 'path';
import fs from 'fs';
import { exec, execSync } from 'child_process'
import * as configs from '../config/index.js';
import {
    filterName,
    eachObj
} from '../utils/index.js';
import { checkPath } from '../utils/node-api.js';
let allArrObj = {

}
let courseDir = 'output';
let outRootDir = ''
eachObj(configs.default, async (key, configInfo) => {
    const {
        basePath,
        courseName,
        accessToken,
        Authorization,
        cookie,
        course_id,
    } = configInfo
    debugger
    let rootDir = __dirname.replace('/dist', '')
    debugger
    outRootDir = rootDir
    let arr = loadFileNameByPath4Ext(path.resolve(rootDir, basePath), ['txt'], (item) => {
        item[1].unshift(courseDir)
        return item
    }, [])
    allArrObj[courseName] = arr
})
// 清空下载内容
// deleteFileInDir('/Users/wzyan/Documents/selfspace/ffmpeg-download/Web前端面试涨薪名企培养计划', ['mp4'])
// 生成的数据结构存储的文件地址
let commandArrTxtPath = `${outRootDir}/result.js`

let content = `
        export default ${JSON.stringify(allArrObj)}
        `
// 先清空再写
fs.unlinkSync(commandArrTxtPath)
writeFileRecursive(commandArrTxtPath, content)

