class CircularLinkList {
  constructor() {

  }
  #head = null;
  #length = 0;
  #Node = class{
      constructor(element) {
          this.element = element;
          this.next = null;
      }
  }

  append = (element) => {
      const node = new this.#Node(element);
      let currentNode = this.#head;
      if(this.#head){
          while(currentNode.next !== this.#head){
              currentNode = currentNode.next;
          }
          currentNode.next = node;
          node.next = this.#head;
      } else{
          this.#head = node;
          node.next = this.#head;
      }
      this.#length++;
  }

  insert = (position, element) => {
      if(position < 0 || position >= this.#length){
          return false;
      }
      const node = new this.#Node(element);
      let previousNode;
      let currentNode = this.#head;
      
      if(position === 0){
          node.next = this.#head;
          this.#head = node;
      }
      for(let i = 0; i < position; i++){
          previousNode = currentNode;
          currentNode = currentNode.next;
      }

      previousNode.next = node;
      node.next = currentNode;

      this.#length ++;
  }

  // 从链表的特定位置移除一项
  removeAt = (position) => {
    if ((position < 0 && position >= this.#length) || this.#length === 0) {
      // 越界
      return false;
    } else {
      let currentNode = this.#head;
      let previousNode;

      if (position === 0) {
        this.#head = currentNode.next;
      } else {
        // 循环找到位置

            for(let i = 0; i < position; i++){
                previousNode = currentNode;
                currentNode = currentNode.next;
            }
        // 把当前节点的 next 指针 指向 当前节点的 next 指针，即是 删除了当前节点
            previousNode.next = currentNode.next;
      }

      this.#length--;
    }
  };

  // 从链表中移除指定项
  remove = (element) => {
    const index = this.indexOf(element);
    return this.removeAt(index);
  };

  list = () => {
      return this.#head;
  };

  // 由于链表使用了 Node 类，就需要重写继承自 JavaScript 对象默认的 toString() 方法，让其只输出元素的值
  toString = () => {
    let currentNode = this.#head;
    let string = '';

    for(let i = 0; i < this.#length && currentNode; i++){
      string += ',' + currentNode.element;
      currentNode = currentNode.next;
    }

    return string.slice(1);
  };

    // 打印链表数据
  print = () => {
    console.log(this.toString());
  };


  // 返回元素在链表的索引，如果链表中没有该元素则返回 -1
  indexOf = (element) => {
    let currentNode = this.#head;
    let index = 0;

    while (currentNode) {
      if (currentNode.element === element) {
        return index;
      }

      index++;
      currentNode = currentNode.next;
    }

    return -1;
  };
}

const circularLinkList = new CircularLinkList();

circularLinkList.append('Tom');
circularLinkList.append('Peter');
circularLinkList.append('Paul');

circularLinkList.insert(1, 'Jack');
circularLinkList.print(); // "Tom,Jack,Peter,Paul"



// {
//   element: first,
//   next: {
//       element: second,
//       next: {
//           element: third,
//           next: null
//       },
//       prev: {
//           element: first,
//           next: {
//               element: second,
//               next: {
//                   element: third,
//                   next: null
//               },
//               prev: ...
//           }
//       },
//   },
//   prev: null,
// }