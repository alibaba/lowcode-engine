import { CodeGenerator } from '@babel/generator';
// import { parse } from '@babel/parser';
const buildParser = require('react-docgen/dist/babelParser').default;
import traverse from '@babel/traverse';
import * as t from '@babel/types';
const { utils: ReactDocUtils } = require('react-docgen');
import { debug } from '../otter-core';
import {
  IMaterialParsedModel,
  IMaterialScanModel,
  IPropType,
  IPropTypes,
  SourceType,
} from '../types';
import BaseParser from './BaseParser';

const log = debug.extend('mat');
const parser = buildParser();

function transformType(item: any): any {
  switch (typeof item) {
    case 'string':
      return {
        propType: item,
      };
    case 'object':
      if (Array.isArray(item)) {
        return item.map(transformType);
      } else if (Object.keys(item).length === 1 && item.name) {
        return {
          propType: item.name,
        };
      } else if (item.name === 'shape' || item.name === 'exact') {
        return {
          propType: item.name,
          value: Object.keys(item.value).map(name => {
            return {
              name,
              ...transformType(item.value[name]),
            };
          }),
        };
      } else if (item.name === 'enum') {
        return item.value.map((x: any) => x.value);
      } else {
        return {
          propType: item.name,
          isRequired: item.required,
        };
      }
  }
}
/**
 * 解析 react 生态下的组件
 *
 * @class ReactParser
 * @extends {BaseParser}
 */
class ReactParser extends BaseParser {
  /**
   * 解析 ExportStatement
   * @static
   * @returns {Promise<any>}
   * @memberof ReactParser
   */
  public static async parseExportedStatement(
    fileContent: string,
    sourceType: string,
  ): Promise<
    Array<{
      localName: string;
      exportedName: string;
      source: string;
    }>
  > {
    const ast = parser.parse(fileContent);

    // @ts-ignore
    ast.__src = fileContent;

    const specifiers: any = [];

    // 组装 localName 和 exportedName
    traverse(ast, {
      enter(path) {
        if (t.isExportNamedDeclaration(path.node)) {
          path.node.specifiers.forEach(spec => {
            if (t.isExportSpecifier(spec)) {
              const source = (path.node as t.ExportNamedDeclaration).source;
              specifiers.push({
                localName: spec.local.name,
                exportedName: spec.exported.name,
                source: t.isLiteral(source) ? (source as any).value : '',
              });
            }
          });
        }
      },
    });
    // 组装 source
    traverse(ast, {
      enter(path) {
        if (t.isImportDeclaration(path.node)) {
          const source = path.node.source;
          path.node.specifiers.forEach(spec => {
            if (t.isImportDefaultSpecifier(spec)) {
              const target = specifiers.find(
                (inner: any) => inner.localName === spec.local.name,
              );
              if (target) {
                target.source = source.value;
              }
            }
          });
        }
      },
    });
    debug('specifiers', specifiers);
    return specifiers;
  }

  public static parseProperties(objectPath: any): IPropTypes {
    const results: IPropTypes = objectPath.get('properties').map((p: any) => ({
      name: p.get('key').node.name,
      ...transformType(ReactDocUtils.getPropType(p.get('value'))),
    }));
    // console.log(JSON.stringify(results, null, 2));
    // objectPath.node.properties.forEach((prop: any) => {
    //   if (t.isProperty(prop)) {
    //     if (t.isMemberExpression(prop.value)) {
    //       if (t.isIdentifier(prop.value.object)) {
    //         // 支持 optionalArray: PropTypes.array 写法
    //         results.push({
    //           name: prop.key.name,
    //           type: prop.value.property.name,
    //           required: false,
    //         });
    //       }
    //       if (t.isMemberExpression(prop.value.object)) {
    //         // 支持 optionalArray: PropTypes.array.isRequired 写法
    //         results.push({
    //           name: prop.key.name,
    //           type: prop.value.object.property.name,
    //           required: prop.value.object.property.name === 'isRequired',
    //         });
    //       }
    //       if (
    //         t.isCallExpression(prop.value.object) &&
    //         t.isMemberExpression(prop.value.object.callee)
    //       ) {
    //         // 支持 optionalArray: PropTypes.shape().isRequired 写法
    //         results.push({
    //           name: prop.key.name,
    //           type: prop.value.object.callee.property.name,
    //           value: ReactParser.parseProperties(
    //             prop.value.object.arguments[0],
    //           ),
    //           required: prop.value.property.name === 'isRequired',
    //         });
    //       }
    //     }
    //     if (
    //       t.isCallExpression(prop.value) &&
    //       t.isMemberExpression(prop.value.callee)
    //     ) {
    //       // 支持 optionalArray: PropTypes.shape() 写法
    //       results.push({
    //         name: prop.key.name,
    //         type: prop.value.callee.property.name,
    //         value: ReactParser.parsePropsTypesES6(prop.value.arguments[0], ''),
    //         required: false,
    //       });
    //     }
    //   }
    // });

    return results;
    // public return [];
  }

