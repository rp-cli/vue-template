

/**
 * 冒泡排序
 * @param arr 数组
 * @return 数组
 */
function bubbleSort(arr) {
  let len = arr.length;
  for (let j = len; j >= 2; j--) {
    for (let i = 0; i <= j - 1; i++) {
      if (arr[i + 1] < arr[i]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
  }
  return arr;
}

// bubbleSort(arr);

/**
 * 选择排序
 * 最小的放开头
 */

function selectSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = i; j < len; j++) {
        if(arr[j] < arr[i]){
            [arr[j], arr[i]] = [arr[i], arr[j]]
        }
    }
  }
  return arr;
}

selectSort(arr);

// vue需不需要会，肯定需要，但是学不动了

// 插入排序
function insertSort(arr) {
    for(let i = 1; i < arr.length; i++) {  //外循环从1开始，默认arr[0]是有序段
        for(let j = i; j > 0; j--) {  //j = i,将arr[j]依次插入有序段中
            if(arr[j] < arr[j-1]) {
                [arr[j],arr[j-1]] = [arr[j-1],arr[j]];
            } else {
                break;
            }
        }
    }
    return arr;
}

insertSort(arr);

const arr = [1, 3, 2, 5, 8, 7, 9, 10, 4, 6, 0];

// 快速排序
function quickSort(arr) {
    if(arr.length <= 1) {
        return arr;  //递归出口
    }
    let left = [],
        right = [],
        current = arr.splice(0,1); //注意splice后，数组长度少了一个   
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] < current) {
            left.push(arr[i])  //放在左边
        } else {
            right.push(arr[i]) //放在右边
        }
    }
    return quickSort(left).concat(current,quickSort(right)); //递归
}

quickSort(arr);
