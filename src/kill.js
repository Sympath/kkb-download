import {
    doShellCmd
} from '../utils/node-api.js';
async function kill(filename) {
    let getCmd = `ps -ef | grep ${filename} | grep -v grep | awk '{print "kill -9 "$2}' `
    let { stdout } = await doShellCmd(getCmd);
    if (stdout) {
        return await doShellCmd(stdout)
    }
}
// 查询
async function search(filename) {
    let getCmd = `ps -ef | grep ${filename} | grep -v grep`
    let { stdout } = await doShellCmd(getCmd);
    return stdout
}
(async () => {
    let num = 44;
    let filename = ''
    while (num--) {
        filename = `config${num}.sh`
        kill(filename)
        // try {
        //     search(filename)
        // } catch (error) {
        //     console.log(filename, '执行结果为空');
        // }
    }
})()