  /**
   * 解析 AST 获取 propsTypes
   * 支持的写法：
   * - static propTypes = { sth: PropTypes.any.isRequired }
   * - Demo.propTypes = {}
   *
   * @private
   * @param {*} ast
   * @param {string} defaultExportName
   * @returns {<Array<{
   *     name: string,
   *     type: string,
   *     value?: any,
   *     required: boolean,
   *   }>}
   * @memberof ReactParser
   */
  public static parsePropsTypesES6(
    ast: any,
    defaultExportName: string,
  ): IPropTypes {
    const results: any[] = [];
    traverse(ast, {
      enter(path) {
        // 支持 static propTypes = { sth: PropTypes.any.isRequired }; 写法
        if (
          t.isExpressionStatement(path.node) &&
          t.isCallExpression(path.node.expression)
        ) {
          const args = path.node.expression.arguments;
          if (
            t.isIdentifier(args[0]) &&
            // args[0].name === defaultExportName &&
            t.isLiteral(args[1]) &&
            (args[1] as any).value === 'propTypes' &&
            t.isObjectExpression(args[2])
          ) {
            // const properties = (args[2] as t.ObjectExpression).properties;
            results.push(
              ...ReactParser.parseProperties(
                path
                  // @ts-ignore
                  .get('expression')
                  // @ts-ignore
                  .get('arguments')[2],
              ),
            );
          }
        }

        // 支持 Demo.propTypes = {}; 写法
        if (
          t.isExpressionStatement(path.node) &&
          t.isAssignmentExpression(path.node.expression) &&
          t.isMemberExpression(path.node.expression.left) &&
          t.isObjectExpression(path.node.expression.right) &&
          t.isIdentifier(path.node.expression.left.object) &&
          t.isIdentifier(path.node.expression.left.property) &&
          path.node.expression.left.object.name === defaultExportName &&
          ['propTypes'].includes(path.node.expression.left.property.name)
        ) {
          debugger;
          // 处理 propTypes
          results.push(
            // @ts-ignore
            ...ReactParser.parseProperties(path.get('expression').get('right')),
          );
        }
      },
      noScope: defaultExportName ? false : true,
    });
    return results;
  }

