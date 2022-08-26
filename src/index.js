import fs from 'fs'
import path from 'path'
import axios from 'axios'
import readline from 'readline'
import {
  getPlatForm,
  doShellCmd
} from '../utils/node-api.js';
import * as configs from '../config/index.js';
import { bdypDir } from '../config/cjs-index.js'
import {
  filterName,
  eachObj
} from '../utils/index.js';
import { checkPath, clearDir } from '../utils/node-api.js';
axios.defaults.timeout = 30000;
let courseWrapDir = 'output'; // 课程输出目录
let rootDir = (__dirname || "").replace('/dist', '').replace('/src', '');
let shDir = `${rootDir}/sh`
let allShFilePath = `${shDir}/all.sh`
// 获取生成的sh脚本
let getShFilePath = async (subfix) => {
  let logDir = `${shDir}/${subfix}`
  debugger
  // 先创建一个对应的目录
  await checkPath(logDir)
  return {
    shFilePath: `${logDir}/index.sh`,
    logPath: `${logDir}/normal.log`,
    errLogPath: `${logDir}/err.log`,
  }
};
// 生成压缩包命令
let getTarCmd = (dirName) => `zip -r ${dirName}.zip output/${dirName}`
// 生成百度云盘上传命令
let getBDYPUploadCmd = (dirName, bypyDir) => `bypy upload ${dirName} ${bypyDir}/`
let getBDYPZipUploadCmd = (dirName) => `bypy upload ${dirName}.zip ${bdypDir}/`
// 生成百度云盘创建文件夹命令
let getBDYPDirCmd = (dirName) => `bypy mkdir ${dirName}/`
// 生成删除资源命令
let getRmCmd = (dirName) => `rm -rf ${dirName}`;
let getCommonLogCmd = (log) => `echo '${log}'`;
let getClearLogCmd = (courseDir) => `echo '之前日志情清空,上个完成课程为${courseDir}' > ../all.log`;
let getMailCmd = (bdypDir) => `node src/mail.js --name=${bdypDir}`;
let getMailLog = (bdypDir) => `echo '邮件通知成功：${bdypDir}`;

