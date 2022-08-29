import readline from 'readline'
import fs from 'fs'
import path from 'path'
import {
    filterName
} from '../utils/index.js';
import * as config from '../config/index.js';
const {
    basePath,
} = config.default
let rootDir = __dirname.replace('/dist', '').replace('/src', '')

async function processLineByLine(filePath) {
    const array = []
    // 如果不想手动输入全部路径
    // 需要注意https://github.com/nodejs/help/issues/2907
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // 注意：使用 crlfDelay 选项
    // 将 input.txt 中的所有 CR LF ('\r\n') 实例识别为单个换行符。
    for await (const line of rl) {
        // input.txt 中的每一行都将在此处作为 `line` 连续可用。
        //   if (line.length > 10) {
        //     array.push(line)
        //   }
        array.push(line)

        // console.log(`Line from file: ${line}`);
    }
    return array;
    //   console.log(array.length);
}
let shDownLoad = (async (ffepngTxtArr) => {
    let vaiNum = 0
    ffepngTxtArr.forEach(
        async (reqInfo) => {
            let [txtFilePath, dirs] = reqInfo
            // txt文件内包含的所有命令
            let reqs = await processLineByLine(txtFilePath)
            reqs = reqs.filter(req => req)
            let tasks = reqs.map(task => {
                let videoNames = {}
                if (task) {
                    // 执行任务
                    let [commandPrefix, videoName] = task.split('aac_adtstoasc');
                    let dirName = `./${dirs.join('/').replace(/\s/g, '')}/`;
                    // 处理下生成的命令文件名
                    let handledVideoName = videoName.replace(/\s/g, '').replace('./', dirName)
                    if (videoNames[handledVideoName]) {
                        videoNames[handledVideoName] = videoNames[handledVideoName] + 1
                        handledVideoName = `${handledVideoName}-${videoNames[handledVideoName]}`
                    } else {
                        videoNames[handledVideoName] = 1
                    }
                    console.log('开始-----：', videoName)
                    // 处理下目录问题
                    let command = filterName(`${commandPrefix} aac_adtstoasc ${handledVideoName}`);
                    return command
                    let handleCommand = `
                        vai${vaiNum++}="${dirName}"
                        if [ ! -d "${dirName}" ];then

                        mkdir $vai${vaiNum}
                    fi
                    ${command}
                    `

                    // return handleCommand
                }
            })
            tasks = [...new Set(tasks)]
            fs.writeFileSync(`${path.resolve(rootDir, basePath)}/download.sh`, `${tasks.join('\n')}`, { flag: 'a+' })
        })
})
export default shDownLoad