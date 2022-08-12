
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const checkPath = async function (path) {
  try {
    await fs.promises.access(path)
  } catch {
    fs.mkdirSync(path)
  }
  return true
}
// 清空目录
const clearDir = async (dirPath) => {
  // 先删后生成
  await deleteDirOrFile(dirPath)
  checkPath(dirPath)
}
// 删除
const deleteDirOrFile = async (dirPath) => {
  try {
    shell.rm('-rf', dirPath)
  } catch {
  }
}
module.exports = {
  clearDir,
  deleteDirOrFile
}