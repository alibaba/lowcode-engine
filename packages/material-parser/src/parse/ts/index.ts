import { Parser, ComponentDoc } from 'react-docgen-typescript';
import ts, { SymbolFlags, TypeFlags } from 'typescript';
import { isEmpty, isEqual } from 'lodash';
import { debug } from '../../core';
import { Json } from '../../types';
import { transformItem } from '../transform';

const log = debug.extend('parse:ts');

type ExtendedType = ts.Type & {
  id: string;
  typeArguments: any[];
};

function getSymbolName(symbol: ts.Symbol) {
  // @ts-ignore
  const prefix: string = symbol.parent && getSymbolName(symbol.parent);
  const name = symbol.getName();
  if (prefix && prefix.length <= 20) {
    return `${prefix}.${name}`;
  }
  return name;
}

const blacklistNames = [
  'prototype',
  'getDerivedStateFromProps',
  'propTypes',
  'defaultProps',
  'contextTypes',
  'displayName',
  'contextType',
  'Provider',
  'Consumer',
];

function getDocgenTypeHelper(
  checker: ts.TypeChecker,
  type: ts.Type,
  skipRequired = false,
  parentIds: number[] = [],
  isRequired = false,
): any {
  function isTuple(_type: ts.Type) {
    // @ts-ignore use internal methods
    return checker.isArrayLikeType(_type) && !checker.isArrayType(_type);
  }
  let required: boolean;
  if (isRequired !== undefined) {
    required = isRequired;
  } else {
    required = !(type.flags & SymbolFlags.Optional) || isRequired;
  }

  function makeResult(typeInfo: Json) {
    if (skipRequired) {
      return {
        raw: checker.typeToString(type),
        ...typeInfo,
      };
    } else {
      return {
        required,
        raw: checker.typeToString(type),
        ...typeInfo,
      };
    }
  }

  function getShapeFromArray(symbolArr: ts.Symbol[], _type: ts.Type) {
    const shape: Array<{
      key:
      | {
        name: string;
      }
      | string;
      value: any;
    }> = symbolArr.map(prop => {
      const propType = checker.getTypeOfSymbolAtLocation(
        prop,
        // @ts-ignore
        prop.valueDeclaration || (prop.declarations && prop.declarations[0]) || {},
      );
      return {
        key: prop.getName(),

        value: getDocgenTypeHelper(
          checker,
          propType,
          false,
          // @ts-ignore
          [...parentIds, _type.id],
          // @ts-ignore
          prop?.valueDeclaration?.questionToken ? false : undefined,
        ),
      };
    });
    // @ts-ignore use internal methods
    if (checker.isArrayLikeType(_type)) {
      return shape;
    }
    if (_type.getStringIndexType()) {
      // @ts-ignore use internal methods
      if (!_type.stringIndexInfo) {
        return shape;
      }
      shape.push({
        key: {
          name: 'string',
        },
        // @ts-ignore use internal methods
        value: getDocgenTypeHelper(checker, _type.stringIndexInfo.type, false, [
          ...parentIds,
          (_type as ExtendedType).id,
        ]),
      });
    } else if (_type.getNumberIndexType()) {
      // @ts-ignore use internal methods
      if (!_type.numberIndexInfo) {
        return shape;
      }
      shape.push({
        key: {
          name: 'number',
        },

        // @ts-ignore use internal methods
        value: getDocgenTypeHelper(checker, _type.numberIndexInfo.type, false, [
          ...parentIds,
          (_type as ExtendedType).id,
        ]),
      });
    }
    return shape;
  }

  function getShape(_type: ts.Type) {
    const { symbol } = _type;
    if (symbol && symbol.members) {
      // @ts-ignore
      const props: ts.Symbol[] = Array.from(symbol.members.values());
      return getShapeFromArray(
        props.filter(prop => prop.getName() !== '__index'),
        _type,
      );
    } else {
      // @ts-ignore
      const args = _type.resolvedTypeArguments || [];
      const props = checker.getPropertiesOfType(_type);
      const shape = getShapeFromArray(props.slice(0, args.length), _type);
      return shape;
    }
  }

  const pattern = /^__global\.(.+)$/;
  // @ts-ignore
  if (parentIds.includes(type.id)) {
    return makeResult({
      name: checker.typeToString(type),
    });
  }
  if (type.symbol) {
    const symbolName = getSymbolName(type.symbol);
    if (symbolName) {
      const matches = pattern.exec(symbolName);
      if (matches) {
        return makeResult({
          name: matches[1],
        });
      }
    }
  }
  if (type.flags & TypeFlags.Number) {
    return makeResult({
      name: 'number',
    });
  } else if (type.flags & TypeFlags.String) {
    return makeResult({
      name: 'string',
    });
  } else if (type.flags & TypeFlags.NumberLiteral) {
    return makeResult({
      name: 'literal',
      // @ts-ignore
      value: type.value,
    });
  } else if (type.flags & TypeFlags.Literal) {
    return makeResult({
      name: 'literal',
      value: checker.typeToString(type),
    });
    // @ts-ignore
  } else if (type.flags & TypeFlags.DisjointDomains) {
    return makeResult({
      name: checker.typeToString(type),
    });
  } else if (type.flags & TypeFlags.Any) {
    return makeResult({
      name: 'any',
    });
  } else if (type.flags & TypeFlags.Union) {
    return makeResult({
      name: 'union',
      // @ts-ignore
      value: type.types.map(t => getDocgenTypeHelper(checker, t, true, [...parentIds, type.id])),
    });
  } else if (type.flags & (TypeFlags.Object | TypeFlags.Intersection)) {
    if (isTuple(type)) {
      const props = getShape(type);
      return makeResult({
        name: 'union',
        value: props.map(p => p.value),
      });
      // @ts-ignore
    } else if (checker.isArrayType(type)) {
      return makeResult({
        name: 'Array',
        // @ts-ignore
        elements: [
          getDocgenTypeHelper(checker, (type as ExtendedType).typeArguments[0], false, [
            ...parentIds,
            (type as any).id,
          ]),
        ],
      });
    } else if (type.aliasSymbol) {
      return makeResult({
        name: getSymbolName(type.aliasSymbol),
      });
      // @ts-ignore
    } else if (type?.symbol?.valueDeclaration?.parameters?.length) {
      return makeResult({
        name: 'func',
      });
    } else {
      const props = getShape(type);
      return makeResult({
        name: 'signature',
        type: {
          signature: {
            properties: props,
          },
        },
      });
    }
  } else {
    return makeResult({
      name: 'any',
    });
  }
}
class MyParser extends Parser {
  getDocgenType(propType: ts.Type): any {
    // @ts-ignore
    const result = getDocgenTypeHelper(this.checker, propType, true);
    return result;
  }
}

