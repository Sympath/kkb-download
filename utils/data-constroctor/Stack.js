var ArrayStack = function (n) {
  this.n = n; // 栈容量
  this.items = []; // 存储的数组
  this.count = 0; // 站内元素个数
};

ArrayStack.prototype.push = function (item) {
  if (this.count === this.n) {
    return false;
  }
  this.items[this.count] = item;
  ++this.count;
  return true;
};

ArrayStack.prototype.pop = function () {
  if (this.count === 0) {
    return null;
  }
  return this.items.pop();
};
