import fs from 'fs'
import path from 'path'
import axios from 'axios'
import readline from 'readline'
import * as configs from '../config/index.js';
import {
  filterName,
  eachObj
} from '../utils/index.js';
import { checkPath } from '../utils/node-api.js';

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
// 记录已经下载成功了的课程
let cacheManage = {
};
eachObj(configs.default, async (key, configInfo) => {

  const {
    basePath,
    courseName,
    accessToken,
    Authorization,
    cookie,
    course_id
  } = configInfo
  // 课程接口，可以获取所有章id
  const courseUrl = `https://weblearn.kaikeba.com/student/courseinfo?course_id=${course_id}&__timestamp=1653898285046`;
  // 章详情接口，可以获取章下对应所有节id
  const chapterUrl = `https://weblearn.kaikeba.com/student/chapterinfo?course_id=${course_id}&chapter_id=`;
  // 节详情，可以获取节下所有对应课程视频地址
  const mediaUrl = 'https://api-vod.baoshiyun.com/vod/v1/platform/media/detail'
  await checkPath(basePath)
  const requestConfig = {
    headers:
    {
      Authorization,
      cookie
    }
  }
  try {
    // 1. 拼接章对应的课信息接口url，请求
    const { data: { data: courseInfo } } = await axios.get(courseUrl, requestConfig)
    const chapterList = courseInfo.chapter_list
    console.log(chapterList);
    // 课程的结构：课-章-节-课程视频列表 
    // 2. 获取章列表
    let allText = ''
    console.log(chapterList.length);
    for (let i = 0; i < chapterList.length; i++) {
      let chapter = chapterList[i]
      // 2.1 获取章名
      const chapterName = `${i + 1}、${chapter.chapter_name}`.replace(/\s/g, '')
      // 2.2 获取章相对课程的相对路径 
      const chapterPath = filterName(`${basePath}/${chapterName}`).replace(/\s/g, '')
      // 创建对应文件夹
      console.log(await checkPath(chapterPath))
      // 2.3 拼接章对应的章详情信息接口url
      const url = chapterUrl + chapter.chapter_id
      try {
        // 2.4 获取章详情
        const { data: { data: chapterInfo } } = await axios.get(url, requestConfig)
        // console.log(chapterInfo);
        // 3 处理章下对应小节信息
        const sectionList = chapterInfo.section_list
        for (let j = 0; j < sectionList.length; j++) {

          // console.log(sectionList[0].group_list[0].content_list[0].content.length);
          const groupInfo = sectionList[j].group_list[0]
          let name = filterName(groupInfo.group_name.replace(/\//g, '-'))
          // 3.1 小节名
          const groupName = `${j + 1}、${name}`.replace(/\s/g, '')
          // 3.2 小节相对路径
          const groupPath = filterName(`${chapterPath}/${groupName}`).replace(/\s/g, '')
          console.log(await checkPath(groupPath))

          const contentList = groupInfo.content_list
          // 4 资源的下载分为两类：
          // 4.1 pdf、html等静态资源文档：直接stream请求去进行下载
          // 4.2 视频：每个视频是m3u8类型文件，我们需要的是mp4文件，这里通过ffmpeg实现【请求m3u8 - 转本地mp4】，以txt文件作为载体存储小节对应所有课程视频ffmpeg命令
          const downloadTxtName = filterName(groupPath + '/' + name + '.txt').replace(/\s/g, '')
          for (let k = 0; k < contentList.length; k++) {
            // if(k) break
            const { content: contents, content_type, content_title } = contentList[k]
            // 视频资源
            if (content_type === 3 || content_type === 7) {
              // fs.rmSync(downloadTxtName)
              let contentText = ''
              for (let l = 0; l < contents.length; l++) {
                const { callback_key: mediaId } = contents[l]
                const params = { mediaId, accessToken }
                try {
                  const reqData = await axios.get(mediaUrl, { ...requestConfig, params })

                  const { data: { data: videoInfo } } = reqData
                  const { playURL } = videoInfo.mediaMetaInfo.videoGroup[0]
                  let [videoUriWithoutToken] = playURL.split('?MtsHlsUriToken')
                  // 避免重复的课程记录
                  if (!cacheManage[videoUriWithoutToken]) {
                    contentText += `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc ./${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4\n`
                    allText += `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc "${path.resolve(groupPath)}/${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4"\n`
                    cacheManage[videoUriWithoutToken] = true
                  }
                } catch (error) {
                  console.error(`视频资源${mediaId}请求失败，${error}`);
                }
              }
              contentText += '\n'
              allText += '\n'
              fs.writeFileSync(downloadTxtName, contentText, { flag: 'a+' })
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
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`章${chapterName}接口请求失败，失败原因${error}`);
      }
    }
  } catch (error) {
    console.error(`课程${course_id}接口请求失败，失败原因${error}`);
  }
  // fs.writeFileSync('./video/allText.txt', allText)
  // let ffepngTxtArr = getFilesArr(basePath)
  // shDownLoad(ffepngTxtArr)
  // 触发 getFilesArr 生成对应数据结构
  // let ffepngTxtArr = loadFileNameByPath4Ext(basePath, ['txt']).toString()
  // // 触发 shDownLoad.js 生成 down.sh 脚本
  // ffepngTxtArr.forEach(
  //   async (reqInfo) => {
  //     let [txtFilePath, dirs] = reqInfo
  //     // txt文件内包含的所有命令
  //     let reqs = await processLineByLine(txtFilePath)
  //     reqs = reqs.filter(req => req)
  //     // 从头部弹出任务
  //     let task = reqs.shift();
  //     // 执行任务
  //     let [commandPrefix, videoName] = task.split('aac_adtstoasc');
  //     // 处理下生成的命令文件名
  //     let handledVideoName = videoName.replace(/\s/g, '').replace('./', `./${dirs.join('/').replace(/\s/g, '')}/`)
  //     console.log('开始-----：', videoName)
  //     // 处理下目录问题
  //     task = filterName(`${commandPrefix} aac_adtstoasc ${handledVideoName}`);
  //     fs.writeFileSync('/Users/wzyan/Documents/selfspace/ffmpeg-download/download.sh', `${task}\n`, { flag: 'a+' })
  //   })
})