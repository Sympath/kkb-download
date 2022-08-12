var ArrayQueue = function (n) {
  this.n = n; // 队列容量
  this.items = []; // 存储的数组
  this.count = 0; // 队列内元素个数
  this.head = 0;
  this.tail = 0;
};

// 入队
ArrayQueue.prototype.enqueue = function (item) {
  // 队列已经满了
  if (this.tail == this.n) {
    // tail ==n && head==0，表示整个队列都占满了
    if (this.head == 0) return false;
    // 数据搬移
    for (let i = this.head; i < this.tail; ++i) {
      this.items[i - this.head] = this.items[i];
    }
    // 搬移完之后重新更新this.head和tail
    this.tail -= this.head;
    this.head = 0;
  }

  this.items[this.tail] = item;
  ++this.tail;
  return true;
};
// 出队
ArrayQueue.prototype.dequeue = function () {
  if (this.head === this.tail) {
    return null;
  }
  return this.items.unshift();
};
