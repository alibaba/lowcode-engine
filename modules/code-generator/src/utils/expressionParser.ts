import * as parser from '@babel/parser';
import generate from '@babel/generator';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { isIdentifier, Node } from '@babel/types';

import { OrderedSet } from './OrderedSet';
import { IScope } from '../types';

export class ParseError extends Error {
  readonly expr: string | t.Expression;

  readonly detail: unknown;

  constructor(expr: string | t.Expression, detail: unknown) {
    super(`Failed to parse expression "${typeof expr === 'string' ? expr : generate(expr)}"`);
    this.expr = expr;
    this.detail = detail;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const MAYBE_EXPRESSIONS: {
  [k in Node['type']]?: {
    // fields: Array<keyof (Node & { type: k })>
    fields: string[] | ((node: Node) => string[]);
  };
} = {
  ArrayExpression: { fields: ['elements'] },
  AssignmentExpression: { fields: ['left', 'right'] },
  BinaryExpression: { fields: ['left', 'right'] },
  CallExpression: { fields: ['arguments', 'callee'] },
  ConditionalExpression: { fields: ['test', 'consequent', 'alternate'] },
  DoWhileStatement: { fields: ['test'] },
  ExpressionStatement: { fields: ['expression'] },
  ForInStatement: { fields: ['right'] },
  ForStatement: { fields: ['init', 'test', 'update'] },
  IfStatement: { fields: ['test'] },
  LogicalExpression: { fields: ['left', 'right'] },
  MemberExpression: {
    fields: (node) => {
      return node.type === 'MemberExpression' && node.computed
        ? ['object', 'property']
        : ['object'];
    },
  },
  NewExpression: { fields: ['callee', 'arguments'] },
  ObjectMethod: {
    fields: (node) => {
      return node.type === 'ObjectMethod' && node.computed ? ['key'] : [];
    },
  },
  ObjectProperty: {
    fields: (node) => {
      return node.type === 'ObjectProperty' && node.computed ? ['key', 'value'] : ['value'];
    },
  },
  ReturnStatement: { fields: ['argument'] },
  SequenceExpression: { fields: ['expressions'] },
  ParenthesizedExpression: { fields: ['expression'] },
  SwitchCase: { fields: ['test'] },
  SwitchStatement: { fields: ['discriminant'] },
  ThrowStatement: { fields: ['argument'] },
  UnaryExpression: { fields: ['argument'] },
  UpdateExpression: { fields: ['argument'] },
  VariableDeclarator: { fields: ['init'] },
  WhileStatement: { fields: ['test'] },
  WithStatement: { fields: ['object'] },
  AssignmentPattern: { fields: ['right'] },
  ArrowFunctionExpression: { fields: ['body'] },
  ClassExpression: { fields: ['superClass'] },
  ClassDeclaration: { fields: ['superClass'] },
  ExportDefaultDeclaration: { fields: ['declaration'] },
  ForOfStatement: { fields: ['right'] },
  ClassMethod: {
    fields: (node) => {
      return node.type === 'ClassMethod' && node.computed ? ['key'] : [];
    },
  },
  SpreadElement: { fields: ['argument'] },
  TaggedTemplateExpression: { fields: ['tag'] },
  TemplateLiteral: { fields: ['expressions'] },
  YieldExpression: { fields: ['argument'] },
  AwaitExpression: { fields: ['argument'] },
  OptionalMemberExpression: {
    fields: (node) => {
      return node.type === 'OptionalMemberExpression' && node.computed
        ? ['object', 'property']
        : ['object'];
    },
  },
  OptionalCallExpression: { fields: ['callee', 'arguments'] },
  JSXSpreadAttribute: { fields: ['argument'] },
  BindExpression: { fields: ['object', 'callee'] },
  ClassProperty: {
    fields: (node) => {
      return node.type === 'ClassProperty' && node.computed ? ['key', 'value'] : ['value'];
    },
  },
  PipelineTopicExpression: { fields: ['expression'] },
  PipelineBareFunction: { fields: ['callee'] },
  ClassPrivateProperty: { fields: ['value'] },
  Decorator: { fields: ['expression'] },
  TupleExpression: { fields: ['elements'] },
  TSDeclareMethod: {
    fields: (node) => {
      return node.type === 'TSDeclareMethod' && node.computed ? ['key'] : [];
    },
  },
  TSPropertySignature: {
    fields: (node) => {
      return node.type === 'TSPropertySignature' && node.computed
        ? ['key', 'initializer']
        : ['initializer'];
    },
  },

  TSMethodSignature: {
    fields: (node) => {
      return node.type === 'TSMethodSignature' && node.computed ? ['key'] : [];
    },
  },
  TSAsExpression: { fields: ['expression'] },
  TSTypeAssertion: { fields: ['expression'] },
  TSEnumDeclaration: { fields: ['initializer'] },
  TSEnumMember: { fields: ['initializer'] },
  TSNonNullExpression: { fields: ['expression'] },
  TSExportAssignment: { fields: ['expression'] },
};

export interface ParseExpressionGetGlobalVariablesOptions {
  filter?: (varName: string) => boolean;
}

const CROSS_THIS_SCOPE_TYPE_NODE: {
  [k in Node['type']]?: boolean;
} = {
  ArrowFunctionExpression: false, // 箭头函数不跨越 this 的 scope
  FunctionExpression: true,
  FunctionDeclaration: true,
  // FunctionTypeAnnotation: false, // 这是 TS 定义
  // FunctionTypeParam: false, // 这是 TS 定义
  ClassDeclaration: true,
  ClassExpression: true,
  ClassBody: true,
  ClassImplements: true,
  ClassMethod: true,
  ClassPrivateMethod: true,
  ClassProperty: true,
  ClassPrivateProperty: true,
  DeclareClass: true,
};

const JS_KEYWORDS = ['arguments', 'this', 'super'];

export function parseExpressionGetKeywords(expr: string | null | undefined): string[] {
  if (!expr) {
    return [];
  }

  try {
    const keywordVars = new OrderedSet<string>();

    const ast = parser.parse(`!(${expr});`, {
      plugins: [
        'jsx',
      ],
    });

    const addIdentifierIfNeeded = (x: Node | null | undefined) => {
      if (typeof x === 'object' && isIdentifier(x) && JS_KEYWORDS.includes(x.name)) {
        keywordVars.add(x.name);
      }
    };

    traverse(ast, {
      enter(path) {
        const { node } = path;
        const expressionFields = MAYBE_EXPRESSIONS[node.type]?.fields;
        if (expressionFields) {
          (typeof expressionFields === 'function'
            ? expressionFields(node)
            : expressionFields
          ).forEach((fieldName) => {
            const fieldValue = node[fieldName as keyof typeof node];
            if (typeof fieldValue === 'object') {
              if (Array.isArray(fieldValue)) {
                fieldValue.forEach((item: any) => {
                  addIdentifierIfNeeded(item);
                });
              } else {
                addIdentifierIfNeeded(fieldValue as any);
              }
            }
          });
        }
      },
    });

    return keywordVars.toArray().filter(Boolean);
  } catch (e) {
    throw new ParseError(expr, e);
  }
}

export function parseExpressionGetGlobalVariables(
  expr: string | null | undefined,
  { filter = () => true }: ParseExpressionGetGlobalVariablesOptions = {},
): string[] {
  if (!expr) {
    return [];
  }

  try {
    const undeclaredVars = new OrderedSet<string>();

    const ast = parser.parse(`!(${expr});`);

    const addUndeclaredIdentifierIfNeeded = (
      x: Node | null | undefined,
      path: NodePath<Node>,
    ) => {
      if (typeof x === 'object' && isIdentifier(x) && !path.scope.hasBinding(x.name)) {
        undeclaredVars.add(x.name);
      }
    };

    traverse(ast, {
      enter(path) {
        const { node } = path;
        const expressionFields = MAYBE_EXPRESSIONS[node.type]?.fields;
        if (expressionFields) {
          (typeof expressionFields === 'function'
            ? expressionFields(node)
            : expressionFields
          ).forEach((fieldName) => {
            const fieldValue = node[fieldName as keyof typeof node];
            if (typeof fieldValue === 'object') {
              if (Array.isArray(fieldValue)) {
                fieldValue.forEach((item: any) => {
                  addUndeclaredIdentifierIfNeeded(item, path);
                });
              } else {
                addUndeclaredIdentifierIfNeeded(fieldValue as any, path);
              }
            }
          });
        }
      },
    });

    return undeclaredVars.toArray().filter(filter);
  } catch (e) {
    throw new ParseError(expr, e);
  }
}

export function parseExpressionConvertThis2Context(
  expr: string | t.Expression,
  contextName = '__$$context',
  localVariables: string[] = [],
): string {
  if (!expr) {
    return expr;
  }

  try {
    const exprAst = typeof expr === 'string' ? parser.parseExpression(expr) : expr;
    const exprWrapAst = t.expressionStatement(exprAst);
    const fileAst = t.file(t.program([exprWrapAst]));

    const localVariablesSet = new Set(localVariables);

    let thisScopeLevel = CROSS_THIS_SCOPE_TYPE_NODE[exprAst.type] ? -1 : 0;
    traverse(fileAst, {
      enter(path) {
        if (CROSS_THIS_SCOPE_TYPE_NODE[path.node.type]) {
          thisScopeLevel++;
        }
      },
      exit(path) {
        if (CROSS_THIS_SCOPE_TYPE_NODE[path.node.type]) {
          thisScopeLevel--;
        }
      },
      MemberExpression(path) {
        if (!path.isMemberExpression()) {
          return;
        }

        const obj = path.get('object');
        if (!obj.isThisExpression()) {
          return;
        }

        // 处理局部变量
        if (!path.node.computed) {
          const prop = path.get('property');
          if (prop.isIdentifier() && localVariablesSet.has(prop.node.name)) {
            path.replaceWith(t.identifier(prop.node.name));
            return;
          }
        }

        // 替换 this (只在顶层替换)
        if (thisScopeLevel <= 0) {
          obj.replaceWith(t.identifier(contextName));
        }
      },
      ThisExpression(path) {
        if (!path.isThisExpression()) {
          return;
        }

        // MemberExpression 中的 this.xxx 已经处理过了
        if (path.parent.type === 'MemberExpression') {
          return;
        }

        if (thisScopeLevel <= 0) {
          path.replaceWith(t.identifier(contextName));
        }
      },
    });

    const { code } = generate(exprWrapAst.expression, { sourceMaps: false });
    return code;
  } catch (e) {
    throw new ParseError(expr, e);
  }
}

export function parseExpression(expr: string) {
  try {
    return parser.parseExpression(expr);
  } catch (e) {
    throw new ParseError(expr, e);
  }
}

export function transformExpressionLocalRef(expr: string, scope: IScope) {
  if (!expr) {
    return expr;
  }

  if (!scope) {
    throw new Error('transform expression without scope');
  }

  try {
    const exprAst = typeof expr === 'string' ? parser.parseExpression(expr) : expr;
    const exprWrapAst = t.expressionStatement(exprAst);
    const fileAst = t.file(t.program([exprWrapAst]));

    traverse(fileAst, {
      MemberExpression(path) {
        if (!path.isMemberExpression()) {
          return;
        }

        const obj = path.get('object');
        if (!obj.isThisExpression()) {
          return;
        }

        // 查看是否存在引用 local 值
        const prop = path.get('property');
        let memberName = '';
        if (!path.node.computed && prop.isIdentifier()) {
          memberName = prop.node.name;
        } else if (path.node.computed && prop.isStringLiteral()) {
          memberName = prop.node.value;
        }
        if (memberName && scope.bindings && scope.bindings.hasBinding(memberName)) {
          path.replaceWith(t.identifier(memberName));
        }
      },
    });

    const { code } = generate(exprWrapAst.expression, { sourceMaps: false });
    return code;
  } catch (e) {
    throw new ParseError(expr, e);
    // throw e;
  }
}
