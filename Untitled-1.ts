

class List{
  constructor(arr){
    this.quene = {};
    arr.forEach((item, index) => {
      this.quene['item'] = item;
      if(index === 0){
        this.quene['item']['isHead'] = true;
        this.quene['item']['next'] = arr[index + 1];
      }
      else if(index < arr.length - 1){
        this.quene['item']['last'] = arr[index - 1];
        this.quene['item']['next'] = arr[index + 1];
      }else if(index === arr.length - 1){
        this.quene['item']['last'] = arr[index - 1];
        this.quene['item']['isTail'] = true;
      }
    })
  }

  delete = (item) => {
    const { next, isHead, isTail } = this.quene[item];
    if(isTail){
        const last = this.quene[item]
    }
    // delete this.quene[item];
  }
}

const list = new List(['john', 'sally', 'jack'])     1   2   3