  public async parseES5(
    model: IMaterialScanModel,
  ): Promise<IMaterialParsedModel> {
    const parsedModel: IMaterialParsedModel = {
      filePath: '',
      defaultExportName: '',
      componentNames: [],
      importModules: [],
      exportModules: [],
      subModules: [],
      propsTypes: [],
      propsDefaults: [],
    };

    const mainEntryItem: any = model.modules.find(
      item => item.filePath === model.mainEntry,
    );
    // log('mainEntryItem', mainEntryItem);
    const ast = parser.parse(mainEntryItem.file);

    // @ts-ignore
    ast.__src = mainEntryItem.file;

    // 获取 defaultExportName
    traverse(ast, {
      enter(path) {
        if (t.isExpressionStatement(path.node)) {
          if (
            t.isAssignmentExpression(path.node.expression) &&
            t.isMemberExpression(path.node.expression.left) &&
            t.isIdentifier(path.node.expression.left.object) &&
            t.isIdentifier(path.node.expression.right) &&
            path.node.expression.left.object.name === 'exports' &&
            (path.node.expression.left.property.name === 'default' ||
              path.node.expression.left.property.value === 'default')
          ) {
            // 支持 export default Demo 写法
            const tempVarName = path.node.expression.right.name;
            let defaultExportName = '';
            traverse(ast, {
              enter(innerPath) {
                if (
                  t.isVariableDeclaration(innerPath.node) &&
                  Array.isArray(innerPath.node.declarations) &&
                  innerPath.node.declarations.length &&
                  t.isVariableDeclarator(innerPath.node.declarations[0]) &&
                  t.isIdentifier(innerPath.node.declarations[0].id) &&
                  innerPath.node.declarations[0].id.name === tempVarName &&
                  t.isIdentifier(innerPath.node.declarations[0].init)
                ) {
                  defaultExportName = innerPath.node.declarations[0].init.name;
                }
              },
            });
            parsedModel.defaultExportName = defaultExportName;
            log('isIdentifier defaultExportName', defaultExportName);
          }
        }
      },
    });

    traverse(ast, {
      enter(path) {
        // 获取 componentNames
        if (t.isVariableDeclaration(path.node)) {
          if (
            t.isVariableDeclarator(path.node.declarations) &&
            t.isIdentifier(path.node.declarations.init) &&
            t.isIdentifier(path.node.declarations.id)
          ) {
            const exportedName = path.node.declarations.init.name;
            const localName = path.node.declarations.id.name;
            log('isIdentifier componentNames', exportedName);
            parsedModel.componentNames.push({
              exportedName,
              localName,
            });
          }
        }
        // 获取 exportModules
        if (t.isExpressionStatement(path.node)) {
          // 对应 export function DemoFunc() {} 或 export { DemoFunc } 写法
          if (
            t.isAssignmentExpression(path.node.expression) &&
            t.isMemberExpression(path.node.expression.left) &&
            t.isIdentifier(path.node.expression.left.object) &&
            t.isIdentifier(path.node.expression.left.property) &&
            t.isIdentifier(path.node.expression.right) &&
            path.node.expression.left.object.name === 'exports'
          ) {
            const exportedName = path.node.expression.left.property.name;
            const localName = path.node.expression.right.name;
            parsedModel.exportModules.push({
              exportedName:
                exportedName === 'default'
                  ? parsedModel.defaultExportName
                  : exportedName,
              localName:
                exportedName === 'default'
                  ? parsedModel.defaultExportName
                  : localName,
            });
          }
          // 支持 export { default as DemoFunc } from './DemoFunc' 写法
          if (
            t.isCallExpression(path.node.expression) &&
            t.isMemberExpression(path.node.expression.callee) &&
            t.isIdentifier(path.node.expression.callee.object) &&
            t.isIdentifier(path.node.expression.callee.property) &&
            path.node.expression.callee.object.name === 'Object' &&
            path.node.expression.callee.property.name === 'defineProperty' &&
            Array.isArray(path.node.expression.arguments) &&
            t.isIdentifier(path.node.expression.arguments[0]) &&
            (path.node.expression.arguments[0] as t.Identifier).name ===
              'exports' &&
            t.isLiteral(path.node.expression.arguments[1])
          ) {
            // 对应 export function DemoFunc() {} 或 export { DemoFunc } 写法
            const args = path.node.expression.arguments as any;
            const funcName = args[1].value;
            if (funcName !== '__esModule') {
              parsedModel.exportModules.push({
                exportedName: funcName,
                localName: funcName,
              });
            }
          }
        }
        // 获取 importModules
        if (
          t.isVariableDeclaration(path.node) &&
          Array.isArray(path.node.declarations) &&
          path.node.declarations.length
        ) {
          path.node.declarations.forEach(dec => {
            // 支持 import Demo from './demo' 写法
            if (
              t.isVariableDeclarator(dec) &&
              t.isIdentifier(dec.id) &&
              t.isCallExpression(dec.init) &&
              t.isIdentifier(dec.init.callee) &&
              ['_interopRequireWildcard', '_interopRequireDefault'].includes(
                dec.init.callee.name,
              ) &&
              // dec.init.callee.name === '_interopRequireWildcard' &&
              Array.isArray(dec.init.arguments) &&
              t.isCallExpression(dec.init.arguments[0]) &&
              t.isIdentifier(
                (dec.init.arguments[0] as t.CallExpression).callee,
              ) &&
              ((dec.init.arguments[0] as t.CallExpression)
                .callee as t.Identifier).name === 'require'
            ) {
              const localName = dec.id.name;
              const args = (dec.init.arguments[0] as t.CallExpression)
                .arguments as any;
              const source = args[0].value;
              parsedModel.importModules.push({
                importDefaultName: localName,
                localName,
                source,
              });
            }

            // 支持 import { Demo as Demo2 } from './demo' 写法
            if (
              t.isVariableDeclarator(dec) &&
              t.isIdentifier(dec.id) &&
              t.isCallExpression(dec.init) &&
              t.isIdentifier(dec.init.callee) &&
              dec.init.callee.name === 'require' &&
              Array.isArray(dec.init.arguments) &&
              t.isLiteral(dec.init.arguments[0])
            ) {
              const args = dec.init.arguments as any;
              const source = args[0].value;
              const importName = dec.id.name;
              const localName = dec.id.name;
              // 遍历查找出 importName 和 localName
              // ES5 本身并不支持按需加载，故 import 都是全量导入
              // 但如果使用了诸如：babel-plugin-import 等插件，会自动更改编译之后的 ES5 代码
              parsedModel.importModules.push({
                importName,
                localName,
                source,
              });
            }
          });
        }

        // 获取 subModules
        if (
          t.isExpressionStatement(path.node) &&
          t.isAssignmentExpression(path.node.expression) &&
          t.isMemberExpression(path.node.expression.left)
        ) {
          if (
            t.isIdentifier(path.node.expression.left.object) &&
            path.node.expression.left.object.name ===
              parsedModel.defaultExportName
          ) {
            // 支持 SFC.SubDemo1 = SubDemo1; 写法
            if (t.isIdentifier(path.node.expression.right)) {
              parsedModel.subModules.push({
                objectName: [path.node.expression.left.object.name],
                propertyName: path.node.expression.left.property.name,
                isValueAnonymousFunc: false,
                value: path.node.expression.right.name,
              });
            }

            // 支持 SFC.SubDemo2 = function() {}; 写法
            if (t.isFunctionExpression(path.node.expression.right)) {
              const rightID = path.node.expression.right.id as any;
              parsedModel.subModules.push({
                objectName: [path.node.expression.left.object.name],
                propertyName: path.node.expression.left.property.name,
                isValueAnonymousFunc: !rightID,
                value: rightID ? rightID.name : undefined,
              });
            }
          }

          if (t.isMemberExpression(path.node.expression.left.object)) {
            if (t.isIdentifier(path.node.expression.right)) {
              // 支持 DemoFunc4.Test.Obj2 = Obj3; 写法
              const tempLeftObject = path.node.expression.left.object as any;
              parsedModel.subModules.push({
                objectName: [
                  tempLeftObject.object.name,
                  tempLeftObject.property.name,
                ],
                propertyName: path.node.expression.left.property.name,
                isValueAnonymousFunc: false,
                value: path.node.expression.right.name,
              });
            }
            if (t.isFunctionExpression(path.node.expression.right)) {
              // 支持 DemoFunc4.Test.Obj2 = function() {}; 写法
              const rightID = path.node.expression.right.id as any;
              const tempLeftObject = path.node.expression.left.object as any;
              parsedModel.subModules.push({
                objectName: [
                  tempLeftObject.object.name,
                  tempLeftObject.property.name,
                ],
                propertyName: path.node.expression.left.property.name,
                isValueAnonymousFunc: !rightID,
                value: rightID ? rightID.name : undefined,
              });
            }
          }
        }

        // 获取 propsTypes 和 defaultProps
        if (
          t.isExpressionStatement(path.node) &&
          t.isAssignmentExpression(path.node.expression) &&
          t.isMemberExpression(path.node.expression.left) &&
          t.isObjectExpression(path.node.expression.right) &&
          t.isIdentifier(path.node.expression.left.object) &&
          t.isIdentifier(path.node.expression.left.property) &&
          path.node.expression.left.object.name ===
            parsedModel.defaultExportName &&
          ['propTypes', 'defaultProps'].includes(
            path.node.expression.left.property.name,
          )
        ) {
          // 处理 propTypes
          if (path.node.expression.left.property.name === 'propTypes') {
            path.node.expression.right.properties.forEach(prop => {
              if (t.isProperty(prop)) {
                if (t.isMemberExpression(prop.value)) {
                  if (t.isIdentifier(prop.value.object)) {
                    // 支持 optionalArray: PropTypes.array 写法
                    parsedModel.propsTypes.push({
                      name: prop.key.name,
                      type: prop.value.property.name,
                      required: false,
                    });
                  }
                  if (t.isMemberExpression(prop.value.object)) {
                    // 支持 optionalArray: PropTypes.array.isRequired 写法
                    parsedModel.propsTypes.push({
                      name: prop.key.name,
                      type: prop.value.object.property.name,
                      required:
                        prop.value.object.property.name === 'isRequired',
                    });
                  }
                  if (
                    t.isCallExpression(prop.value.object) &&
                    t.isMemberExpression(prop.value.object.callee)
                  ) {
                    // 支持 optionalArray: PropTypes.shape().isRequired 写法
                    parsedModel.propsTypes.push({
                      name: prop.key.name,
                      type: prop.value.object.callee.property.name,
                      required: prop.value.property.name === 'isRequired',
                    });
                  }
                }
                if (
                  t.isCallExpression(prop.value) &&
                  t.isMemberExpression(prop.value.callee)
                ) {
                  // 支持 optionalArray: PropTypes.shape() 写法
                  parsedModel.propsTypes.push({
                    name: prop.key.name,
                    type: prop.value.callee.property.name,
                    required: false,
                  });
                }
              }
            });
          }
          // 处理 defaultProps
          if (path.node.expression.left.property.name === 'defaultProps') {
            path.node.expression.right.properties.forEach(prop => {
              if (t.isProperty(prop)) {
                if (t.isObjectExpression(prop.value)) {
                  const defaultValue = new CodeGenerator(
                    t.objectExpression(prop.value.properties),
                  ).generate().code;
                  parsedModel.propsDefaults.push({
                    name: prop.key.name,
                    defaultValue,
                  });
                }
              }
            });
          }
        }
      },
    });

    log('traverse done.');
    log('parsedModel.defaultExportName', parsedModel.defaultExportName);
    log('parsedModel.componentNames', parsedModel.componentNames);
    log('parsedModel.importModules', parsedModel.importModules);
    log('parsedModel.exportModules', parsedModel.exportModules);
    log('parsedModel.subModules', parsedModel.subModules);
    log('parsedModel.propsTypes', parsedModel.propsTypes);
    log('parsedModel.propsDefaults', parsedModel.propsDefaults);
    log('parsedModel', parsedModel);
    return parsedModel;
  }

