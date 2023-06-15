const bindaryFind = (target, arr, low = 0, high = arr.length - 1) => {
  const midIndex = Math.floor(arr.length / 2);
  const cur = arr[midIndex];
  if (target === cur) {
    return -1;
  } else if (target < cur) {
    return bindaryFind(target, arr, low, midIndex - 1);
  } else if(target > cur){
    return bindaryFind(target, arr, midIndex + 1, high);
  }
};
