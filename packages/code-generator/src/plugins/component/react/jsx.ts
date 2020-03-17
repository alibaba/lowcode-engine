import { REACT_CHUNK_NAME } from './const';

import { generateCompositeType } from '../../utils/compositeType';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
  IComponentNodeItem,
  IContainerInfo,
  IInlineStyle,
  IJSExpression,
} from '../../../types';

function generateInlineStyle(style: IInlineStyle): string | null {
  const attrLines = Object.keys(style).map((cssAttribute: string) => {
    const [isString, valueStr] = generateCompositeType(style[cssAttribute]);
    const valuePart = isString ? `'${valueStr}'` : valueStr;
    return `${cssAttribute}: ${valuePart},`;
  });

  if (attrLines.length === 0) {
    return null;
  }

  return `{ ${attrLines.join('')} }`;
}

function generateAttr(attrName: string, attrValue: any): string {
  const [isString, valueStr] = generateCompositeType(attrValue);
  return `${attrName}=${isString ? `"${valueStr}"` : `{${valueStr}}`}`;
}

function generateNode(nodeItem: IComponentNodeItem): string {
  const codePieces: string[] = [];
  const { className, style, ...props } = nodeItem.props;

  codePieces.push(`<${nodeItem.componentName}`);
  if (className) {
    codePieces.push(`className="${className}"`);
  }
  if (style) {
    const inlineStyle = generateInlineStyle(style);
    if (inlineStyle !== null) {
      codePieces.push(`style={${inlineStyle}}`);
    }
  }

  const propLines = Object.keys(props).map((propName: string) =>
    generateAttr(propName, props[propName]),
  );
  codePieces.push.apply(codePieces, propLines);

  if (nodeItem.children && nodeItem.children.length > 0) {
    codePieces.push('>');
    const childrenLines = nodeItem.children.map(child => generateNode(child));
    codePieces.push.apply(codePieces, childrenLines);
    codePieces.push(`</${nodeItem.componentName}>`);
  } else {
    codePieces.push('/>');
  }

  if (nodeItem.loop && nodeItem.loopArgs) {
    let loopDataExp;
    if ((nodeItem.loop as IJSExpression).type === 'JSExpression') {
      loopDataExp = `(${(nodeItem.loop as IJSExpression).value})`;
    } else {
      loopDataExp = JSON.stringify(nodeItem.loop);
    }
    codePieces.unshift(
      `${loopDataExp}.map((${nodeItem.loopArgs[0]}, ${nodeItem.loopArgs[1]}) => (`,
    );
    codePieces.push('))');
  }

  if (nodeItem.condition) {
    codePieces.unshift(`(${generateCompositeType(nodeItem.condition)}) && (`);
    codePieces.push(')');
  }

  if (nodeItem.condition || (nodeItem.loop && nodeItem.loopArgs)) {
    codePieces.unshift('{');
    codePieces.push('}');
  }

  return codePieces.join(' ');
}

const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  const ir = next.ir as IContainerInfo;

  let jsxContent: string;
  if (!ir.children || ir.children.length === 0) {
    jsxContent = 'null';
  } else if (ir.children.length === 1) {
    jsxContent = `(${generateNode(ir.children[0])})`;
  } else {
    jsxContent = `(<React.Fragment>${ir.children
      .map(child => generateNode(child))
      .join('')}</React.Fragment>)`;
  }

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: REACT_CHUNK_NAME.ClassRenderJSX,
    content: `return ${jsxContent};`,
    linkAfter: [
      REACT_CHUNK_NAME.ClassRenderStart,
      REACT_CHUNK_NAME.ClassRenderPre,
    ],
  });

  return next;
};

export default plugin;
