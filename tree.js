const arr = [
    { id: 1, name: '部门1', pid: 0 },
    { id: 2, name: '部门2', pid: 1 },
    { id: 3, name: '部门3', pid: 1 },
    { id: 4, name: '部门4', pid: 3 },
    { id: 5, name: '部门5', pid: 4 },
]

const newArr = [...arr];


const arrayToTree = (arr, data) => {
    arr.forEach(item1 => {
        if(item1.children){
            arrayToTree(item1.children, data)
        }
        newArr.forEach(item2 => {
            if(item2.pid === item1.id){
                if(!item1.children){
                    item1.children = [];
                }
                item1.children.push(item2);
            }
        })
    });
}

arrayToTree(arr, newArr)

const tree = arr.filter(item => item.pid === 0);
