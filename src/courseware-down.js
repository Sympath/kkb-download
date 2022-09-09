import * as configs from '../config/index.js';
// import * as configs from './index-debug-config.js';  // 用于debug
// 第四版：采用先下载静态资源，上传到云端；然后再直接将本地视频上传到云端 ====== 以课程为维度进行静态资源上传
import * as fs from 'fs'
import {
  getPlatForm,
  doShellCmd
} from '../utils/node-api.js';
import * as api from './api/index.js';
import { bdypDir, downType } from '../config/cjs-index.js'
import {
  filterName
} from '../utils/index.js';
import {
  bdypHost,
  getBDYPUploadCmd,
  getBDYPLink,
  getBDYPDirCmd
} from '../utils/bypy-util.js';
import polify from '../utils/polify.js';
import {
  courseWrapDir,
  shDir,
  finishCourseTxtPath,
  allShDir,
  allShFilePath,
  shellTxtPath,
  serverRepo
} from './vari.js';
import { checkPath, clearDir } from '../utils/node-api.js';
// 获取生成的sh脚本
let getShFilePath = async (subfix) => {
  let logDir = `${shDir}/${subfix}`
  // 先创建一个对应的目录
  await checkPath(logDir)
  return {
    shFilePath: `${logDir}/index.sh`,
    logPath: `${logDir}/normal.log`,
    errLogPath: `${logDir}/err.log`,
  }
};
// 生成删除资源命令
let getRmCmd = (dirName) => `rm -rf ${dirName}`;
let getCommonLogCmd = (log) => `echo '${log}'`;
let getClearLogCmd = (courseDir) => `echo '之前日志情清空,上个完成课程为${courseDir}' > ../all.log`;
let getMailCmd = (bdypDir, courseName) => `node src/mail.js --name=${bdypDir} --courseName=${courseName}`;
let getMailLog = (bdypDir) => `echo '邮件通知成功：${bdypDir}'`;
// 生成已完成的课程记录
let recordFinishCourse = (courseName, owner, configName, link) => {
  let record = `${courseName}======${owner}=====${configName}====${link}`
  return `echo "${record}" >> ${finishCourseTxtPath}`
}
// 记录常见命令
let recordCommonCmd = (cmd, annotation) => {
  let record = `${cmd}======${annotation}`
  return `echo "${record}" >> ${shellTxtPath}`
}
let isDownCourseIds = false;
if (downType === 'down-courseIds') {
  isDownCourseIds = true
}
// 处理一些特性实现问题
polify();
async function getFFmpeg() {
  // initShFile()
  // 清空一些相关目录
  await clearDir(courseWrapDir, shDir, allShDir)
  // 先授予可执行权限
  await doShellCmd(`chmod 777 ${shDir}`)
  // 记录已经下载成功了的课程
  let cacheManage = {
  };
  let configArrs = Object.entries(configs.default)
  let currentConfigArrs = configArrs
  console.log('开始下载');
  let shellTasks = [];// 每个shellTasks都有一些信息 如杀死进程的命令、删除对应文件的命令
  // try {
  //   await doShellCmd(getBDYPDirCmd(bdypDir))
  // } catch (error) {
  //   console.log('创建百度云盘文件夹失败，失败原因：', error);
  // }
  for (let index = 0; index < currentConfigArrs.length; index++) {
    const [key, configInfo] = currentConfigArrs[index];
    const {
      basePath,
      courseName,
      Authorization,
      cookie,
      course_id
    } = configInfo
    await checkPath(basePath)
    console.log(`${basePath} 生成对应根目录完成 ===== 对应配置文件为 ${key}`);
    // 请求的基础信息要先初始化好
    api.kkb.initConfig(Authorization, cookie)
    // 请求内容
    try {
      // 1. 拼接章对应的课信息接口url，请求
      const { data: courseInfo } = await api.kkb.getCourseInfo(course_id);
      console.log(`一、请求课程${courseName} 对应的章信息成功 =========`);
      const chapterList = courseInfo.chapter_list
      // 课程的结构：课-章-节-课程视频列表 
      // 2. 获取章列表
      for (let i = 0; i < chapterList.length; i++) {
        let chapter = chapterList[i]
        // 2.1 获取章名
        const chapterName = filterName(`${i + 1}.${chapter.chapter_name}`.replace(/\s/g, ''))
        // 2.2 获取章相对课程的相对路径 
        const chapterPath = filterName(`${basePath}/${chapterName}`).replace(/\s/g, '')
        // 创建对应文件夹
        await checkPath(chapterPath)
        // 百度云盘：创建章目录 不用创建，云盘默认会创建的
        // await doShellCmd(getBDYPDirCmd(bypyChapterPath))
        // 2.3 拼接章对应的章详情信息接口url
        try {
          // 2.4 获取章详情
          const { data: chapterInfo } = await api.kkb.getChapterInfo(course_id, chapter.chapter_id)
          console.log(`二、请求章${chapterName}详情信息成功 ----------`);
          // 3 处理章下对应小节信息
          const sectionList = chapterInfo.section_list
          for (let j = 0; j < sectionList.length; j++) {
            const groupInfo = sectionList[j].group_list[0]
            let name = filterName(groupInfo.group_name.replace(/\//g, '-'))
            // 3.1 小节名
            const groupName = `${j + 1}、${name}`.replace(/\s/g, '')
            // 3.2 小节相对路径
            const groupPath = filterName(`${chapterPath}/${groupName}`).replace(/\s/g, '')
            // 云盘上传地址
            let bypyChapterPath = filterName(`${bdypDir}/${courseName}/${chapterName}/${groupName}`).replace(/\s/g, '');
            await checkPath(groupPath)

            const contentList = groupInfo.content_list
            // 4 资源的下载分为两类：
            // 4.1 pdf、html等静态资源文档：直接stream请求去进行下载
            // 4.2 视频：每个视频是m3u8类型文件，我们需要的是mp4文件，这里通过ffmpeg实现【请求m3u8 - 转本地mp4】，以txt文件作为载体存储小节对应所有课程视频ffmpeg命令
            // const downloadTxtName = filterName(groupPath + '/' + name + '.txt').replace(/\s/g, '')
            for (let k = 0; k < contentList.length; k++) {
              // if(k) break
              // 每节课程下面会有多个视频和多个课件，需要加后缀进行下载
              const { content: contents, content_type, content_title } = contentList[k]
              // 静态资源
              if (content_type === 6) {
                for (let l = 0; l < contents.length; l++) {
                  const { name, url } = contents[l]
                  const file = groupPath + '/' + name
                  try {
                    await api.kkb.getStaticFile(url, file)
                  } catch (error) {
                    console.error(`课件${file}下载失败，失败原因 ${error}`);
                  }
                }
              }
            }
          }
          console.log(`^_^ 章${chapterName}处理完成 ----------`);
        } catch (error) {
          console.error(`章${chapterName}接口请求失败，失败原因${error}`);
        }
      }
      console.log(`^_^ 课程${courseName}处理完成 ==========`);

    } catch (error) {
      console.error(`课程${course_id}接口请求失败，失败原因${error}`);
    }
    console.log(`${courseName} 课程内视频收集完成`);
  }
  console.log('执行脚本 先保存到', allShFilePath);
  // 杀死当前用户所有执行脚本的命令
  let killAllShCmd = `ps -ef | grep ${bdypDir}/repo/sh/config | grep -v grep | awk '{print $2}' | xargs kill -9`
  doShellCmd(recordCommonCmd(killAllShCmd, '杀死当前用户所有执行脚本的命令'))
  doShellCmd(recordFinishCourse('课程名称', '拥有者', '访问链接', '对应配置'))
  try {
    // // 将静态资源上传到云盘
    await doShellCmd(getBDYPUploadCmd(courseWrapDir, bdypDir))
  } catch (error) {
    console.log(error, '上传云盘错误');
  }
  // 这里把生成的output清空一下 避免已经上传好的静态资源占用体积
  // await clearDir(courseWrapDir)
  // 最后，记得去执行生成好的sh文件
}
getFFmpeg()

