export let bdypHost = 'https://pan.baidu.com/disk/main?from=homeFlow#/index?category=all&path=%2Fapps%2Fbypy%2F'
// 生成百度云盘上传命令
export let getBDYPUploadCmd = (dirName, bypyDir) => `bypy upload ${dirName} ${bypyDir}/`
// 获取课程对应的访问链接
export let getBDYPLink = (userName, courseName) => `${bdypHost}${userName}%2F${courseName}`
export let getBDYPZipUploadCmd = (dirName, bdypDir) => `bypy upload ${dirName}.zip ${bdypDir}/`
// 生成百度云盘创建文件夹命令
export let getBDYPDirCmd = (dirName) => `bypy mkdir ${dirName}/`
export default {
    bdypHost,
    getBDYPUploadCmd,
    getBDYPLink,
    getBDYPZipUploadCmd,
    getBDYPDirCmd
}