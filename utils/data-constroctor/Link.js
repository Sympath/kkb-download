// @lc code=start
/**
 * @param {number} capacity
 */
var Link = function (capacity) {
  this.capacity = capacity;
  this.map = new Map();
  // 虚拟头结点
  this.head = {
    prev: null,
    next: null,
  };
  this.tail = {
    prev: this.head,
    next: null,
  };
  this.head.next = this.tail;
};

/**
 * @param {number} key
 * @return {number}
 */
Link.prototype.get = function (key) {
  // console.log("get:",key, myprint(this.head));
  if (this.map.has(key)) {
    // 更新节点到头部
    let node = this.map.get(key);
    // console.log("get af:",key, myprint(this.head));
    return node.value;
  }
  return -1;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
Link.prototype.put = function (key, value) {
  let node = null;
  // 如果已经有
  if (this.map.has(key)) {
    node = this.map.get(key);
    node.value = value;
  }
  // 如果没有
  else {
    node = {
      key: key,
      value: value,
      prev: "",
      next: "",
    };
    this.nodeToHead(node, true);
    if (this.map.size > this.capacity) {
      let prevNodeKey = this.tail.prev.key;
      this.deleteNode(prevNodeKey);
    }
  }
  // console.log("put: ", key,this.map.size,  myprint(this.head));
};

/** 将指定节点插入最前面
 * @param {number} key
 * @return {void}
 */
Link.prototype.nodeToHead = function (key, newNode) {
  let node;
  //  如果是新创建的节点 则不需要脱离链表操作
  if (newNode) {
    node = key;
  } else {
    node = this.map.get(key);
    //脱：将node上下节点进行连接
    this.deleteNode(key);
  }
  // 插：将node插入head后面
  // 1、将head的原下个节点关联node
  this.head.next.prev = node;
  node.next = this.head.next;
  // 2. 将head关联node
  this.head.next = node;
  node.prev = this.head;
  // 3. 更新或新增值
  this.map.set(node.key, node);
};
/** 删除指定节点
 * @param {number} key
 * @return {void}
 */
Link.prototype.deleteNode = function (key) {
  let node = this.map.get(key);
  if (node) {
    //脱：将node上下节点进行连接
    // 1. 原节点的下节点prev 指向原节点的prev
    node.next.prev = node.prev;
    // 2. 原节点的上节点next 指向原节点的next
    node.prev.next = node.next;
    this.map.delete(node.key);
  }
};
