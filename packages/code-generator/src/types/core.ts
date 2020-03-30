import {
  IBasicSchema,
  IParseResult,
  IProjectSchema,
  IResultDir,
  IResultFile,
} from './index';

export enum FileType {
  CSS = 'css',
  SCSS = 'scss',
  HTML = 'html',
  JS = 'js',
  JSX = 'jsx',
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
  fileType: FileType;
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

export type BuilderComponentPlugin = (
  initStruct: ICodeStruct,
) => Promise<ICodeStruct>;

export interface IChunkBuilder {
  run(
    ir: any,
    initialStructure?: ICodeStruct,
  ): Promise<{ chunks: ICodeChunk[][] }>;
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
  generateModule: (input: unknown) => Promise<ICompiledModule>;
  linkCodeChunks: (
    chunks: Record<string, ICodeChunk[]>,
    fileName: string,
  ) => IResultFile[];
  addPlugin: (plugin: BuilderComponentPlugin) => void;
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
  parse(schema: IBasicSchema): IParseResult;
}

export interface IProjectTemplate {
  slots: IProjectSlots;
  generateTemplate(): IResultDir;
}

export interface IProjectSlot {
  path: string[];
  fileName?: string;
}

export interface IProjectSlots {
  components: IProjectSlot;
  pages: IProjectSlot;
  router: IProjectSlot;
  entry: IProjectSlot;
  constants?: IProjectSlot;
  utils?: IProjectSlot;
  i18n?: IProjectSlot;
  globalStyle: IProjectSlot;
  htmlEntry: IProjectSlot;
  packageJSON: IProjectSlot;
}

export interface IProjectPlugins {
  components: BuilderComponentPlugin[];
  pages: BuilderComponentPlugin[];
  router: BuilderComponentPlugin[];
  entry: BuilderComponentPlugin[];
  constants?: BuilderComponentPlugin[];
  utils?: BuilderComponentPlugin[];
  i18n?: BuilderComponentPlugin[];
  globalStyle: BuilderComponentPlugin[];
  htmlEntry: BuilderComponentPlugin[];
  packageJSON: BuilderComponentPlugin[];
}

export interface IProjectBuilder {
  generateProject(schema: IProjectSchema): Promise<IResultDir>;
}

export type PostProcessor = (content: string, fileType: string) => string;
