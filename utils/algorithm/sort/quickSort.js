/** 一趟快速排序
 * 1. 任意选取一个元素（通常选取第一个）为基准元素（*pivot*）
 * 2. 将所有比它小的元素都安置在它的位置之前，将所有比它大的元素都安置在它的位置之后
 * 3. 以该基准元素所落的位置 i 作为分界线，可以将序列分割成 `arr[0]~arr[i-1]`、`arr[i+1]~arr[n-1]` 两个子序列。
 * @param {*} arr
 * @param {*} left
 * @param {*} right
 * @returns
 */
function partition(arr, left, right, reservt = false) {
  let oriLeft = left;
  let oriRight = right;
  if (left >= right) {
    return;
  }
  // 任意选取一个元素（通常选取第一个）为基准元素（*pivot*）
  let pivot = arr[left]; // 选取第一个为基准元素
  while (left < right) {
    /* 先从右往移动，直到遇见小于 pivot 的元素 */
    while (
      left < right &&
      (reservt ? arr[right] <= pivot : arr[right] >= pivot)
    ) {
      right--;
    }
    arr[left] = arr[right]; // 记录小于 pivot 的值

    /* 再从左往右移动，直到遇见大于 pivot 的元素 */
    while (
      left < right &&
      (reservt ? arr[left] >= pivot : arr[left] <= pivot)
    ) {
      left++;
    }
    arr[right] = arr[left]; // 记录大于 pivot 的值
  }
  // 此时left和right相等，将基准值放在此处即可
  arr[left] = pivot; // 记录基准元素到当前指针指向的区域
  partition(arr, oriLeft, left - 1, reservt);
  partition(arr, left + 1, oriRight, reservt);
  //   return left; // 返回基准元素的索引
}

function quickSort(arr, reservt = false) {
  partition(arr, 0, arr.length - 1, reservt);
}
let arr = [1, 11, 3, 5, 2];
quickSort(arr);
console.log(arr);
