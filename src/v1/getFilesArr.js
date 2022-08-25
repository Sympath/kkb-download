import {
    loadFileNameByPath4Ext,
    writeFileRecursive
} from '../../utils/node-api.js';
import path from 'path';
import * as config from '../../config/index.js';
import { exec, execSync } from 'child_process'
const {
    basePath
} = config.default
let rootDir = __dirname.replace('/dist', '').replace('/src', '')

export default function getFilesArr(basePath) {
    let arr = loadFileNameByPath4Ext(path.resolve(rootDir, basePath), ['txt'])
    return arr
    // 清空下载内容
    // deleteFileInDir('/Users/wzyan/Documents/selfspace/ffmpeg-download/Web前端面试涨薪名企培养计划', ['mp4'])
    // 打印对应下载源
    let content = `
    export default ${JSON.stringify(arr)}
    `
    writeFileRecursive(`${rootDir}/result.js`, content).then(() => {

        exec('node ./shDownLoad.js')
    })
}

