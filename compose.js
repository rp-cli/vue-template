function add() {
  return 10;
}

function multiple(a) {
  return a * 10;
}

const compose = (...arg) => {
  return function (x) {
    return arg.reduceRight((prev, cur) => {
      return cur(prev)
    }, x)
  }
}

// 我们来验证下这个方法
let calculate = compose(multiple, add);
let res = calculate(10);
console.log(res);    // 结果还是200
