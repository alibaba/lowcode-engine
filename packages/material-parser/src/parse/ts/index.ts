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

function getNextParentIds(parentIds: number[], type: ts.Type) {
  // @ts-ignore
  const id = type?.symbol?.id;
  if (id) {
    return [...parentIds, id];
  }
  return parentIds;
}

function getSymbolName(symbol: ts.Symbol) {
  // @ts-ignore
  const prefix: string = symbol?.parent && getSymbolName(symbol.parent);
  const name = symbol.getName();
  if (prefix && prefix.length <= 20) {
    return `${prefix}.${name}`;
  }
  return name;
}

function getFunctionParams(parameters: any[] = [], checker, parentIds, type) {
  return parameters.map(node => {
    const typeObject = checker.getTypeOfSymbolAtLocation(node.symbol, node.symbol.valueDeclaration);
    const v = getDocgenTypeHelper(checker, typeObject, false, getNextParentIds(parentIds, type));
    const name = node.symbol.escapedName;
    return {
      name,
      propType: v,
    };
  });
}

/**
 * Indicates that a symbol is an alias that does not merge with a local declaration.
 * OR Is a JSContainer which may merge an alias with a local declaration
 */
// function isNonLocalAlias(
//   symbol: ts.Symbol | undefined,
//   excludes = SymbolFlags.Value | SymbolFlags.Type | SymbolFlags.Namespace,
// ): symbol is ts.Symbol {
//   if (!symbol) return false;
//   return (
//     (symbol.flags & (SymbolFlags.Alias | excludes)) === SymbolFlags.Alias ||
//     !!(symbol.flags & SymbolFlags.Alias && symbol.flags & SymbolFlags.Assignment)
//   );
// }

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

const blacklistPatterns = [
  /^HTML/,
  /^React\./,
  /^Object$/,
  /^Date$/,
  /^Promise$/,
  /^XML/,
  /^Function$/,
];

function hasTooManyTypes(type) {
  return type?.types?.length >= 20;
}

function isComplexType(type) {
  let isAliasSymbol = false;
  let symbol = type?.symbol;
  if (!symbol) {
    symbol = type?.aliasSymbol;
    isAliasSymbol = true;
  }
  if (!symbol) return false;
  if (isAliasSymbol && !hasTooManyTypes(type)) {
    return false;
  }
  const name = getSymbolName(symbol);
  if (blacklistPatterns.some(patt => patt.test(name))) {
    return true;
  }
  return false;
}

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
          getNextParentIds(parentIds, _type),
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
        value: getDocgenTypeHelper(
          checker,
          // @ts-ignore use internal methods
          _type.stringIndexInfo.type,
          false,
          getNextParentIds(parentIds, _type),
        ),
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

        value: getDocgenTypeHelper(
          checker,
          // @ts-ignore use internal methods
          _type.numberIndexInfo.type,
          false,
          getNextParentIds(parentIds, _type),
        ),
      });
    }
    return shape;
  }

  function getShape(_type: ts.Type) {
    const { symbol } = _type;
    if (symbol && symbol.members) {
      // @ts-ignore
      const props: ts.Symbol[] = Array.from(symbol.members.values());
      if (props.length >= 20) {
        throw new Error('too many props');
      }
      return getShapeFromArray(
        props.filter(prop => prop.getName() !== '__index'),
        _type,
      );
    } else {
      // @ts-ignore
      const args = _type.resolvedTypeArguments || [];
      const props = checker.getPropertiesOfType(_type);
      if (props.length >= 20) {
        throw new Error('too many props');
      }
      const shape = getShapeFromArray(props.slice(0, args.length), _type);
      return shape;
    }
  }

  const pattern = /^__global\.(.+)$/;
  // @ts-ignore
  if (parentIds.includes(type?.symbol?.id)) {
    return makeResult({
      name: 'object', // checker.typeToString(type),
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
  } else if (type.flags & TypeFlags.Union && !isComplexType(type)) {
    return makeResult({
      name: 'union',
      // @ts-ignore
      value: type.types.map(t =>
        getDocgenTypeHelper(checker, t, true, getNextParentIds(parentIds, type)),
      ),
    });
  } else if (isComplexType(type)) {
    return makeResult({
      name: getSymbolName(type?.symbol || type?.aliasSymbol),
    });
  } else if (type.flags & (TypeFlags.Object | TypeFlags.Intersection)) {
    if (isTuple(type)) {
      try {
        const props = getShape(type);
        return makeResult({
          name: 'tuple',
          value: props.map(p => p.value),
        });
      } catch (e) {
        return makeResult({
          name: 'object',
        });
      }

      // @ts-ignore
    } else if (checker.isArrayType(type)) {
      return makeResult({
        name: 'Array',
        // @ts-ignore
        elements: [
          getDocgenTypeHelper(
            checker,
            (type as ExtendedType).typeArguments[0],
            false,
            getNextParentIds(parentIds, type),
          ),
        ],
      });
      // @ts-ignore
    } else if (type?.symbol?.valueDeclaration?.parameters?.length) {
      return makeResult({
        name: 'func',
        params: getFunctionParams(
          // @ts-ignore
          type?.symbol?.valueDeclaration?.parameters,
          checker,
          parentIds,
          type,
        ),
      });
    } else if (
      // @ts-ignore
      type?.members?.get('__call')?.declarations[0]?.symbol?.declarations[0]?.parameters?.length
    ) {
      return makeResult({
        name: 'func',
        params: getFunctionParams(
          // @ts-ignore
          type?.members?.get('__call')?.declarations[0]?.symbol?.declarations[0]?.parameters,
          checker,
          parentIds,
          type,
        ),
      });
    } else {
      try {
        const props = getShape(type);
        return makeResult({
          name: 'signature',
          type: {
            signature: {
              properties: props,
            },
          },
        });
      } catch (e) {
        return makeResult({
          name: 'object',
        });
      }
    }
  } else {
    return makeResult({
      name: 'object',
    });
  }
}
class MyParser extends Parser {
  getDocgenType(propType: ts.Type): any {
    const parentIds = [];
    // @ts-ignore
    const parentId = propType?.symbol?.parent?.id;
    if (parentId) {
      parentIds.push(parentId);
    }
    // @ts-ignore
    const result = getDocgenTypeHelper(this.checker, propType, true, parentIds);
    return result;
  }

  // override the builtin method, to avoid the false positive
  public extractPropsFromTypeIfStatelessComponent(type: ts.Type): ts.Symbol | null {
    const callSignatures = type.getCallSignatures();

    if (callSignatures.length) {
      // Could be a stateless component.  Is a function, so the props object we're interested
      // in is the (only) parameter.

      for (const sig of callSignatures) {
        const params = sig.getParameters();
        if (params.length === 0) {
          continue;
        }

        // @ts-ignore
        const returnSymbol = this.checker.getReturnTypeOfSignature(sig);
        if (!returnSymbol) continue;
        const symbol = returnSymbol?.symbol;
        if (!symbol) continue;
        // @ts-ignore
        const typeString = this.checker.symbolToString(symbol);
        if (typeString.startsWith('ReactElement')) {
          const propsParam = params[0];
          if (propsParam) {
            return propsParam;
          }
        }
      }
    }

    return null;
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

        // polyfill valueDeclaration
        sym.valueDeclaration = sym.valueDeclaration || sym.declarations[0];
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
      // omit aria related properties temporarily
      if (name.startsWith('aria-')) {
        return acc;
      }
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
