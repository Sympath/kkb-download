
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
// 写入文件
const writeFileRecursive = function (path, buffer) {
  return new Promise((res, rej) => {
    let lastPath = path.substring(0, path.lastIndexOf("/"));
    fs.mkdir(lastPath, { recursive: true }, (err) => {
      if (err) return rej(err);
      fs.writeFile(path, buffer, function (err) {
        if (err) return rej(err);
        return res(null);
      });
    });
  });
};
module.exports = {
  clearDir,
  deleteDirOrFile,
  writeFileRecursive
}