const compilerOptions = {
  jsx: ts.JsxEmit.React,
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.Latest,
};

interface SymbolWithMeta extends ts.Symbol {
  meta?: {
    exportName: string;
    subName?: string;
  };
}

export default function parseTS(
  filePathOrPaths: string | string[],
  parserOpts: any = {},
): ComponentDoc[] {
  const filePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths];

  const program = ts.createProgram(filePaths, compilerOptions);

  const parser = new MyParser(program, parserOpts);

  const checker = program.getTypeChecker();

  const result = filePaths
    .map(filePath => program.getSourceFile(filePath))
    .filter(sourceFile => typeof sourceFile !== 'undefined')
    .reduce((docs: any[], sourceFile) => {
      const moduleSymbol = checker.getSymbolAtLocation(sourceFile as ts.Node);

      if (!moduleSymbol) {
        return docs;
      }

      const exportSymbols = checker.getExportsOfModule(moduleSymbol);

      for (let index = 0; index < exportSymbols.length; index++) {
        const sym: SymbolWithMeta = exportSymbols[index];
        const name = sym.getName();
        if (blacklistNames.includes(name)) {
          continue;
        }
        // @ts-ignore
        const info = parser.getComponentInfo(sym, sourceFile, parserOpts.componentNameResolver);
        if (info === null) {
          continue;
        }
        const exportName = sym.meta && sym.meta.exportName;
        const meta = {
          subName: exportName ? name : '',
          exportName: exportName || name,
        };
        if (docs.find(x => isEqual(x.meta, meta))) {
          continue;
        }
        docs.push({
          ...info,
          meta,
        });
        // find sub components
        if (!!sym.declarations && sym.declarations.length === 0) {
          continue;
        }

        const type = checker.getTypeOfSymbolAtLocation(
          sym,
          sym.valueDeclaration || sym.declarations[0],
        );

        Array.prototype.push.apply(
          exportSymbols,
          type.getProperties().map((x: SymbolWithMeta) => {
            x.meta = { exportName: name };
            return x;
          }),
        );
      }

      return docs;
    }, []);
  const coms = result.reduce((res: any[], info: any) => {
    if (!info || !info.props || isEmpty(info.props)) return res;
    const props = Object.keys(info.props).reduce((acc: any[], name) => {
      try {
        const item: any = transformItem(name, info.props[name]);
        acc.push(item);
      } catch (e) {
        log(e);
      }
      return acc;
    }, []);
    res.push({
      componentName: info?.meta?.exportName || info.displayName,
      props,
      meta: info.meta || {},
    });
    return res;
  }, []);
  return coms;
}
