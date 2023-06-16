import { IContextData } from '../types';

function relativePath(from: string[], to: string[]): string[] {
  const length = Math.min(from.length, to.length);
  let samePartsLength = length;
  for (let i = 0; i < length; i++) {
    if (from[i] !== to[i]) {
      samePartsLength = i;
      break;
    }
  }
  if (samePartsLength === 0) {
    return to;
  }
  let outputParts = [];
  for (let i = samePartsLength; i < from.length; i++) {
    outputParts.push('..');
  }
  outputParts = [...outputParts, ...to.slice(samePartsLength)];
  if (outputParts[0] !== '..') {
    outputParts.unshift('.');
  }
  return outputParts;
}

export function getSlotRelativePath(options: {
  contextData: IContextData;
  from: string;
  to: string;
}) {
  const { contextData, from, to } = options;
  const isSingleComponent = contextData?.extraContextData?.projectRemark?.isSingleComponent;
  const template = contextData?.extraContextData?.template;
  let toPath = template.slots[to].path;
  toPath = [...toPath, template.slots[to].fileName!];
  let fromPath = template.slots[from].path;
  if (!isSingleComponent && ['components', 'pages'].indexOf(from) !== -1) {
    fromPath = [...fromPath, 'pageName'];
  }
  return relativePath(fromPath, toPath).join('/');
}