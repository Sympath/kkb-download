/** 归并排序入口函数
 * 1. 先将源数组分割为两个数组
 * 2  再将两个数组递归处理获得左右结果
 * 3. 最后将左右结果合并返回
 * @param {*} arr
 * @param {*} reservt 排列顺序，默认从小到大，传递true时从大到小
 * @returns
 */
function mergeSortMain(arr, reservt = false) {
  // 终止条件
  if (arr.length <= 1) {
    return arr;
  }
  // 1. 先将源数组分割为两个数组
  let { left, right } = breakUpMiddle(arr);
  // 2  再将两个数组递归处理获得左右结果
  let leftResult = mergeSortMain(left);
  let rightResult = mergeSortMain(right);
  // 3. 最后将左右结果合并返回
  return merge(leftResult, rightResult, reservt);
}
/** 合并两个数组并返回结果
 *
 * @param {*} arr1
 * @param {*} arr2
 * @returns
 */
function merge(arr1, arr2, reservt = false) {
  let result = [];
  while (arr1.length && arr2.length) {
    let isSwap = reservt ? arr1[0] >= arr2[0] : arr1[0] <= arr2[0];
    if (isSwap) {
      result.push(arr1.shift());
    } else {
      result.push(arr2.shift());
    }
  }
  return result.concat(arr1, arr2);
}

function breakUpMiddle(arr) {
  let middleIndex = Math.floor(arr.length / 2);
  let left = arr.slice(0, middleIndex);
  let right = arr.slice(middleIndex);
  return {
    left,
    right,
  };
}
let result = mergeSortMain([1, 3, 11, 2]);
console.log(result);