  public async parseES6(params: {
    model: IMaterialScanModel;
    filePath: string;
    fileContent: string;
  }): Promise<IMaterialParsedModel> {
    const ast = parser.parse(params.fileContent);

    // @ts-ignore
    ast.__src = params.fileContent;

    const defaultExportName = await this.parseDefaultExportNameES6(ast);
    const componentNames = await this.parseComponentNamesES6(ast);
    const importModules = await this.parseImportModulesES6(ast);
    const exportModules = await ReactParser.parseExportedStatement(
      params.fileContent,
      params.model.sourceType,
    );
    const subModules = await this.parseSubModulesES6(ast);
    const propsTypes = ReactParser.parsePropsTypesES6(ast, defaultExportName);
    const propsDefaults = await this.parseDefaultPropsES6(
      ast,
      defaultExportName,
    );

    return {
      filePath: params.filePath,
      defaultExportName,
      componentNames,
      importModules,
      exportModules,
      subModules,
      propsTypes,
      propsDefaults,
    } as IMaterialParsedModel;
  }

  /**
   * 解析 AST 获取 defaultExportName
   * 支持的写法：
   * - export default Demo
   * - export default function Demo() {}
   * - export default class Demo {}
   *
   * @private
   * @param {*} ast
   * @memberof ReactParser
   */
  private async parseDefaultExportNameES6(ast: any): Promise<string> {
    let defaultExportName = '';
    traverse(ast, {
      enter(path) {
        // 获取 defaultExportName
        if (t.isExportDefaultDeclaration(path.node)) {
          if (t.isIdentifier(path.node.declaration)) {
            // 支持 export default Demo 写法
            defaultExportName = path.node.declaration.name;
            log('isIdentifier defaultExportName', defaultExportName);
          }
          if (t.isFunctionDeclaration(path.node.declaration)) {
            if (t.isIdentifier(path.node.declaration.id)) {
              // 支持 export default function Demo() {} 写法
              defaultExportName = path.node.declaration.id.name;
              log('isFunctionDeclaration defaultExportName', defaultExportName);
            }
          }
          if (t.isClassDeclaration(path.node.declaration)) {
            if (t.isIdentifier(path.node.declaration.id)) {
              // 支持 export default class Demo {} 写法
              defaultExportName = path.node.declaration.id.name;
              log('isClassDeclaration defaultExportName', defaultExportName);
            }
          }
          if (t.isCallExpression(path.node.declaration)) {
            const traverseCallExp: any = (args: any[]) => {
              const arg = args[0];
              if (t.isIdentifier(arg)) {
                return arg.name;
              }
              return traverseCallExp(arg.arguments);
            };
            defaultExportName = traverseCallExp(
              path.node.declaration.arguments,
            );
          }
        }
      },
    });
    return defaultExportName;
  }

