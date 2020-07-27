import {
  IBasicSchema,
  IParseResult,
  IProjectSchema,
  IResultDir,
  IResultFile,
  IComponentNodeItem,
  IJSExpression,
} from './index';

export enum FileType {
  CSS = 'css',
  SCSS = 'scss',
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
  files: IResultFile[];
}

export interface IModuleBuilder {
  generateModule(input: unknown): Promise<ICompiledModule>;
  generateModuleCode(schema: IBasicSchema | string): Promise<IResultDir>;
  linkCodeChunks(chunks: Record<string, ICodeChunk[]>, fileName: string): IResultFile[];
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
   * @param {(IBasicSchema)} schema 传入的 Schema
   * @returns {IResultDir}
   * @memberof ICodeGenerator
   */
  toCode(schema: IBasicSchema): Promise<IResultDir>;
}

export interface ISchemaParser {
  validate(schema: IBasicSchema): boolean;
  parse(schema: IBasicSchema | string): IParseResult;
}

export interface IProjectTemplate {
  slots: Record<string, IProjectSlot>;
  generateTemplate(): IResultDir;
}

export interface IProjectSlot {
  path: string[];
  fileName?: string;
}

// export interface IProjectSlots {
//   components: IProjectSlot;
//   pages: IProjectSlot;
//   router: IProjectSlot;
//   entry: IProjectSlot;
//   constants?: IProjectSlot;
//   utils?: IProjectSlot;
//   i18n?: IProjectSlot;
//   globalStyle: IProjectSlot;
//   htmlEntry: IProjectSlot;
//   packageJSON: IProjectSlot;
// }

export interface IProjectPlugins {
  [slotName: string]: BuilderComponentPlugin[];
}

export interface IProjectBuilder {
  generateProject(schema: IProjectSchema | string): Promise<IResultDir>;
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

export interface HandlerSet<T> {
  string?: (input: string) => T[];
  expression?: (input: IJSExpression) => T[];
  node?: (input: IComponentNodeItem) => T[];
  common?: (input: unknown) => T[];
}

export type ExtGeneratorPlugin = (ctx: INodeGeneratorContext, nodeItem: IComponentNodeItem) => CodePiece[];

export interface INodeGeneratorConfig {
  nodeTypeMapping?: Record<string, string>;
}

export type NodeGenerator = (nodeItem: IComponentNodeItem) => string;

export interface INodeGeneratorContext {
  generator: NodeGenerator;
}

// export interface InteratorScope {
//   [$item: string]: string;           // $item 默认取值 "item"
//   [$index: string]: string | number; // $index 默认取值 "index"
//   __proto__: BlockInstance;
// }

export type CompositeValueCustomHandler = (data: unknown) => string;
export interface CompositeValueCustomHandlerSet {
  boolean?: CompositeValueCustomHandler;
  number?: CompositeValueCustomHandler;
  string?: CompositeValueCustomHandler;
  array?: CompositeValueCustomHandler;
  object?: CompositeValueCustomHandler;
  expression?: CompositeValueCustomHandler;
}

export interface CompositeValueGeneratorOptions {
  handlers?: CompositeValueCustomHandlerSet;
  nodeGenerator?: NodeGenerator;
}
