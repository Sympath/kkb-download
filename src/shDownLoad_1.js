import ffepngTxtArrObj from '../result.js';
import readline from 'readline'
import fs from 'fs'
import path from 'path'
// import { bdypDir } from '../config/index.js'
import { bdypDir } from '../config/cjs-index.js'
import { exec, execSync } from 'child_process'
import {
    filterName,
    eachObj
} from '../utils/index';
import {
    getPlatForm
} from '../utils/node-api.js';
let cacheManage = {};
let courseDir = 'output'; // 课程输出目录
let rootDir = (__dirname || "").replace('/dist', '').replace('/src', '');
function getVideoUriWithoutToken(videoUri) {
    let videoUriWithoutTokenRege = /[lhd|lud]\/(?<videoUriWithoutToken>[0-9a-zA-Z_]{1,})\.m3u8/
    let matchResult = videoUri.match(videoUriWithoutTokenRege);
    let {
        videoUriWithoutToken
    } = matchResult.groups || {}
    if (!videoUriWithoutToken) {
        console.log(`${videoUri}对应的视频名称获取失败`);
    }
    return videoUriWithoutToken
};
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
// 生成压缩包命令
let getTarCmd = (dirName) => `zip -r ${dirName}.zip ${path.join(courseDir, dirName)}`
// 生成百度云盘上传命令
let getBDYPUploadCmd = (dirName) => `bypy upload ${dirName}.zip ${bdypDir}/`
// 生成删除资源命令
let getRmCmd = (dirName) => `rm -rf ${dirName}`;
let getClearLogCmd = (courseDir) => `echo '之前日志情清空,上个完成课程为${courseDir}' > all.log`;
// 最后生成的sh脚本的位置
let shFilePath = `${rootDir}/download.sh`;
(async () => {
    let initContent = ''
    // 先清空掉文件内容
    if (getPlatForm().isLinux) {
        if (bdypDir) {
            initContent = `bypy upload ${bdypDir}\n`;
        }
    }
    fs.writeFile(shFilePath, initContent, function () { console.log('清空动作 done') })
    let vaiNum = 0
    let ffepngTxtArrs = Object.entries(ffepngTxtArrObj)
    for (let index = 0; index < ffepngTxtArrs.length; index++) {
        let [courseName, ffepngTxtArr] = ffepngTxtArrs[index]
        let tasks = [];
        for (let index = 0; index < ffepngTxtArr.length; index++) {
            const reqInfo = ffepngTxtArr[index];
            let [txtFilePath, dirs] = reqInfo
            // txt文件内包含的所有命令
            let reqs = await processLineByLine(txtFilePath)
            reqs = reqs.filter(req => req)
            for (let j = 0; j < reqs.length; j++) {
                const task = reqs[j];
                let videoNames = {}
                if (task) {
                    // 执行任务
                    let [commandPrefix, videoName] = task.split('aac_adtstoasc');
                    try {
                        let dirName = './' + (dirs.join('/') || '').replace(/\s/g, '') + '/';
                        // 处理下生成的命令文件名
                        let handledVideoName = (videoName || "").replace(/\s/g, '').replace('./', dirName)
                        if (videoNames[handledVideoName]) {
                            videoNames[handledVideoName] = videoNames[handledVideoName] + 1
                            handledVideoName = `${handledVideoName}-${videoNames[handledVideoName]}`
                        } else {
                            videoNames[handledVideoName] = 1
                        }
                        console.log('开始-----：', videoName)
                        // 处理下目录问题
                        let command = `${commandPrefix} aac_adtstoasc ${filterName(handledVideoName)}`;
                        debugger
                        // 避免重复的命令记录
                        let videoUriWithoutToken = getVideoUriWithoutToken(command)
                        if (!cacheManage[videoUriWithoutToken]) {
                            tasks.push(command)
                            tasks.push(`echo ${handledVideoName} complete！`)
                            cacheManage[videoUriWithoutToken] = true
                        }
                    } catch (error) {
                        console.log('任务收集时的错误', error);
                    }
                    // let handleCommand = `
                    //     vai${vaiNum++}="${dirName}"
                    //     if [ ! -d "${dirName}" ];then

                    //     mkdir $vai${vaiNum}
                    // fi
                    // ${command}
                    // `

                    // return handleCommand
                }
            }
            // 这里代表对应的txt可以已经下载完了，将文件后缀改成.cache，避免重传时二次读取了
            tasks.push(`mv ${txtFilePath} ${txtFilePath.replace('.txt', '-cache.txt')}`)
        }
        tasks.push(`echo '${courseName} 课程内视频收集完成，开始上传动作！'`)
        // 生成压缩包
        tasks.push(getTarCmd(courseName))
        tasks.push(`echo '生成压缩包完成！'`)
        // 生成百度云盘上传命令
        if (getPlatForm().isLinux) {
            tasks.push(getBDYPUploadCmd(courseName))
        }
        tasks.push(`echo '生成百度云盘上传命令完成！'`)
        // 删除资源 
        tasks.push(getRmCmd(`${courseDir}/${courseName}`))
        tasks.push(`echo '删除资源完成！'`)
        if (getPlatForm().isLinux) {
            // 删除压缩包
            tasks.push(getRmCmd(`${courseName}.zip`))
            tasks.push(`echo '删除压缩包完成！'`)
        }
        tasks.push(getClearLogCmd(courseName))
        // fs.writeFileSync(`${rootDir}/tasks.txt`, `${tasks.join('\n')}\n`, { flag: 'a+' })
        fs.writeFileSync(shFilePath, `${tasks.join('\n')}\n`, { flag: 'a+' })
    }
    // debugger
    // if (getPlatForm().isLinux) {
    //     exec(`nohup sh ${shFilePath} &`)
    // } else {
    //     // 执行脚本
    //     exec(`sh ${shFilePath}`)
    // }
})()