  /**
   * 解析 AST 获取 importModules
   * 支持的写法：
   * - import Demo from './demo'
   * - import { Demo as Demo2 } from './demo'
   * - import * as Demo from './demo'
   *
   * @private
   * @param {*} ast
   * @returns {Promise<Array<{
   *     importDefaultName?: string,
   *     importName?: string,
   *     localName: string,
   *     source: string,
   *   }>>}
   * @memberof ReactParser
   */
  private async parseImportModulesES6(
    ast: any,
  ): Promise<
    Array<{
      importDefaultName?: string;
      importName?: string;
      localName: string;
      source: string;
    }>
  > {
    const results: any[] = [];
    traverse(ast, {
      enter(path) {
        // 写法支持：import Demo from './demo';
        if (t.isImportDeclaration(path.node)) {
          if (
            Array.isArray(path.node.specifiers) &&
            path.node.specifiers.length
          ) {
            const source = path.node.source.value;
            path.node.specifiers.forEach(spec => {
              if (t.isImportDefaultSpecifier(spec)) {
                // 支持 import Demo from './demo' 写法
                results.push({
                  importDefaultName: spec.local.name,
                  localName: spec.local.name,
                  source,
                });
              }
              if (t.isImportSpecifier(spec)) {
                // 支持 import { Demo as Demo2 } from './demo' 写法
                results.push({
                  importName: spec.imported.name,
                  localName: spec.local.name,
                  source,
                });
              }
              if (t.isImportNamespaceSpecifier(spec)) {
                // 支持 import * as Demo from './demo' 写法
                results.push({
                  importName: spec.local.name,
                  localName: spec.local.name,
                  source,
                });
              }
            });
          }
        }
      },
    });
    return results;
  }

