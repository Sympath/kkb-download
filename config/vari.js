export let courseWrapDir = 'output'; // 课程输出目录
// 根目录
export let rootDir = (__dirname || "").replace('/dist', '').replace('/src', '').replace('/config', '');
// 脚本生成目录
export let shDir = `${rootDir}/sh`
// 已完成的课程记录
export let finishCourseTxtPath = `${rootDir}/sh/finishCourse.txt`
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
    allShFilePath
}
