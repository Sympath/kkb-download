#!/bin/bash
cd autoSh
name=$(cat ./name.txt)
cookie=$(cat ./cookie.txt)
# 1. 先克隆仓库
git clone git@github.com:Sympath/kkb-download.git $name
# 2. 切换进根目录
cd $name
# 3. 生成配置文件
echo "module.exports = {
    cookies: '${cookie}'
}" > config/cjs-index.js
echo "
import path from 'path';
// import nodeApi from '../utils/node-api.js';
// let configObj = nodeApi.getFileExportObjInDir('/Users/wzyan/Documents/selfspace/ffmpeg-download/config/3')
let ctx = require.context('../currentConfig/', false, /\.js$/);
const modules = {}
for (const key of ctx.keys()) {
    // key 是 相对src的相对路径   module 是 模块导出对象  es6的话要在default上取值
    let module = ctx(key);
    const name = path.relative('', key).split('.')[0]
    modules[name] = module.default;
}
// 配置 2
export const bdypDir = '${name}' // 在百度云盘上对应的文件夹名称
export default modules
" > config/index.js
# 安装依赖
npm install
# 开始爬虫生成配置目录
npm run formatConfig
# 启动
npm run build
npm run build1
npm run build
npm run build2
npm run build
npm run build3
npm run build4-linux