async function getFFmpeg() {
  // initShFile()
  await clearDir(courseWrapDir)
  await clearDir(shDir)
  // 先授予可执行权限
  await doShellCmd(`chmod 777 ${shDir}`)
  // 记录已经下载成功了的课程
  let cacheManage = {
  };
  if (!Object.entries) {
    Object.entries = function (obj) {
      var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array

      while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      return resArray;
    };
  };
  let configArrs = Object.entries(configs.default)
  let currentConfigArrs = configArrs
  // let currentConfigArrs = configArrs.slice(0, 1)
  // let currentConfigArrs = [[
  //   'config0', {
  //     accessToken:
  //       'f3e43a18d8214d44a6297994f9c3bf5b',
  //     Authorization:
  //       'Bearer pc:6c964e3f67f6a42cd0b6ee94c8943654',
  //     basePath:
  //       './output/百万架构师012期启航班',
  //     cookie: '[{"domain":".kaikeba.com","expirationDate":1976745652,"hostOnly":false,"httpOnly":false,"name":"99f53b614ce96c83_gr_cs1","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"4608945"},{"domain":".kaikeba.com","expirationDate":1976745652,"hostOnly":false,"httpOnly":false,"name":"99f53b614ce96c83_gr_last_sent_cs1","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"4608945"},{"domain":".kaikeba.com","expirationDate":1661387452,"hostOnly":false,"httpOnly":false,"name":"99f53b614ce96c83_gr_last_sent_sid_with_cs1","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"1c26f095-8466-4b78-9904-c2e269aacdf9"},{"domain":".kaikeba.com","expirationDate":1661387452,"hostOnly":false,"httpOnly":false,"name":"99f53b614ce96c83_gr_session_id","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"1c26f095-8466-4b78-9904-c2e269aacdf9"},{"domain":".kaikeba.com","expirationDate":1661387452,"hostOnly":false,"httpOnly":false,"name":"99f53b614ce96c83_gr_session_id_1c26f095-8466-4b78-9904-c2e269aacdf9","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"true"},{"domain":".kaikeba.com","expirationDate":1661861468,"hostOnly":false,"httpOnly":false,"name":"access-edu_online","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"6c964e3f67f6a42cd0b6ee94c8943654"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"deviceId","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"40b1b2ac37917c8b39600f510b8322c9"},{"domain":".kaikeba.com","expirationDate":253402185600,"hostOnly":false,"httpOnly":false,"name":"figui","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"5QF4ZJ9BEYFy8A64"},{"domain":".kaikeba.com","expirationDate":1976745652,"hostOnly":false,"httpOnly":false,"name":"gr_user_id","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"bc2caadc-6322-497f-a974-51b19267399d"},{"domain":".kaikeba.com","expirationDate":1924435967,"hostOnly":false,"httpOnly":false,"name":"grwng_uid","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"e8262a8a-f3f1-4f3f-a2a1-94678b14b9e9"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"Hm_lpvt_156e88c022bf41570bf96e74d090ced7","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"1659936281"},{"domain":".kaikeba.com","expirationDate":1691472280,"hostOnly":false,"httpOnly":false,"name":"Hm_lvt_156e88c022bf41570bf96e74d090ced7","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"1659761074"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_leaveTime","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"1659583098602"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_pageIndex","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"5"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_log_id","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"kmrpYTTzt1cMmTLx7Xh%3A6f4c71e1-2ab9-4319-ae1b-560452b35a76%3A2663cd70-9327-4001-9daa-1d16542b469c"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_view_log_id","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"Vykl5FMqZL3uh7b4sae"},{"domain":".kaikeba.com","expirationDate":1924435967,"hostOnly":false,"httpOnly":false,"name":"kd_user_id","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"3e5e7384-7615-4905-a265-d569fc2d587e"},{"domain":".kaikeba.com","expirationDate":1661472053.953143,"hostOnly":false,"httpOnly":true,"name":"kkb_edu_session","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"eyJpdiI6IjRFd3VYXC93TDBjR1wvbmRMRHArOHdVdz09IiwidmFsdWUiOiJtTzAxaUNMaWIyWm42SktsWUkxc2NOWlNPOWtrSXk2NzdYTVU0SGRJK3d5cE8wMkRtbmRcL0owVDhjSjErdGVSRyIsIm1hYyI6ImYxMzI0ZmI2ZGQ0ZmQ1YzU1NGZkNmM1YTIyODIwNjJmNThhMWVhNmEwOTA1ODg1NDFhNmM2NzZjZDdhNDg5NTgifQ%3D%3D"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"passportUid","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"4608945"},{"domain":".kaikeba.com","expirationDate":7968585652,"hostOnly":false,"httpOnly":false,"name":"sensorsdata2015jssdkcross","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"%7B%22distinct_id%22%3A%224608945%22%2C%22first_id%22%3A%2217a6a1e3a4565e-066dc644b025154-37617201-1296000-17a6a1e3a46b3d%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E5%BC%80%E8%AF%BE%E5%90%A7%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Fother.php%22%2C%22%24latest_utm_source%22%3A%22learnCenter%22%7D%2C%22%24device_id%22%3A%2217a6a1e3a4565e-066dc644b025154-37617201-1296000-17a6a1e3a46b3d%22%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTgyZDI0ZDNhMDg2OTEtMDVkZjdmZTUwN2NiYmYtMWM1MzU2MzUtMTI5NjAwMC0xODJkMjRkM2EwOTEzZGYiLCIkaWRlbnRpdHlfbG9naW5faWQiOiI0NjA4OTQ1In0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%224608945%22%7D%7D"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"ssoToken","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"bb814ff48451af9ba7957099ef0bffbe"},{"domain":".kaikeba.com","hostOnly":false,"httpOnly":false,"name":"tblBackUrl","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":""},{"domain":".kaikeba.com","expirationDate":1933160236,"hostOnly":false,"httpOnly":false,"name":"topic_visitor","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"cfceaa7e-8bed-741b-ff97-fb0f1756a371"},{"domain":".learn.kaikeba.com","expirationDate":7945051959,"hostOnly":false,"httpOnly":false,"name":"sensorsdata2015jssdkcross","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"%7B%22distinct_id%22%3A%224608945%22%2C%22first_id%22%3A%2217a6a1e3a4565e-066dc644b025154-37617201-1296000-17a6a1e3a46b3d%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E5%BC%80%E8%AF%BE%E5%90%A7%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Fother.php%22%2C%22%24latest_utm_source%22%3A%22learnCenter%22%7D%2C%22%24device_id%22%3A%2217a6a1e3a4565e-066dc644b025154-37617201-1296000-17a6a1e3a46b3d%22%7D"},{"domain":"learn.kaikeba.com","expirationDate":253402300799,"hostOnly":true,"httpOnly":false,"name":"client_id","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"76325649"},{"domain":"learn.kaikeba.com","expirationDate":1662890463,"hostOnly":true,"httpOnly":false,"name":"everySentence_12","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"36"},{"domain":"learn.kaikeba.com","expirationDate":1663240025,"hostOnly":true,"httpOnly":false,"name":"everySentence_16","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"26"},{"domain":"learn.kaikeba.com","expirationDate":1663482963,"hostOnly":true,"httpOnly":false,"name":"everySentence_19","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"2"},{"domain":"learn.kaikeba.com","expirationDate":1663977205,"hostOnly":true,"httpOnly":false,"name":"everySentence_25","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"11"},{"domain":"learn.kaikeba.com","expirationDate":1661861480,"hostOnly":true,"httpOnly":false,"name":"everySentence_31","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"10"},{"domain":"learn.kaikeba.com","expirationDate":1662175099,"hostOnly":true,"httpOnly":false,"name":"everySentence_4","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"33"},{"domain":"learn.kaikeba.com","expirationDate":1662353062,"hostOnly":true,"httpOnly":false,"name":"everySentence_6","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"33"},{"domain":"learn.kaikeba.com","expirationDate":1662528382,"hostOnly":true,"httpOnly":false,"name":"everySentence_8","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"9"},{"domain":"learn.kaikeba.com","expirationDate":253402185600,"hostOnly":true,"httpOnly":false,"name":"figId","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"af9da58938464bb99762cc83d5b2d6ab"}]',
  //     course_id:
  //       '214490',
  //     courseName:
  //       '百万架构师012期启航班'
  //   }
  // ]]
  console.log('开始下载');
  let shellTasks = [];
  try {
    await doShellCmd(getBDYPDirCmd(bdypDir))
  } catch (error) {
    console.log('创建百度云盘文件夹失败，失败原因：', error);
  }
  for (let index = 0; index < currentConfigArrs.length; index++) {
    let tasks = [];
    const [key, configInfo] = currentConfigArrs[index];
    const {
      basePath,
      courseName,
      accessToken,
      Authorization,
      cookie,
      course_id
    } = configInfo
    // 百度云盘：创建课程目录
    await doShellCmd(getBDYPDirCmd(`${bdypDir}/${courseName}`))
    // 课程接口，可以获取所有章id
    const courseUrl = `https://weblearn.kaikeba.com/student/courseinfo?course_id=${course_id}&__timestamp=1653898285046`;
    // 章详情接口，可以获取章下对应所有节id
    const chapterUrl = `https://weblearn.kaikeba.com/student/chapterinfo?course_id=${course_id}&chapter_id=`;
    // 节详情，可以获取节下所有对应课程视频地址
    const mediaUrl = 'https://api-vod.baoshiyun.com/vod/v1/platform/media/detail'
    await checkPath(basePath)
    console.log(`${basePath} 生成对应根目录完成 ===== 对应配置文件为 ${key}`);
    const requestConfig = {
      headers:
      {
        Authorization,
        cookie
      }
    }
    // 请求内容
    try {
      // 1. 拼接章对应的课信息接口url，请求
      const { data: { data: courseInfo } } = await axios.get(courseUrl, requestConfig)
      console.log(`一、请求课程${courseName} 对应的章信息成功 =========`);
      const chapterList = courseInfo.chapter_list
      // 课程的结构：课-章-节-课程视频列表 
      // 2. 获取章列表
      let allText = ''
      for (let i = 0; i < chapterList.length; i++) {
        let chapter = chapterList[i]
        // 2.1 获取章名
        const chapterName = `${i + 1}、${chapter.chapter_name}`.replace(/\s/g, '')
        // 2.2 获取章相对课程的相对路径 
        const chapterPath = filterName(`${basePath}/${chapterName}`).replace(/\s/g, '')
        // 创建对应文件夹
        await checkPath(chapterPath)
        let bypyChapterPath = `${bdypDir}/${courseName}/${chapterName}`;
        // 百度云盘：创建章目录 不用创建，云盘默认会创建的
        // await doShellCmd(getBDYPDirCmd(bypyChapterPath))
        // 2.3 拼接章对应的章详情信息接口url
        const url = chapterUrl + chapter.chapter_id;
        try {
          // 2.4 获取章详情
          const { data: { data: chapterInfo } } = await axios.get(url, requestConfig)
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
              // 视频资源
              if (content_type === 3 || content_type === 7) {
                // fs.rmSync(downloadTxtName)
                let contentText = ''
                for (let l = 0; l < contents.length; l++) {
                  const { callback_key: mediaId } = contents[l]
                  // 视频名称
                  let videoName = `${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4`
                  const params = { mediaId, accessToken }
                  try {
                    const reqData = await axios.get(mediaUrl, { ...requestConfig, params })
                    console.log(`  请求视频：${videoName} complete！`);
                    const { data: { data: videoInfo } } = reqData
                    const { playURL } = videoInfo.mediaMetaInfo.videoGroup[0]
                    let [videoUriWithoutToken] = playURL.split('?MtsHlsUriToken')
                    // 避免重复的课程记录
                    if (!cacheManage[videoUriWithoutToken]) {
                      contentText = `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc ${groupPath}/${videoName}`
                      cacheManage[videoUriWithoutToken] = true
                      // 这里是记录当前收集到的命令
                      tasks.push(contentText)
                      tasks.push(`echo '${videoName} complete！'`)
                    }
                  } catch (error) {
                    tasks.push(`echo '视频资源${mediaId}'`)
                    console.error(`视频资源${mediaId}请求失败，${error}`);
                  }
                }

                // fs.writeFileSync(downloadTxtName, contentText, { flag: 'a+' })
              }
              // 静态资源
              if (content_type === 6) {
                for (let l = 0; l < contents.length; l++) {
                  const { name, url } = contents[l]
                  const file = groupPath + '/' + name
                  const writer = fs.createWriteStream(file)
                  try {
                    const response = await axios({ url, responseType: 'stream' })
                    response.data.pipe(writer)
                  } catch (error) {
                    console.error(`课件${file}下载失败，失败原因 ${error}`);
                    tasks.push(`echo '课件${file}下载失败，失败原因 ${error}'`)
                  }
                }
              }
            }
          }
          console.log(`^_^ 章${chapterName}处理完成 ----------`);
          // 以章为维度，收集完上传、就删掉，免得占用空间
          let uploadCmd = getBDYPUploadCmd(chapterPath, `${bypyChapterPath}`)
          // await doShellCmd(uploadCmd)
          tasks.push(uploadCmd)
          tasks.push(`echo '章${chapterName}资源上传！'`)
          console.log(`章${chapterName}资源上传命令收集完成`);
          // 删除资源 
          let rmCmd = getRmCmd(chapterPath)
          // await doShellCmd(rmCmd)
          console.log(`删除章${chapterName}资源命令收集完成`);
          tasks.push(rmCmd)
          tasks.push(`echo '删除章${chapterName}资源完成！'`)
        } catch (error) {
          console.error(`章${chapterName}接口请求失败，失败原因${error}`);
        }
      }
      console.log(`^_^ 课程${courseName}处理完成 ==========`);

    } catch (error) {
      console.error(`课程${course_id}接口请求失败，失败原因${error}`);
    }
    console.log(`${courseName} 课程内视频收集完成`);
    tasks.push(`echo '${courseName} 课程内视频收集完成'`)
    // 生成压缩包
    // tasks.push(getTarCmd(courseName))
    // tasks.push(`echo '生成压缩包完成！'`)
    // 生成百度云盘上传命令
    // if (getPlatForm().isLinux || getPlatForm().isMac) {
    //   tasks.push(getBDYPZipUploadCmd(courseName))
    //   tasks.push(`echo '生成百度云盘上传命令完成！'`)
    // }
    try {
      // if (getPlatForm().isLinux || getPlatForm().isMac) {
      //   // 删除压缩包
      //   tasks.push(getRmCmd(`${courseName}.zip`))
      //   tasks.push(`echo '删除压缩包完成！'`)
      // }
      tasks.push(getClearLogCmd(courseName))
      tasks.push(getMailCmd(bdypDir))
      tasks.push(getMailLog(bdypDir))
      // 将所有的cmd记录进sh文件
      let {
        shFilePath,
        logPath,
        errLogPath
      } = await getShFilePath(key);
      tasks.push(getCommonLogCmd(`脚本文件${shFilePath}生成成功 准备执行`))
      fs.writeFileSync(shFilePath, `${tasks.join('\n')}\n`, { flag: 'a+' })
      console.log(`sh脚本生成完成 ${shFilePath}`);
      // 考虑空间问题，不能同时执行了，先收集
      let doShellCmd = `nohup sh ${shFilePath} 1>${logPath} 2>${errLogPath} &`
      shellTasks.push(doShellCmd)
      // await doShellCmd(doShellCmd)
    } catch (error) {
      console.log('最后环节失败了，失败原因：', error);
    }
  }
  console.log('执行脚本 先保存到', allShFilePath);
  fs.writeFileSync(allShFilePath, `${shellTasks.join('\n')}\n`, { flag: 'a+' })
  // 授予可执行权限
  await doShellCmd(`chmod 777 ${shDir}`)
}
getFFmpeg()