// const arr1 = [
//   { id: 1, name: '部门1', pid: 0 },
//   { id: 2, name: '部门2', pid: 1 },
//   { id: 3, name: '部门3', pid: 1 },
//   { id: 4, name: '部门4', pid: 3 },
//   { id: 5, name: '部门5', pid: 4 },
// ]

// const arr2 = [
//   { id: 1, name: '部门1', pid: 0 },
//   { id: 2, name: '部门2', pid: 1 },
//   { id: 3, name: '部门3', pid: 1 },
//   { id: 4, name: '部门4', pid: 3 },
//   { id: 5, name: '部门5', pid: 4 },
// ]

// // 先写个递归解一下吧
// function getChild(arr1, arr2){
//   arr1.forEach(item1 => {
//     arr2.forEach(item2 => {
//       if(item2.pid === item1.id){
//         if(!item1.children){
//           item1.children = [];
//         }
//         if(item1.children.every(item => item.id !== item2.id)){
//           item1.children.push(item2);
//         }
//       } else {
//         if(item1.children){
//           console.log(item1, 'item1');
//           getChild(item1.children, arr2);
//         }
//       }
//     })
//   })
// }

// getChild(arr1, arr2)

// // const final = arr1.filter(item => item.id === 1);

// console.log(arr1, 'arr1')

// const arr1 = [
//   { id: 2, name: "部门2", pid: 1 },
//   { id: 1, name: "部门1", pid: 0 },
//   { id: 3, name: "部门3", pid: 1 },
//   { id: 4, name: "部门4", pid: 3 },
//   { id: 6, name: "部门6", pid: 3 },
//   { id: 5, name: "部门5", pid: 4 },
// ];

// const obj = {};

// arr1.forEach((item) => {
//   obj[item.id] = item;
// });

// arr1.forEach((item) => {
//   const { pid, id } = item;
//   if (obj[pid]) {
//     if (!obj[pid].children) {
//       obj[pid].children = [];
//     }
//     obj[pid].children.push(obj[id]);
//   }
// });

// const final = arr1.filter((item) => item.id === 1);

// console.log(arr1, "arr1");

const arr1 = [
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
  { id: 1, name: "部门1", pid: 0 },
];

function buildTree(arr, parentId) {
  let tree = [];
  arr.forEach(item => {
    if (item.pid === parentId) {
      let children = buildTree(arr, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  });

  return tree;
}

const arrTree = buildTree(arr1, 0);

console.log(arrTree);