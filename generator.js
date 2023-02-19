function* gen() {
  const res1 = yield new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(1);
    }, 1000)
  );
  console.log(res1);
  const res2 = yield new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(2);
    }, 1000)
  );
  console.log(res2);
  return res2;
}

function run(gen) {
  const g = gen();

  return function () {
    return new Promise((resolve, reject) => {
        function next(data) {
            var result = g.next(data);
            if (result.done) {
              resolve(result.value);
              return result.value;
            }
            result.value.then(function (data) {
              next(data);
            });
          }
      
          next();
    })
  };
}

const asyncFunc = run(gen);

asyncFunc();

async function gen() {
  const res1 = await new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(1);
    }, 1000)
  );
  console.log(res1);
  const res2 = await new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(2);
    }, 1000)
  );
  console.log(res2);
}