  /**
   * 解析 AST 获取 componentNames
   *
   * @private
   * @param {*} ast
   * @returns {Promise<Array<{
   *     exportedName: string,
   *     localName: string,
   *   }>>}
   * @memberof ReactParser
   */
  private async parseComponentNamesES6(
    ast: any,
  ): Promise<
    Array<{
      exportedName: string;
      localName: string;
    }>
  > {
    const results: any[] = [];
    traverse(ast, {
      enter(path) {
        if (t.isFunctionDeclaration(path.node)) {
          if (t.isIdentifier(path.node.id)) {
            const funcName = path.node.id.name;
            debug('isIdentifier componentNames', funcName);
            results.push({
              exportedName: funcName,
              localName: funcName,
            });
          }
        }
      },
    });
    return results;
  }

  /**
   * 解析 AST 获取 subModules
   * 支持的写法：
   * - DemoFunc4.Test = Test;
   * - DemoFunc4.Test = function() {};
   * - DemoFunc4.Test.Obj2 = Obj3;
   * - DemoFunc4.Test.Obj2 = function() {};
   *
   * @private
   * @param {*} ast
   * @returns {Promise<Array<{
   *     objectName: string[],
   *     propertyName: string,
   *     value?: string,
   *     isValueAnonymousFunc: boolean,
   *   }>>}
   * @memberof ReactParser
   */
  private async parseSubModulesES6(
    ast: any,
  ): Promise<
    Array<{
      objectName: string[];
      propertyName: string;
      value?: string;
      isValueAnonymousFunc: boolean;
    }>
  > {
    const results: any[] = [];
    traverse(ast, {
      enter(path) {
        if (t.isExpressionStatement(path.node)) {
          if (t.isAssignmentExpression(path.node.expression)) {
            if (t.isMemberExpression(path.node.expression.left)) {
              if (t.isIdentifier(path.node.expression.left.object)) {
                if (t.isIdentifier(path.node.expression.right)) {
                  // 支持 DemoFunc4.Test = Test; 写法
                  results.push({
                    objectName: [path.node.expression.left.object.name],
                    propertyName: path.node.expression.left.property.name,
                    isValueAnonymousFunc: false,
                    value: path.node.expression.right.name,
                  });
                }
                if (t.isFunctionExpression(path.node.expression.right)) {
                  // 支持 DemoFunc4.Test = function() {}; 写法
                  const rightID = !path.node.expression.right.id as any;
                  results.push({
                    objectName: [path.node.expression.left.object.name],
                    propertyName: path.node.expression.left.property.name,
                    isValueAnonymousFunc: !!rightID,
                    value: rightID ? rightID.name : undefined,
                  });
                }
              }
              if (t.isMemberExpression(path.node.expression.left.object)) {
                if (t.isIdentifier(path.node.expression.right)) {
                  // 支持 DemoFunc4.Test.Obj2 = Obj3; 写法
                  const tempLeftObject = path.node.expression.left
                    .object as any;
                  results.push({
                    objectName: [
                      tempLeftObject.object.name,
                      tempLeftObject.property.name,
                    ],
                    propertyName: path.node.expression.left.property.name,
                    isValueAnonymousFunc: false,
                    value: path.node.expression.right.name,
                  });
                }
                if (t.isFunctionExpression(path.node.expression.right)) {
                  // 支持 DemoFunc4.Test.Obj2 = function() {}; 写法
                  const rightID = !path.node.expression.right.id as any;
                  const tempLeftObject = path.node.expression.left
                    .object as any;
                  results.push({
                    objectName: [
                      tempLeftObject.object.name,
                      tempLeftObject.property.name,
                    ],
                    propertyName: path.node.expression.left.property.name,
                    isValueAnonymousFunc: !!rightID,
                    value: rightID ? rightID.name : undefined,
                  });
                }
              }
            }
          }
        }
      },
    });
    return results;
  }

