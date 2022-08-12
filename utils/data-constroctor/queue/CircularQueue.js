var CircularQueue = function (n) {
  this.n = n; // 队列容量
  this.items = []; // 存储的数组
  this.count = 0; // 队列内元素个数
  this.head = 0;
  this.tail = 0;
};

// 入队
CircularQueue.prototype.enqueue = function (item) {
  // 队列满了
  if ((this.tail + 1) % this.n == this.head) return false;
  this.items[this.tail] = item;
  this.tail = (this.tail + 1) % this.n;
  return true;
};
// 出队
CircularQueue.prototype.dequeue = function () {
  // 如果this.head == this.tail 表示队列为空
  if (this.head == this.tail) return null;
  let ret = this.items[this.head];
  this.head = (this.head + 1) % this.n;
  return ret;
};
