// 用于下载单个视频，只要去修改config/download-single即可
const fs = require("fs");
const path = require("path");
const {
    m3u8Url,
    courseName, // 视频名称
    bypyFullDir, // 云盘地址
    bypyDir, // 用户名
} = require('../config/download-single.js');
const { doShellCmd } = require("../utils/cjs/node-api-cjs.js");
const { filterName } = require("../utils/cjs/index.js");
const m3u8ToMp4 = require("./m3u8ToMp4.js"); // 引入核心模块，注意路径
const converter = new m3u8ToMp4();
// 生成百度云盘上传命令
let getBDYPUploadCmd = (dirName, bypyDir) => `bypy upload ${dirName} ${bypyDir}/`
let getMailCmd = (bdypDir, courseName) => `node src/mail.js --name=${bdypDir} --courseName=${courseName}`;
/** 下载m3u8视频
 * 
 * @param {*} opt 
 * {
 * url：u3u8地址
 * output 文件输出目录
 * filename 文件名称
 * }
 */
async function downloadMedia(opt) {
    let url = opt.url
    let output = opt.output || 'video';
    let filename = opt.filename + '.mp4' || 'video.mp4';

    if (!fs.existsSync(output)) {
        fs.mkdirSync(output, {
            recursive: true,
        });
    }
    try {
        console.log("准备下载...");

        await converter
            .setInputFile(url)
            .setOutputFile(path.join(output, filename))
            .start();

        console.log("下载完成!");
        // 返回视频地址
        return path.join(output, filename)
    } catch (error) {
        throw new Error("哎呀，出错啦! 检查一下参数传对了没喔。", error);
    }
}
(async () => {
    let handledCourseName = filterName(courseName); // 视频名称
    let handledBypyFullDir = filterName(`${bypyDir}/${bypyFullDir}`); // 云盘地址
    let handledBypyDir = filterName(bypyDir); // 用户名称
    // 开始下载
    let localUrl = await downloadMedia({
        // 测试视频，如果链接失效的话就自己找一个
        url: m3u8Url,
        filename: handledCourseName,
        output: './video'
    });
    // 开始上传云盘
    await doShellCmd(getBDYPUploadCmd(localUrl), handledBypyFullDir)
    // 邮件通知
    await doShellCmd(getMailCmd(handledBypyDir, handledCourseName))
    console.log(`邮件通知成功，可访问地址确定：https://pan.baidu.com/disk/main?from=homeFlow#/index?category=all&path=%2Fapps%2Fbypy%2F${handledBypyFullDir}`);
})()
