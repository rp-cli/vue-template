/**
 * 不管如何更新，不管谁来更新，都会调度到这个方法里
 * @param {*} fiber 
 */
export function scheduleUpdateOnFiber(fiber){
  const fiberRoot = markUpdateLaneFromFiberToRoot(fiber);
  performSyncWorkOnRoot(fiberRoot);
}

function performSyncWorkOnRoot(fiberRoot){
  console.log(fiberRoot, 'fiberRoot');
}

function markUpdateLaneFromFiberToRoot(sourceFiber){
  let node = sourceFiber;
  let parent = node.return;
  while (parent) {  // 一直往上找到fiber树的根节点
    node = parent;
    parent = parent.return;
  }
  // node其实就是fiber树的根节点，hostFiberRoot.stateNode  div#root
  return node.stateNode;
}