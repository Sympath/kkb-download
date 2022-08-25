import glob from 'glob';
import fs from 'fs';
import cp from 'child_process';
import shell from 'shelljs';
import { promisify } from 'util';
import os from 'os';
import utils from './index.js';
/** 判断文件或文件夹是否存在
 *
 * @param {*} filePath
 * @returns
 */
export const fileIsExist = async (filePath) => {
  return await fs.promises
    .access(filePath)
    .then(() => true)
    .catch((_) => false);
};
// 清空目录
export const clearDir = async (dirPath) => {
  // 先删后生成
  await deleteDirOrFile(dirPath)
  return await checkPath(dirPath)
}
// 删除
export const deleteDirOrFile = async (dirPath) => {
  try {
    shell.rm('-rf', dirPath)
  } catch {
  }
}

/** 写入文件
 *
 * @param {*} path
 * @param {*} buffer
 * @returns
 */
export const writeFileRecursive = function (path, buffer) {
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

/**
 * @param {string} command process to run
 * @param {string[]} args commandline arguments
 * @returns {Promise<void>} promise
 */
export const runCommand = (command, args) => {
  return new Promise((resolve, reject) => {
    const executedCommand = cp.spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    executedCommand.on("error", (error) => {
      reject(error);
    });

    executedCommand.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};
/** 获取指定目录下所有文件的导出信息
 * 
 * @param {*} dirPath 指定目录
 * @param {*} suffix 后缀
 * @param {*} opts：方法本身的配置对象  
 *          1. removeRequireCache 是否清除require缓存，在【应用启动过程中会修改源码】的场景下执行
 *          2. needAbsPath 是否挂载文件绝对路径信息再返回
 *          3. globOpts glob的配置对象
 * @returns 
 */
export function getFileExportObjInDir(dirPath, suffix = "js", opts = {}) {
  let {
    removeRequireCache,
    needAbsPath,
    globOpts = {}
  } = opts
  // 利用glob实现自动引入所有命令实现
  const files = glob.sync(`${dirPath}/*.${suffix}`, {
    ...globOpts,
  });
  const controllers = {};
  files.forEach((key) => {
    const name = key.split("/").pop().replace(/\.js/g, "");
    const value = require(key);
    // 挂载文件绝对路径信息
    if (needAbsPath) {
      value._absPath = key
    }
    controllers[name] = value;
  });
  return controllers;
}

/** 加载指定文件夹下指定后缀的文件路径列表 （不给exts参数时则获取所有类型文件）
 * @param {*} dirPath 
 * @param {*} exts Array 文件类型数组 [mp4]
 * @param {*} cb Function 可以在存入时对存入对象进行一层拦截处理
 * @param {*} currentDir 不用管
 * @return [[filePath, dirs = []]] 返回一个二维数组 第一个元素是文件地址；第二个是对应的子目录数组
 */
export function loadFileNameByPath4Ext(dirPath, exts, cb = (item) => item, currentDir = []) {
  if (currentDir.length === 0) {
    // 取最后一个目录名作为初始目录
    currentDir = [dirPath.split('/').pop()]
  }
  let arrFiles = []
  let arrFile = [];
  const files = fs.readdirSync(dirPath)
  for (let i = 0; i < files.length; i++) {
    const item = files[i]
    const stat = fs.lstatSync(dirPath + '/' + item)
    if (stat.isDirectory() === true) {
      currentDir.push(item)
      arrFiles.push(...loadFileNameByPath4Ext(dirPath + '/' + item, exts, cb, currentDir))
    } else {
      if (exts != undefined && exts != null && exts.length > 0) {
        for (let j = 0; j < exts.length; j++) {
          let ext = exts[j];
          if (item.split('.').pop().toLowerCase() == ext.trim().toLowerCase()) {
            arrFile = [dirPath + '/' + item, JSON.parse(JSON.stringify(currentDir))]
            let handlerItem = cb(arrFile)
            // 如果排除属性存在，则不做任何处理
            if (handlerItem.exclude) {

            } else {
              arrFiles.push(handlerItem)
            }
            break;
          }
        }
      } else {
        arrFile = [dirPath + '/' + item, JSON.parse(JSON.stringify(currentDir))]
        let handlerItem = cb(arrFile)
        // 如果排除属性存在，则不做任何处理
        if (handlerItem.exclude) {

        } else {
          arrFiles.push(handlerItem)
        }
      }
    }
  }
  currentDir.pop()
  return arrFiles
}
/** 加载指定文件夹下指定后缀的文件路径列表 （不给exts参数时则获取所有类型文件）
 * @param {*} dirPath 
 * @param {*} names Array 文件名数组 []
 * @return [[filePath, dirs = []]] 返回一个二维数组 第一个元素是文件地址；第二个是对应的子目录数组
 */
export function loadPathByName(dirPath, names) {
  let ignoreNames = ['node_modules']
  function loadPathByNameCore(dirPath, names, currentDir = []) {
    if (currentDir.length === 0) {
      // 取最后一个目录名作为初始目录
      currentDir = [dirPath.split('/').pop()]
    }
    let arrFiles = []
    let arrFile = [];
    // 1. 读取指定目录内的所有子文件
    const files = fs.readdirSync(dirPath)
    for (let i = 0; i < files.length; i++) {
      const item = files[i]
      // 2. 如果和指定名称匹配 则存入结果数组中
      if (names.includes(item)) {
        arrFile = [dirPath + '/' + item, JSON.parse(JSON.stringify(currentDir))]
        arrFiles.push(arrFile)
      }
      // 3. 判断是否是文件夹，是则递归处理
      const stat = fs.lstatSync(dirPath + '/' + item)
      if (stat.isDirectory() === true && !ignoreNames.includes(item)) {
        currentDir.push(item)
        arrFiles.push(...loadPathByNameCore(dirPath + '/' + item, names, currentDir))
      }
    }
    currentDir.pop()
    return arrFiles
  }
  return loadPathByNameCore(dirPath, names)
}


/** 删除指定目录下的指定类型文件
 * @param {*} dirPath 
 * @param {*} exts Array 文件类型数组 [mp4]
 */
export function deleteFileInDir(dirPath, exts) {
  let arrFiles = loadFileNameByPath4Ext(dirPath, exts)
  arrFiles.forEach(([filePath]) => {
    fs.unlinkSync(filePath)
  })
}

/**
 * 获取当前操作系统
 * @returns 
 */
export function getPlatForm() {
  const platform = os.platform()
  let isLinux, isMac, isWindows;
  switch (platform) {
    case 'darwin':
      isMac = true;
      break;
    case 'linux':
      isLinux = true;
      break;
    case 'win32':
      isWindows = true;
      break;
    default:

  }
  return {
    isLinux, isMac, isWindows
  }
}

/** 根据命令获取对应的包管理器
 * 
 * @param {*} command 
 * @returns 
 */
export function getPackageManageByCommand(command) {
  let {
    isLinux, isMac, isWindows
  } = getPlatForm()
  if (!isMac) {
    throw new Error(`非mac平台请手动安装${command}命令`)
  }
  // w-todo 待实现添加系统判断
  let commandPackageMangeMap = {
    npm: ['live-server'],
    brew: ['tree']
  }
  let target = ''
  utils.eachObj(commandPackageMangeMap, (packageMange, commands) => {
    if (commands.includes(command)) {
      target = packageMange
    }
  })
  return target
}
/**
 * 检查对应目录是否存在，不存在则新建
 * @param {*} path 
 * @returns 
 */
export const checkPath = async function (path) {
  try {
    await fs.promises.access(path)
  } catch {
    fs.mkdirSync(path)
  }
  return true
}
export function doShellCmd(cmd) {
  let str = cmd;
  let result = {};
  return new Promise(function (resolve, reject) {
    try {
      cp.exec(str, function (err, stdout, stderr) {
        if (err) {
          console.log('err', err);
          result.errCode = 500;
          result.data = "操作失败！请重试";
          reject(result);
        } else {
          console.log('stdout ', stdout);//标准输出
          result.errCode = 200;
          result.data = "操作成功！";
          resolve(result);
        }
      })
    } catch (error) {
      throw new Error(error)
    }

  })
}

export default {
  fileIsExist,
  writeFileRecursive,
  shell,
  clearDir,
  doShellCmd,
  runCommand,
  getFileExportObjInDir,
  getPlatForm,
  getPackageManageByCommand,
  checkPath,
  loadFileNameByPath4Ext
};
