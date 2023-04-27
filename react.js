ReactDOM.render(<div>title</div>, document.getElementById('root'));

import { createHostRootFiber } from './ReactFiber';
import { updateContainer } from './ReactFiberReconciler';
import { initializeUpdateQuene } from './ReactUpdateQuene';
// ReactDom.render 开始把虚拟dom渲染到容器中
function render(element, container) {
  let fiberRoot = createFiberRoot(container);
  updateContainer(element, fiberRoot);
}

const ReactDOM = {
  render,
};

// createFiberRoot  创建fiberRootNode（真实dom，id = 'root'）和hostRootFiber（stateNode指向fiberRootNode）

const HostRoot = 3;

function createFiberRoot(containerInfo) {
  const fiberRoot = { containerInfo }; // fiberRoot指的就是容器对象containerInfo  div#root
  const hostRootFiber = createHostRootFiber(); // 创建fiber树的根节点   这两个对应上面说的
  // 当前fiberRoot的current指向这个根fiber
  fiberRoot.current = hostRootFiber;
  // 让此根fiber的真实节点指向fiberRoot div#root  stateNode就是指真实dom的意思
  hostRootFiber.stateNode = fiberRoot;
  initializeUpdateQuene(hostRootFiber);
  return fiberRoot;
}

