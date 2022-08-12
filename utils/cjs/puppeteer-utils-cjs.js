let puppeteer = require("puppeteer");
const domainUtil = require("./domain-util");

let browser;
function getBroswer() {
  return browser
}
/** 打开一个无头浏览器
 *
 * @param {*} opts
 * @returns
 */
async function getPage(
  opts = {
    headless: false,
    devtools: true,
  }
) {
  if (!browser) {
    browser = await puppeteer.launch(opts);
  }
  // 打开一个空白页
  let page = await browser.newPage();
  return page;
}
/** 打开一个无头浏览器 并跳转至指定地址
 * @param {*} uri
 * @returns page对象
 */
async function openPage(
  uri,
  opts = {
    headless: false,
    devtools: true,
  }
) {
  let page = await getPage(opts);
  //设置页面打开时的页面宽度高度
  //   await page.setViewport({
  //     width: 1920,
  //     height: 1080,
  //   });
  // 在地址栏中输入百度的地址
  await page.goto(uri, {
    waitUntil: "networkidle2",
  });
  return page;
}

/** 
 * 
 * @param {*} uri 
 * @param {*} isAutoScrollToBottom 
 * @returns 
 */
async function getHTML(uri, isAutoScrollToBottom = true) {
  let page = await openPage(uri);
  /** 自动滚动至页面底部，用于处理页面触底加载的情况
   * @param {*} page page对象
   * @param {*} interval 间隔请求时间，尽可能趋近【被爬页面触底加载请求接口】的返回时间，但一定不要小于，不然就会出现爬取不完整的情况
   */
  async function autoScrollToBottom(page, interval = 3000) {
    // Expose a function 这个用于客户端代码debugger 避免源码映射失效的情况 //# sourceURL=__puppeteer_evaluation_script_
    // 解决方案来源：https://stackoverflow.com/questions/65584989/debug-in-chromium-puppeteer-doesnt-populate-evaluate-script
    // 这个api原意是侦听页面中触发的自定义事件，可见文档https://www.qikegu.com/docs/4564
    page.exposeFunction("nothing", () => null);
    //   放在这里的函数会在客户端环境下执行 并且里面的内容和外层是隔绝的，这意味着外面的依赖、方法都不能使用
    await page.evaluate(async (...args) => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        function exec() {
          totalHeight = document.body.scrollHeight;
          // 1. 滚动到底部
          window.scrollBy(0, totalHeight);
          // 2. 等待10s判断页面高度有无变化
          setTimeout(() => {
            // 1. 变化了，则重复行为
            if (document.body.scrollHeight > totalHeight) {
              exec();
            } else {
              //   2. 没变化，则结束行为
              resolve();
            }
          }, 3000);
        }
        exec();
      });
    });
  }
  if (isAutoScrollToBottom) {
    await autoScrollToBottom(page);
  }
  // 获取页面完整dom
  let sum = await page.content();
  const $ = cheerio.load(sum);
  return $;
}
/** 为页面对象添加cookies
 * @param {*} cookies
 * @param {*} page
 * @param {*} domain
 */
const addCookies = async (page, cookies, domain) => {
  if (typeof cookies === "string") {
    cookies = cookies.split(";").map((pair) => {
      let name = pair.trim().slice(0, pair.trim().indexOf("="));
      let value = pair.trim().slice(pair.trim().indexOf("=") + 1);
      return { name, value, domain };
    });
  }
  await Promise.all(
    cookies.map((pair) => {
      return page.setCookie(pair);
    })
  );
};
/**
 *
 * @param {*} url
 * @param {*} cookies 自己的cookies 支持数组和字符串形式
 */
async function login(url, cookies, props = {}) {
  let page = await getPage({
    ignoreHTTPSErrors: true,
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ...props
  });
  // const ps = await browser.pages();
  // await ps[0].close();
  await addCookies(page, cookies, domainUtil.getHostName(url)); //云盘域名
  await page.setViewport({
    //修改浏览器视窗大小
    width: 1920,
    height: 1080,
  });
  await page.goto(url, {
    timeout: 600000,
    waitUntil: "networkidle2",
  });
  return page;
}

async function click(page, select) {
  await page.waitForSelector(select);
  await page.$eval(select, node => {
    if (node) {
      node.click();
    } else {
      throw new Error(`${select}节点不存在`)
    }
  });

}
let puppeteerUtil = {
  openPage,
  login,
  click,
  addCookies,
  getPage,
  getBroswer,
  getHTML
}
module.exports = puppeteerUtil;
