// 小鹅通的爬取
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
  const reg = /[`【】()（）\r\n[\]]/gim
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
let courseIds = cjsConfig.courseIds; // 需要下载的课程
let noNeedFilter = false; //是否下载全部课程
let userCourseIds = [] // 用户所有的课程id
// 如果是字符串就进行处理一下
if (typeof courseIds === 'string') {
  if (courseIds === '*') {
    noNeedFilter = true;
  } else {
    // 111,222
    courseIds = courseIds.split(',').filter(item => item).map(i => Number(i))
    console.log(courseIds);
  };
};

(async function () {
  let url = "https://appqszhpsdw5896.h5.xiaoeknow.com/p/course/column/p_62e393cce4b0c9426480ca4e?l_program=xe_know_pc";
  let over = ''; // 所有任务是否完成
  let completeConfigNum = 0; // 完成的任务数
  try {
    // 清空目录，如果没有就生成
    await nodeUtil.clearDir(`./${configDir}`);
    // 生成课程输出目录，如果没有就生成
    await nodeUtil.clearDir(`./${courseDir}`)
    let page = await puppeteerUtils.getPage({
      ignoreHTTPSErrors: true,
      headless: false,
      devtools: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-extensions"]
    });
    await page.setDefaultNavigationTimeout(0);
    let commonInfo = {
      Authorization: '',
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
    await puppeteerUtils.addCookies(page, cookies, 'appqszhpsdw5896.h5.xiaoeknow.com'); //云盘域名
    await puppeteerUtils.addCookies(page, cookies, '.qq.com'); //云盘域名
    await page.setViewport({
      //修改浏览器视窗大小
      width: 1920,
      height: 1080,
    });
    await page.goto(url, {
      timeout: 600000,
      waitUntil: "networkidle2",
    });

  } catch (error) {
    console.log(error);
  }

  // //   处理文件库
  // let fileWareHouseBtnSelect = `.header .file-factory`;
  // await puppeteerUtils.click(page, fileWareHouseBtnSelect);
})();