  /**
   * 解析 AST 获取 defaultProps
   * 支持的写法：
   * - static defaultProps = {};
   * - Demo.defaultProps = {};
   *
   * @private
   * @param {*} ast
   * @param {string} defaultExportName
   * @returns {Promise<Array<{
   *     name: string,
   *     defaultValue: any,
   *   }>>}
   * @memberof ReactParser
   */
  private async parseDefaultPropsES6(
    ast: any,
    defaultExportName: string,
  ): Promise<
    Array<{
      name: string;
      defaultValue: any;
    }>
  > {
    const results: any[] = [];
    // traverse(ast, {
    //   enter(path) {
    //     if (
    //       t.isExpressionStatement(path.node) &&
    //       t.isCallExpression(path.node.expression)
    //     ) {
    //       const args = path.node.expression.arguments;
    //       if (
    //         t.isIdentifier(args[0]) &&
    //         // args[0].name === defaultExportName &&
    //         t.isLiteral(args[1]) &&
    //         (args[1] as any).value === 'defaultProps' &&
    //         t.isObjectExpression(args[2])
    //       ) {
    //         const properties = (args[2] as t.ObjectExpression).properties;
    //         properties.forEach((prop: any) => {
    //           if (t.isProperty(prop)) {
    //             if (t.isObjectExpression(prop.value)) {
    //               const defaultValue = new CodeGenerator(
    //                 t.objectExpression(prop.value.properties),
    //               ).generate().code;
    //               results.push({
    //                 name: prop.key.name,
    //                 defaultValue,
    //               });
    //             }
    //           }
    //         });
    //       }
    //     }

    //     if (
    //       t.isExpressionStatement(path.node) &&
    //       t.isAssignmentExpression(path.node.expression) &&
    //       t.isMemberExpression(path.node.expression.left) &&
    //       t.isObjectExpression(path.node.expression.right) &&
    //       t.isIdentifier(path.node.expression.left.object) &&
    //       t.isIdentifier(path.node.expression.left.property) &&
    //       path.node.expression.left.object.name === defaultExportName &&
    //       ['defaultProps'].includes(path.node.expression.left.property.name)
    //     ) {
    //       // 处理 defaultProps
    //       path.node.expression.right.properties.forEach(prop => {
    //         if (t.isProperty(prop)) {
    //           if (t.isObjectExpression(prop.value)) {
    //             const defaultValue = new CodeGenerator(
    //               t.objectExpression(prop.value.properties),
    //             ).generate().code;
    //             results.push({
    //               name: prop.key.name,
    //               defaultValue,
    //             });
    //           }
    //         }
    //       });
    //     }
    //   },
    // });
    return results;
  }
}

export default ReactParser;
