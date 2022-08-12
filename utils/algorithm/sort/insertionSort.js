function insertionSort(arr) {
  let n = arr.length;
  if (n <= 1) return;
  for (let i = 1; i < n; ++i) {
    let value = arr[i];
    let j = i - 1;
    // 查找插入的位置
    for (; j >= 0; --j) {
      if (arr[j] > value) {
        arr[j + 1] = arr[j]; // 数据移动
      } else {
        break;
      }
    }
    arr[j + 1] = value; // 插入数据
  }
  return arr;
}
function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

console.log(insertionSort([14, 5, 7, 10]));
