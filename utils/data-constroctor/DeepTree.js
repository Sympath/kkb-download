function DeepTree() {
  this.nodeMap = new Map();
  this.deeps = [];
  this.tree = this.formatNode();
}
/** 新增节点 如果已经有了就不会处理任何东西
 * @param nodeId key
 * @param node 节点值，如果没有传就会以key作为值
 */
DeepTree.prototype.addNode = function (nodeId, fNodeId) {
  // 获取节点结构 避免传递的是一个值
  let handledNode = this.formatNode(nodeId);
  let handledFNode = this.formatNode(fNodeId);
  // 1.1 如果父节点不在，就将父节点挂载在最外层
  if (!this.hasNode(fNodeId)) {
    // handledFNode.deep = 1;
    // 就将父节点挂载在最外层
    // this.tree.children.push(handledFNode);
    // 放在hash对象里面 方便查询获取
    this.nodeMap.set(fNodeId, handledFNode);
    this.addDeepNode(handledFNode.deep, fNodeId);
    // 再判断子节点是否存在，存在就不处理了；不存在就挂载
    if (!this.hasNode(nodeId)) {
      handledNode.deep = handledFNode.deep + 1;
      //   handledFNode.children.push(handledNode);
      this.nodeMap.set(nodeId, handledNode);
      this.addDeepNode(handledNode.deep, nodeId);
    }
  } else {
    let newDeep = handledFNode.deep + 1;
    // 1.2 如果父节点存在，则父节点不处理，判断子节点是否存在
    // 1.2.1 不存在，挂载子节点即可
    if (!this.hasNode(nodeId)) {
      handledNode.deep = newDeep;
      //   handledFNode.children.push(handledNode);
      this.nodeMap.set(nodeId, handledNode);
      this.addDeepNode(handledNode.deep, nodeId);
    } else {
      let oldDeep = this.nodeMap.get(nodeId).deep;
      if (newDeep > oldDeep) {
        // 1.2.2 存在 判断深度 新深度大于老深度则更新
        handledNode.deep = newDeep;
        //   先删除
        this.deeps[oldDeep].delete(nodeId);
        //   再新增;
        this.addDeepNode(handledNode.deep, nodeId);
        // handledFNode.children.push(handledNode);
        this.nodeMap.set(nodeId, handledNode);
      }
    }
  }
};

DeepTree.prototype.addDeepNode = function (deep, val) {
  if (!this.deeps[deep]) {
    this.deeps[deep] = new Set();
  }
  this.deeps[deep].add(val);
};
// 是否有对应节点
DeepTree.prototype.hasNode = function (nodeId) {
  return this.nodeMap.has(nodeId);
};
// 是否有对应节点
DeepTree.prototype.getNode = function (nodeId) {
  return this.nodeMap.get(nodeId);
};
DeepTree.prototype.formatNode = function (nodeVal) {
  if (typeof nodeVal === "object") {
    if (!nodeVal.children) {
      nodeVal.children = [];
    }
    if (!nodeVal.deep) {
      nodeVal.deep = 0;
    }
    if (!nodeVal.id) {
      console.error("请传递树id");
    }
  } else {
    if (this.hasNode(nodeVal)) {
      nodeVal = this.nodeMap.get(nodeVal);
    } else {
      nodeVal = {
        id: nodeVal,
        children: [],
        deep: 0, // 距离root节点的深度
      };
    }
  }
  return nodeVal;
};

export default DeepTree;

/**
 * @param arr [[f-node, c-node]]
 * return tree
 */
export function getTree(arr) {
  let tree = new DeepTree();
  function addNodeToTree(nodes) {
    // 解构关联关系 父节点 子节点
    let [cNodeId, fNodeId] = nodes;
    tree.addNode(cNodeId, fNodeId);
  }
  arr.forEach((nodes) => addNodeToTree(nodes));
  return tree;
}
