let express = require("express");
let app = express();
app.get("/say", function (req, res) {
  let { wd, callback } = req.query;
  console.log(wd); // Iloveyou
  console.log(callback); // show
  res.end(`${callback}('我不爱你')`);
});
app.listen(3000);

const arr = [1, 3, 2, 5, 8, 7, 9, 10, 4, 6, 0];
// function bubbleSort(arr) {
//   var len = arr.length;
//   for (let outer = len ; outer >= 2; outer--) {
//       for(let inner = 0; inner <=outer - 1; inner++) {
//           if(arr[inner] > arr[inner + 1]) {
//               let temp = arr[inner];
//               arr[inner] = arr[inner + 1];
//               arr[inner + 1] = temp;
//           }
//       }
//   }
//   return arr;
// }

// bubbleSort(arr)

function bubbleSort(arr) {
  let len = arr.length;
  for (let i = len; i >= 2; i--) {
    for (let j = 0; j <= i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    return arr;
  }
}

bubbleSort(arr);

window.xxx = 'zzp';