Promise.myAll = (promiseArr) => {
  let result = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseArr.length; i++) {
      Promise.resolve(promiseArr[i]).then(
        (res) => {
          result[i] = res;
          count++;
          // 全部promise执行成功之后才resolve
          if (count === promiseArr.length) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
};

Promise.myRace = (promiseArr) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseArr.length; i++) {
      promiseArr[i].then(
        (res) => {
          // 只要有任何一个f状态变更就resolve
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
};

const promise1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 2000)
  })
}

const promise2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(2)
    }, 4000)
  })
}

// Promise.myAll([promise1(), promise2()]).then((res) => console.log(res));
Promise.myRace([promise1(), promise2()]).then((res) => console.log(res));
