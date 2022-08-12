/** 异步任务队列  队列中的任务按照先进先出的规则依次执行
 */
var WaitQueue = function () {
  this.items = []; // 存储的数组
  this.running = false; // 标志是否正在处理队列中的请求
};

/** 入队 同时触发出队列事件
 * @param {*} item Function 返回promise
 * @returns
 */
WaitQueue.prototype.enqueue = function (item) {
  // 队列满了
  this.items.push(item);
  if (this.items.length > 0 && !this.running) {
    this.running = true;
    this.dequeue();
  }
  return true;
};
/** 出队列 清空当前队列中所有任务
 *
 */
WaitQueue.prototype.dequeue = function () {
  const item = this.items.shift();
  if (item) {
    item().then((res) => {
      console.log("已处理事件" + res);
      this.dequeue();
    });
  } else {
    this.running = false;
  }
};

export default WaitQueue;
