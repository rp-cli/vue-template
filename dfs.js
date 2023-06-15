const bt = {
  val: 'A',
  left: {
    val: 'B',
    left: { val: 'D', left: null, right: null },
    right: { val: 'E', left: null, right: null },
  },
  right: {
    val: 'C',
    left: {
      val: 'F',
      left: { val: 'H', left: null, right: null },
      right: { val: 'I', left: null, right: null },
    },
    right: { val: 'G', left: null, right: null },
  },
}

const dfs = (root) => {
  if(!root) return;
  console.log(root.val, 'root.val');
  root.left && dfs(root.left);
  root.right && dfs(root.right);
}

dfs(bt);