/* eslint-disable no-param-reassign */
const parseJsDoc = require('react-docgen/dist/utils/parseJsDoc').default;
const { getMemberValuePath, resolveToValue } = require('react-docgen').utils;

function resolveDocumentation(documentation) {
  documentation._props.forEach(propDescriptor => {
    const { description } = propDescriptor;
    if (description.includes('@')) {
      const jsDoc = parseJsDoc(description);
      propDescriptor.description = jsDoc.description;
      if (jsDoc.params) {
        propDescriptor.params = jsDoc.params;
      }
      if (jsDoc.returns) {
        propDescriptor.returns = jsDoc.returns;
      }
    }
  });
}

/**
 * Extract info from the propType jsdoc blocks. Must be run after
 * propDocBlockHandler.
 */
export default function propTypeJsDocHandler(documentation, path) {
  let propTypesPath = getMemberValuePath(path, 'propTypes');
  if (!propTypesPath) {
    return;
  }
  propTypesPath = resolveToValue(propTypesPath);
  if (!propTypesPath) {
    return;
  }

  resolveDocumentation(documentation);
}
