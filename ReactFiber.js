export function createHostRootFiber() {
  return createFiber(HostRoot);
}

/**
 * 创建fiber节点
 * @date 2023-04-24
 * @param {any} tag  fiber的标签  HostRoot指的是根结点（HostRoot的tag是3，对应的真实dom节点 div#root）  HostComponent（tag是5，例如div，span）
 * @param {any} pendingProps  等待生效的属性对象
 * @param {any} key
 * @returns {any}
 */
 function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.pendingProps = pendingProps;
  this.key = key;
}
