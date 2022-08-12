/** 排序 - 冒泡排序
 * @param {*} arr 待排序数组
 * @param {*} reservt 从大到小排序 默认false，即从小到大排序
 * @returns
 */
function bubbleSort(arr, reservt = false) {
  if (arr.length < 2) {
    return arr;
  }
  for (let i = 0; i < arr.length; ++i) {
    let flag = false;
    for (let j = 0; j < arr.length - i - 1; ++j) {
      const ele1 = arr[j];
      const ele2 = arr[j + 1];
      let isSwap = reservt ? ele1 < ele2 : ele1 > ele2;
      if (isSwap) {
        swap(j + 1, j, arr);
        flag = true;
      }
    }
    if (!flag) {
      break;
    }
  }
  return arr;
}

function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

console.log(bubbleSort([1, 2, 3], true));
