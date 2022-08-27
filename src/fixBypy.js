import {
    getPlatForm,
    doShellCmd
} from '../utils/node-api.js';

// 1. 找到所有带有、的目录，获得目标视频的对应目录地址
async function getCurrentLs(dir) {
    return await doShellCmd('bypy list ', dir)
}
getCurrentLs()
// 2. 截取目录名，找到对应的同级目录，获得目标地址
// 3. 执行bypy进行移动