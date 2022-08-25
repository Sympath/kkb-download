import { exec, execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
// 记录已经下载成功了的课程
let cacheManage = {
  // 判断是否已经下载过这个课程了
  has(task) {
    const downloaded = fs.readFileSync('./downloaded.txt', 'utf-8')
    const arrayDown = downloaded.split(`\n`)
    arrayDown.includes(task)
  },
  // 下载完成后记录一下
  set(task) {
    let content = fs.readFileSync('./downloaded.txt', 'utf-8');
    content += `${task}\n`
    fs.writeFileSync('./downloaded.txt', content)
  },
  getAllCache() {
    const downloaded = fs.readFileSync('./downloaded.txt', 'utf-8')
    const arrayDown = downloaded.split(`\n`)
    return arrayDown
  }
};
(async function () {
  // 处理txt文件对应的包含ffepng命令
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
    let arrayDown = cacheManage.getAllCache()
    for await (const line of rl) {
      // input.txt 中的每一行都将在此处作为 `line` 连续可用。
      //   if (line.length > 10) {
      //     array.push(line)
      //   }
      if (!arrayDown.includes(line)) {
        array.push(line)
      }

      // console.log(`Line from file: ${line}`);
    }
    return array;
    //   console.log(array.length);
  }
  let rootDir = __dirname.replace('/dist', '')
  // 执行失败的命令记录
  const errorList = []
  // 所有命令
  const txtFilePath = path.resolve(rootDir, './tasks.txt')
  // txt文件内包含的所有命令
  let tasks = await processLineByLine(txtFilePath);
  debugger
  tasks = tasks.filter(req => req)
  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    try {
      execSync(task)
      // 成功则记录在download.txt中
      cacheManage.set(task)
    } catch (err) {
      // 成功则记录
      errorList.push(task)
      console.error('失败任务：', task);
    }
  }
  console.log('完成！,失败任务：', errorList);
})()