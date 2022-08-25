
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
export const bdypDir = 'Gemma-1' // 在百度云盘上对应的文件夹名称
export default modules

