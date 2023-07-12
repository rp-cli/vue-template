function serialAsyncFunc(arr) {
  // for (const item of arr) {
  //   await asyncFunc(item); // 等待异步操作执行完成
  // }
  arr.forEach(async element => {
    await asyncFunc(element);
  });
}

async function asyncFunc(item) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(item); // 打印当前执行的元素
      resolve();
    }, 1000);
  });
}

serialAsyncFunc(arr);


function asyncFunc(item) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(item); // 打印当前执行的元素
      resolve();
    }, 1000);
  });
}

arr.reduce(async (acc, item) => {
  await acc; // 等待上一个操作完成
  await asyncFunc(item); // 等待异步操作执行完成
}, Promise.resolve());


function asyncFunc(item) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(item); // 打印当前执行的元素
      resolve();
    }, 1000);
  });
}

async function serialAsyncFunc(arr) {
  for (let i = 0; i < arr.length; i++) {
    await asyncFunc(arr[i]); // 等待异步操作执行完成
  }
}

const arr = [1, 2, 3, 4, 5];
serialAsyncFunc(arr);


