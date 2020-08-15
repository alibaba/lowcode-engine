import {
  ResultDir,
  ResultFile,
  NodeData,
  NodeSchema,
  ProjectSchema,
  JSExpression,
  JSFunction,
  CompositeArray,
  CompositeObject,
  JSONArray,
  JSONObject,
  JSSlot,
} from '@ali/lowcode-types';

import { IParseResult } from './intermediate';

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

export enum PIECE_TYPE {
  BEFORE = 'NodeCodePieceBefore',
  TAG = 'NodeCodePieceTag',
  ATTR = 'NodeCodePieceAttr',
  CHILDREN = 'NodeCodePieceChildren',
  AFTER = 'NodeCodePieceAfter',
}

export interface CodePiece {
  value: string;
  type: PIECE_TYPE;
}

// TODO: 这个 HandlerSet 和 CustomHandlerSet 为啥定义还不一样？
export interface HandlerSet<T> {
  string?: (input: string) => T[];
  expression?: (input: JSExpression) => T[];
  function?: (input: JSFunction) => T[];
  node?: (input: NodeSchema) => T[];
  common?: (input: unknown) => T[];
}

export type ExtGeneratorPlugin = (
  ctx: INodeGeneratorContext,
  nodeItem: NodeSchema,
  handlers: CustomHandlerSet,
) => CodePiece[];

export interface INodeGeneratorConfig {
  nodeTypeMapping?: Record<string, string>;
}

export type NodeGenerator = (nodeItem: NodeData) => string;

export interface INodeGeneratorContext {
  generator: NodeGenerator;
}

export type CompositeValueCustomHandler = (data: unknown) => string;
export type CompositeTypeContainerHandler = (value: string) => string;
export interface CompositeValueCustomHandlerSet {
  boolean?: CompositeValueCustomHandler;
  number?: CompositeValueCustomHandler;
  string?: CompositeValueCustomHandler;
  array?: CompositeValueCustomHandler;
  object?: CompositeValueCustomHandler;
  expression?: CompositeValueCustomHandler;
  function?: CompositeValueCustomHandler;
}

export type CompositeValueGeneratorOptions = {
  handlers?: CompositeValueCustomHandlerSet;
  containerHandler?: (value: string, isString: boolean, valStr: string) => string;
  nodeGenerator?: NodeGenerator;
};
