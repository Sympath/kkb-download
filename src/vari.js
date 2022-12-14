
export let courseWrapDir = 'output'; // 课程输出目录

// 根目录
let rootDir = (__dirname || "").replace('/dist', '').replace('/src', '').replace('/config', '');
// 远程服务器repo地址
export let serverRepo = process.env.serverRepo
// 脚本生成目录
export let shDir = `${rootDir}/sh`
// 已完成的课程记录
export let finishCourseTxtPath = `${shDir}/finishCourse.txt`
// 常见执行命令的记录
export let shellTxtPath = `${shDir}/shellTxt.txt`
// 批量执行脚本的目录
export let allShDir = `${shDir}/all`
// 批量执行脚本的文件
export let allShFilePath = `${shDir}/all.sh`

export default {
    courseWrapDir,
    rootDir,
    shDir,
    finishCourseTxtPath,
    allShDir,
    allShFilePath,
    shellTxtPath
}
