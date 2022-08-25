const { intercept, patterns } = require('puppeteer-interceptor');
const fs = require('fs');
const URI = require('uri-js');
const puppeteerUtils = require("../utils/cjs/puppeteer-utils-cjs");
const cjsConfig = require("../config/cjs-index.js");
const domainUtil = require("../utils/cjs/domain-util-cjs");
const nodeUtil = require("../utils/cjs/node-api-cjs");
let courseDir = 'output'; // 课程输出目录
let configDir = 'currentConfig'; // 配置输出目录

function filterName(name) {
  const reg = /[`()（）\r\n[\]]/gim
  name = name.replace(/、/g, '.')
  // 处理空格
  name = name.replace(/ /g, '-')
  return name.replace(reg, '')
}
let closeId = ''// 关闭爬虫的定时器
let timeOut = 3 * 60 * 1000; // 浏览器等待响应时间 默认 3分钟
// 获取课程详情路由
let getDetailPageUrl = courseId => `https://learn.kaikeba.com/catalog/${courseId}?type=1`;
const cookies = cjsConfig.cookies;
const courseIds = cjsConfig.courseIds; // 需要下载的课程
let noNeedFilter = false; //是否下载全部课程
if (courseIds === '*') {
  noNeedFilter = true;
}
(async function () {
  let url = "https://learn.kaikeba.com/home";
  let over = ''; // 所有任务是否完成
  let completeConfigNum = 0; // 完成的任务数
  try {
    // 清空目录，如果没有就生成
    await nodeUtil.clearDir(`./${configDir}`);
    // 生成课程输出目录，如果没有就生成
    await nodeUtil.clearDir(`./${courseDir}`)
    let page = await puppeteerUtils.getPage({
      ignoreHTTPSErrors: true,
      headless: true,
      devtools: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-extensions"]
    });
    let commonInfo = {
      Authorization: '',
    }
    function writeConfig(index, course_id, course_name, accessToken = '') {
      let {
        Authorization,
      } = commonInfo;
      // 5. 写入文件
      let content = `
    export const course_id = '${course_id}';// ${course_name}
    export const basePath = './${courseDir}/${filterName(course_name)}'
    export const courseName = '${filterName(course_name)}'
    export const accessToken = '${accessToken}' // 点击一个视频，进入播放状态，在控制台network 找 detail 接口，里面有accessToken  
    export const Authorization = '${Authorization}' // 列表接口 list 里面去request header 里面找  
    export const cookie = '${JSON.stringify(cookies)}'
    // 官网上不要动页面，停留在视频播放页
    export default {
        course_id,
        basePath,
        courseName,
        accessToken,
        Authorization,
        cookie
    }
    `
      fs.writeFileSync(`./${configDir}/config${index}.js`, content)
      console.log(`config${index}.js 输出完成`);
      completeConfigNum++
    }
    let courseList;
    intercept(page, patterns.XHR('*list?type=1&option=2*'), {
      onInterception: event => {
        if (event.request.headers.Authorization) {
          commonInfo.Authorization = event.request.headers.Authorization
        }
        console.log(`${event.request.url} intercepted.`)
      },
      onResponseReceived: event => {
        // console.log(`${event.request.url} intercepted, going to modify`)
        // event.response.body += `\n;console.log("This script was modified inline");`
        // 4. 收集信息 course_id 课程名称 accessToken Authorization cookie
        // console.log(event.response.body);
        courseList = event.response.body ? JSON.parse(event.response.body).data : []
        courseList = courseList.filter(course => course.expired_status === 1)
        // 获取到课程列表数据
        return event.response;
      }
    });
    // const ps = await browser.pages();
    // await ps[0].close();
    await puppeteerUtils.addCookies(page, cookies, domainUtil.getHostName(url)); //云盘域名
    await page.setViewport({
      //修改浏览器视窗大小
      width: 1920,
      height: 1080,
    });
    await page.goto(url, {
      timeout: 600000,
      waitUntil: "networkidle2",
    });
    // 3. 获取vip课程列表
    // await page.setRequestInterception(true);
    // page.on('response', async res => {
    //   if (res.url().indexOf('/list') >= 0) {
    //     console.log(res.status());
    //     console.log(res);
    //     // 原本接口返回的数据 {"code":0,"data":"hello ajanuw"}
    //     console.log(await res.text());
    //     // await browser.close();
    //   }
    // });
    // 1. 切换我的课程页
    let groupName = "我的课程";
    let groupNameSelector = `.course-type li[data-name="${groupName}"]`;
    await puppeteerUtils.click(page, groupNameSelector);

    // 2. 切换成vip课程
    await puppeteerUtils.click(page, '.divSelectinput');
    await puppeteerUtils.click(page, '.wzc_option:nth-child(2)');
    // await puppeteerUtils.click(page, '.wzc_option_dropdown_item', 1);
    // page.waitForTimeout(1000);
    await page.waitForSelector('.goon-and-review-btn')

    // // 3. 依次进入课程
    // await page.$eval('.goon-and-review-btn', async (currentCourseBtn) => {
    //   currentCourseBtn.click();
    // })
    // let cousreId = url.split('/').pop().split('?')[0];
    // 
    if (courseList.length > 0) {
      for (let index = 0; index < courseList.length; index++) {
        const {
          course_id,
          course_name
        } = courseList[index];
        debugger
        // 当ci
        let writeFlag = true;
        // let detailPage = puppeteerUtils.openPage(getDetailPageUrl(course_id))
        let detailPage = await puppeteerUtils.getPage({
          ignoreHTTPSErrors: true,
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          devtools: true
        });
        intercept(detailPage, patterns.XHR('*detail*'), {
          onInterception: event => {
            if (writeFlag) {
              let { query } = URI.parse(event.request.url)
              let queryObj = {}
              query.split('&').forEach(kv => {
                let [key, val] = kv.split('=');
                queryObj[key] = val
              })
              if (queryObj.accessToken) {
                // 如果是全部课程下载
                if (noNeedFilter) {
                  writeConfig(index, course_id, course_name, queryObj.accessToken)
                } else {
                  // 如果是指定课程才下载 
                  if (courseIds.includes(course_id)) {
                    // 写了的话就清楚掉这个id
                    courseIds.splice(courseIds.indexOf(course_id), 1)
                    writeConfig(index, course_id, course_name, queryObj.accessToken)
                  }
                }
                writeFlag = false
                // 全部下载、或者还存在当前需要下载的课程是才进行清除定时器动作
                if (noNeedFilter || courseIds.length > 0) {
                  // 如果30秒内没有更新配置，就关闭掉爬虫
                  clearTimeout(closeId)
                  closeId = setTimeout(async () => {
                    let broswer = puppeteerUtils.getBroswer();
                    await broswer.close()
                    console.log(`等待时间超过${timeOut},浏览器关闭`);
                  }, timeOut)
                }
                // 如果完成的任务数等于课程数，则将结束标识设置为true
              }
            }
          },
          onResponseReceived: event => {
            // console.log(`${event.request.url} intercepted, going to modify`)
            // event.response.body += `\n;console.log("This script was modified inline");`
            // 4. 收集信息 course_id 课程名称 accessToken Authorization cookie
            // console.log(event.response.body);
            // 获取到课程列表数据
            return event.response;
          }
        });
        await detailPage.goto(getDetailPageUrl(course_id), {
          timeout: 600000,
          waitUntil: "networkidle2",
        });
        puppeteerUtils.click(detailPage, '.item-txt')
        // 
      }
    }
    // let broswer = puppeteerUtils.getBroswer();
    // // 定时查询任务是否完成，完成则关闭无头浏览器
    // let closeId = setInterval(async () => {
    //   if (over) {
    //     console.log('浏览器关闭');
    //     await broswer.close()
    //     clearInterval(closeId)
    //   } else {
    //     console.log(`未到时间，还有${courseList.lengt - completeConfigNum}个任务待完成`);
    //   }
    // }, 3000);

  } catch (error) {
    console.log(error);
  }

  // //   处理文件库
  // let fileWareHouseBtnSelect = `.header .file-factory`;
  // await puppeteerUtils.click(page, fileWareHouseBtnSelect);
})();
