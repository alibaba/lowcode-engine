export function getIdsFromSchema(schema, ids = []) {
  if (!schema) return ids;
  const { componentName, id, children } = schema;
  if (componentName) {
    ids.push(id);
  }
  if (Array.isArray(children) && children.length > 0) {
    children.forEach(node => getIdsFromSchema(node, ids));
  }
  return ids;
}

export function getNodeFromSchemaById(schema, _id) {
  if (!schema) return null;
  const { id, children } = schema;
  let retNode = null;
  if (_id === id) return schema;
  if (Array.isArray(children) && children.length > 0) {
    children.some(node => {
      retNode = getNodeFromSchemaById(node, _id);
      if (retNode) {
        return true;
      }
      return false;
    });
  }
  return retNode;
}