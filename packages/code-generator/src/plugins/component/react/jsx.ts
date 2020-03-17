import {
  BuilderComponentPlugin,
  ChildNodeItem,
  ChildNodeType,
  ChunkType,
  FileType,
  ICodeStruct,
  IComponentNodeItem,
  IContainerInfo,
  IInlineStyle,
  IJSExpression,
} from '../../../types';

import { handleChildren } from '@/utils/children';
import { generateCompositeType } from '../../utils/compositeType';
import { REACT_CHUNK_NAME } from './const';

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
  if (attrName === 'initValue' || attrName === 'labelCol') {
    return '';
  }
  const [isString, valueStr] = generateCompositeType(attrValue);
  return `${attrName}=${isString ? `"${valueStr}"` : `{${valueStr}}`}`;
}

function mapNodeName(src: string): string {
  if (src === 'Div') {
    return 'div';
  }
  return src;
}

function generateNode(nodeItem: IComponentNodeItem): string {
  const codePieces: string[] = [];
  let propLines: string[] = [];
  const { className, style, ...props } = nodeItem.props;

  codePieces.push(`<${mapNodeName(nodeItem.componentName)}`);
  if (className) {
    propLines.push(`className="${className}"`);
  }
  if (style) {
    const inlineStyle = generateInlineStyle(style);
    if (inlineStyle !== null) {
      propLines.push(`style={${inlineStyle}}`);
    }
  }

  propLines = propLines.concat(
    Object.keys(props).map((propName: string) =>
      generateAttr(propName, props[propName]),
    ),
  );
  codePieces.push(` ${propLines.join(' ')} `);

  if (nodeItem.children && (nodeItem.children as unknown[]).length > 0) {
    codePieces.push('>');
    const childrenLines = generateChildren(nodeItem.children);
    codePieces.push.apply(codePieces, childrenLines);
    codePieces.push(`</${mapNodeName(nodeItem.componentName)}>`);
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

  return codePieces.join('');
}

function generateChildren(children: ChildNodeType): string[] {
  return handleChildren<string>(children, {
    // TODO: 如果容器直接只有一个 字符串 children 呢？
    string: (input: string) => [input],
    expression: (input: IJSExpression) => [`{${input.value}}`],
    node: (input: IComponentNodeItem) => [generateNode(input)],
  });
}

const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  const ir = next.ir as IContainerInfo;

  let jsxContent: string;
  if (!ir.children || (ir.children as unknown[]).length === 0) {
    jsxContent = 'null';
  } else {
    const childrenCode = generateChildren(ir.children);
    if (childrenCode.length === 1) {
      jsxContent = `(${childrenCode[0]})`;
    } else {
      jsxContent = `(<React.Fragment>${childrenCode.join(
        '',
      )}</React.Fragment>)`;
    }
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
