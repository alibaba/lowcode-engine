export default function checkIsIIFE(path: any) {
  return (
    path.value &&
    path.value.callee &&
    path.value.callee.type === 'FunctionExpression' &&
    path.node.type === 'CallExpression'
  );
}
