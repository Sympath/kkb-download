const fs = require('fs');
const path = require('path');
const cjsConfig = require("../config/cjs-index.js");

const cookies = cjsConfig.cookies;
let configDir = 'currentConfig'; // 配置输出目录
let commonInfo = {
    Authorization: 'Bearer pc:9012d2299504343672d3cc32b1ed72b5'
}
let courseDir = 'output'; // 课程输出目录
function filterName(name) {
    const reg = /[`()（）\r\n[\]]/gim
    name = name.replace(/、/g, '.')
    name = name.replace(/ /g, '-')
    return name.replace(reg, '')
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
  export const cookie = '${cookies}'
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
    fs.writeFileSync(`${path.resolve(__dirname, '../' + configDir)}/config${index}.js`, content)
    console.log(`config${index}.js 输出完成`);
}

let userConfigs = [
    {
        course_id: 222580,
        course_name: '全栈DevQA自动化测试高级工程师',
        accessToken: "6f9bf4f3d8af4b20a4863596358cc9ff"
    }
]

userConfigs.forEach((configInfo, index) => {
    let {
        course_id, course_name, accessToken
    } = configInfo;
    writeConfig(index, course_id, course_name, accessToken)
})
