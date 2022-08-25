import ffepngTxtArrObj from '../../result.js';
import nodeApi from '../../utils/node-api.js';
if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array

        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    };
};
(async () => {
    function entries(obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array

        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    };
    let ffepngTxtArrs = entries(ffepngTxtArrObj)
    for (let index = 0; index < ffepngTxtArrs.length; index++) {
        let [courseName, ffepngTxtArr] = ffepngTxtArrs[index]
        for (let index = 0; index < ffepngTxtArr.length; index++) {
            const reqInfo = ffepngTxtArr[index];
            let [txtFilePath, dirs] = reqInfo
            debugger
            await nodeApi.doShellCmd(`mv ${txtFilePath} ${txtFilePath.replace('-cache.txt', '.txt')}`)
        }
    }
})()