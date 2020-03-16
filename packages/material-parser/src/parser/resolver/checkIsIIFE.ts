module.exports = function checkIsIIFE(path: any) {
  return (
    path.value.callee &&
    path.value.callee.type === 'FunctionExpression' &&
    path.node.type === 'CallExpression'
  );
};
