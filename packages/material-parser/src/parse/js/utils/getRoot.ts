export default function getRoot(path: any) {
  let root = path.parent;
  while (root.parent) {
    root = root.parent;
  }
  return root;
}
