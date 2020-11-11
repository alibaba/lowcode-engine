import {
  JSONArray,
  JSONObject,
  CompositeArray,
  CompositeObject,
  ResultDir,
  ResultFile,
  NodeDataType,
  ProjectSchema,
  JSExpression,
  JSFunction,
  JSSlot,
} from '@ali/lowcode-types';

import { IParseResult } from './intermediate';
import { IScopeBindings } from '../utils/ScopeBindings';

export enum FileType {
  CSS = 'css',
  SCSS = 'scss',
  LESS = 'less',
  HTML = 'html',
  JS = 'js',
  JSX = 'jsx',
  TS = 'ts',
  TSX = 'tsx',
  JSON = 'json',
}

export enum ChunkType {
  AST = 'ast',
  STRING = 'string',
  JSON = 'json',
}

export enum PluginType {
  COMPONENT = 'component',
  UTILS = 'utils',
  I18N = 'i18n',
}

export type ChunkContent = string | any;
export type CodeGeneratorFunction<T> = (content: T) => string;

export interface ICodeChunk {
  type: ChunkType;
  fileType: string;
  name: string;
  subModule?: string;
  content: ChunkContent;
  linkAfter: string[];
  ext?: Record<string, unknown>;
}

export interface IBaseCodeStruct {
  chunks: ICodeChunk[];
  depNames: string[];
}

export interface ICodeStruct extends IBaseCodeStruct {
  ir: any;
  chunks: ICodeChunk[];
}

export type BuilderComponentPlugin = (initStruct: ICodeStruct) => Promise<ICodeStruct>;

export type BuilderComponentPluginFactory<T> = (config?: T) => BuilderComponentPlugin;

export interface IChunkBuilder {
  run(ir: any, initialStructure?: ICodeStruct): Promise<{ chunks: ICodeChunk[][] }>;
  getPlugins(): BuilderComponentPlugin[];
  addPlugin(plugin: BuilderComponentPlugin): void;
}

export interface ICodeBuilder {
  link(chunkDefinitions: ICodeChunk[]): string;
  generateByType(type: string, content: unknown): string;
}

export interface ICompiledModule {
  files: ResultFile[];
}

export interface IModuleBuilder {
  generateModule(input: unknown): Promise<ICompiledModule>;
  generateModuleCode(schema: ProjectSchema | string): Promise<ResultDir>;
  linkCodeChunks(chunks: Record<string, ICodeChunk[]>, fileName: string): ResultFile[];
  addPlugin(plugin: BuilderComponentPlugin): void;
}

/**
 * 引擎对外接口
 *
 * @export
 * @interface ICodeGenerator
 */
export interface ICodeGenerator {
  /**
   * 出码接口，把 Schema 转换成代码文件系统描述
   *
   * @param {(ProjectSchema)} schema 传入的 Schema
   * @returns {ResultDir}
   * @memberof ICodeGenerator
   */
  toCode(schema: ProjectSchema): Promise<ResultDir>;
}

export interface ISchemaParser {
  validate(schema: ProjectSchema): boolean;
  parse(schema: ProjectSchema | string): IParseResult;
}

export interface IProjectTemplate {
  slots: Record<string, IProjectSlot>;
  generateTemplate(): ResultDir;
}

export interface IProjectSlot {
  path: string[];
  fileName?: string;
}

export interface IProjectPlugins {
  [slotName: string]: BuilderComponentPlugin[];
}

export interface IProjectBuilder {
  generateProject(schema: ProjectSchema | string): Promise<ResultDir>;
}

export type PostProcessorFactory<T> = (config?: T) => PostProcessor;
export type PostProcessor = (content: string, fileType: string) => string;

// TODO: temp interface, need modify
export interface IPluginOptions {
  fileDirDepth: number;
}

export type BaseGenerator<I, T, C> = (input: I, scope: IScope, config?: C, next?: BaseGenerator<I, T, C>) => T;
type CompositeTypeGenerator<I, T> =
  | BaseGenerator<I, T, CompositeValueGeneratorOptions>
  | Array<BaseGenerator<I, T, CompositeValueGeneratorOptions>>;

export type NodeGenerator<T> = (nodeItem: NodeDataType, scope: IScope) => T;

// FIXME: 在新的实现中，添加了第一参数 this: CustomHandlerSet 作为上下文。究其本质
// scopeBindings?: IScopeBindings;
// 这个组合只用来用来处理 CompositeValue 类型，不是这个类型的不要放在这里
export interface HandlerSet<T> {
  string?: CompositeTypeGenerator<string, T>;
  boolean?: CompositeTypeGenerator<boolean, T>;
  number?: CompositeTypeGenerator<number, T>;
  expression?: CompositeTypeGenerator<JSExpression, T>;
  function?: CompositeTypeGenerator<JSFunction, T>;
  slot?: CompositeTypeGenerator<JSSlot, T>;
  array?: CompositeTypeGenerator<JSONArray | CompositeArray, T>;
  object?: CompositeTypeGenerator<JSONObject | CompositeObject, T>;
}

export type CompositeValueGeneratorOptions = {
  handlers?: HandlerSet<string>;
  nodeGenerator?: NodeGenerator<string>;
};

/**
 * 作用域定义，维护作用域内定义，支持作用域链上溯
 */
export interface IScope {
  // 作用域内定义
  bindings?: IScopeBindings;
  // TODO: 需要有上下文信息吗？ 描述什么内容
  createSubScope: (ownIndentifiers: string[]) => IScope;
}
