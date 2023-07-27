import { ResultDir, ResultFile, IPublicTypeProjectSchema } from '@alilc/lowcode-types';

import {
  IModuleBuilder,
  IParseResult,
  IProjectBuilder,
  IProjectPlugins,
  IProjectTemplate,
  ISchemaParser,
  PostProcessor,
} from '../types';

import { SchemaParser } from '../parser/SchemaParser';
import { createResultDir, addDirectory, addFile } from '../utils/resultHelper';

import { createModuleBuilder } from './ModuleBuilder';
import { ProjectPreProcessor, ProjectPostProcessor, IContextData } from '../types/core';
import { CodeGeneratorError } from '../types/error';
import { isBuiltinSlotName } from '../const';

interface IModuleInfo {
  moduleName?: string;
  path: string[];
  files: ResultFile[];
}

export interface ProjectBuilderInitOptions {

  /** 项目模板 */
  template: IProjectTemplate;

  /** 项目插件 */
  plugins: IProjectPlugins;

  /** 模块后置处理器 */
  postProcessors: PostProcessor[];

  /** Schema 解析器 */
  schemaParser?: ISchemaParser;

  /** 项目级别的前置处理器 */
  projectPreProcessors?: ProjectPreProcessor[];

  /** 项目级别的后置处理器 */
  projectPostProcessors?: ProjectPostProcessor[];

  /** 是否处于严格模式 */
  inStrictMode?: boolean;

  /** 一些额外的上下文数据 */
  extraContextData?: Record<string, unknown>;

  /**
   * Hook which is used to customize original options, we can reorder/add/remove plugins/processors
   * of the existing solution.
   */
  customizeBuilderOptions?(originalOptions: ProjectBuilderInitOptions): ProjectBuilderInitOptions;
}

export class ProjectBuilder implements IProjectBuilder {
  /** 项目模板 */
  private template: IProjectTemplate;

  /** 项目插件 */
  private plugins: IProjectPlugins;

  /** 模块后置处理器 */
  private postProcessors: PostProcessor[];

  /** Schema 解析器 */
  private schemaParser: ISchemaParser;

  /** 项目级别的前置处理器 */
  private projectPreProcessors: ProjectPreProcessor[];

  /** 项目级别的后置处理器 */
  private projectPostProcessors: ProjectPostProcessor[];

  /** 是否处于严格模式 */
  readonly inStrictMode: boolean;

  /** 一些额外的上下文数据 */
  readonly extraContextData: IContextData;

  constructor(builderOptions: ProjectBuilderInitOptions) {
    let customBuilderOptions = builderOptions;
    if (typeof builderOptions.customizeBuilderOptions === 'function') {
      customBuilderOptions = builderOptions.customizeBuilderOptions(builderOptions);
    }
    const {
      template,
      plugins,
      postProcessors,
      schemaParser = new SchemaParser(),
      projectPreProcessors = [],
      projectPostProcessors = [],
      inStrictMode = false,
      extraContextData = {},
    } = customBuilderOptions;
    this.template = template;
    this.plugins = plugins;
    this.postProcessors = postProcessors;
    this.schemaParser = schemaParser;
    this.projectPreProcessors = projectPreProcessors;
    this.projectPostProcessors = projectPostProcessors;
    this.inStrictMode = inStrictMode;
    this.extraContextData = extraContextData;
  }

  async generateProject(originalSchema: IPublicTypeProjectSchema | string): Promise<ResultDir> {
    // Init
    const { schemaParser } = this;

    let schema: IPublicTypeProjectSchema =
      typeof originalSchema === 'string' ? JSON.parse(originalSchema) : originalSchema;

    // Parse / Format
    // Preprocess
    for (const preProcessor of this.projectPreProcessors) {
      // eslint-disable-next-line no-await-in-loop
      schema = await preProcessor(schema);
    }

    // Validate
    if (!schemaParser.validate(schema)) {
      throw new CodeGeneratorError('Schema is invalid');
    }

    // Collect Deps
    // Parse JSExpression
    const parseResult: IParseResult = schemaParser.parse(schema);

    const projectRoot = await this.template.generateTemplate(parseResult);

    let buildResult: IModuleInfo[] = [];

    const builders = this.createModuleBuilders({
      extraContextData: {
        projectRemark: parseResult?.project?.projectRemark,
        template: this.template,
      },
    });
    // Generator Code module
    // components
    // pages
    const containerBuildResult: IModuleInfo[] = await Promise.all<IModuleInfo>(
      parseResult.containers.map(async (containerInfo) => {
        let builder: IModuleBuilder;
        let path: string[];
        if (containerInfo.containerType === 'Page') {
          builder = builders.pages;
          path = this.template.slots.pages.path;
        } else {
          builder = builders.components;
          path = this.template.slots.components.path;
        }

        const { files } = await builder.generateModule(containerInfo);

        return {
          moduleName: containerInfo.moduleName,
          path,
          files,
        };
      }),
    );
    buildResult = buildResult.concat(containerBuildResult);

    // router
    if (parseResult.globalRouter && builders.router) {
      const { files } = await builders.router.generateModule(parseResult.globalRouter);

      buildResult.push({
        path: this.template.slots.router.path,
        files,
      });
    }

    // entry
    if (parseResult.project && builders.entry) {
      const { files } = await builders.entry.generateModule(parseResult.project);

      buildResult.push({
        path: this.template.slots.entry.path,
        files,
      });
    }

    // appConfig
    if (builders.appConfig) {
      const { files } = await builders.appConfig.generateModule(parseResult);

      buildResult.push({
        path: this.template.slots.appConfig.path,
        files,
      });
    }

    // buildConfig
    if (builders.buildConfig) {
      const { files } = await builders.buildConfig.generateModule(parseResult);

      buildResult.push({
        path: this.template.slots.buildConfig.path,
        files,
      });
    }

    // constants?
    if (parseResult.project && builders.constants && this.template.slots.constants) {
      const { files } = await builders.constants.generateModule(parseResult.project);

      buildResult.push({
        path: this.template.slots.constants.path,
        files,
      });
    }

    // utils?
    if (parseResult.globalUtils && builders.utils && this.template.slots.utils) {
      const { files } = await builders.utils.generateModule(parseResult.globalUtils);

      buildResult.push({
        path: this.template.slots.utils.path,
        files,
      });
    }

    // i18n?
    if (builders.i18n && this.template.slots.i18n) {
      const { files } = await builders.i18n.generateModule(parseResult.project);

      buildResult.push({
        path: this.template.slots.i18n.path,
        files,
      });
    }

    // globalStyle
    if (parseResult.project && builders.globalStyle) {
      const { files } = await builders.globalStyle.generateModule(parseResult.project);

      buildResult.push({
        path: this.template.slots.globalStyle.path,
        files,
      });
    }

    // htmlEntry
    if (parseResult.project && builders.htmlEntry) {
      const { files } = await builders.htmlEntry.generateModule(parseResult.project);

      buildResult.push({
        path: this.template.slots.htmlEntry.path,
        files,
      });
    }

    // packageJSON
    if (parseResult.project && builders.packageJSON) {
      const { files } = await builders.packageJSON.generateModule(parseResult.project);

      buildResult.push({
        path: this.template.slots.packageJSON.path,
        files,
      });
    }

    // demo
    if (parseResult.project && builders.demo) {
      const { files } = await builders.demo.generateModule(parseResult.project);
      buildResult.push({
        path: this.template.slots.demo.path,
        files,
      });
    }

    // handle extra slots
    await this.generateExtraSlots(builders, parseResult, buildResult);

    // Post Process
    const isSingleComponent = parseResult?.project?.projectRemark?.isSingleComponent;
    // Combine Modules
    buildResult.forEach((moduleInfo) => {
      let targetDir = getDirFromRoot(projectRoot, moduleInfo.path);
      // if project only contain single component, skip creation of directory.
      if (moduleInfo.moduleName && !isSingleComponent) {
        const dir = createResultDir(moduleInfo.moduleName);
        addDirectory(targetDir, dir);
        targetDir = dir;
      }
      moduleInfo.files.forEach((file) => addFile(targetDir, file));
    });

    // post-processors
    let finalResult = projectRoot;
    for (const projectPostProcessor of this.projectPostProcessors) {
      // eslint-disable-next-line no-await-in-loop
      finalResult = await projectPostProcessor(finalResult, schema, originalSchema, {
        template: this.template,
        parseResult,
      });
    }

    return finalResult;
  }

  private createModuleBuilders(extraContextData: Record<string, unknown> = {}):
    Record<string, IModuleBuilder> {
    const builders: Record<string, IModuleBuilder> = {};

    Object.keys(this.plugins).forEach((pluginName) => {
      if (this.plugins[pluginName].length > 0) {
        const options: { mainFileName?: string } = {};
        if (this.template.slots[pluginName] && this.template.slots[pluginName].fileName) {
          options.mainFileName = this.template.slots[pluginName].fileName;
        }
        builders[pluginName] = createModuleBuilder({
          plugins: this.plugins[pluginName],
          postProcessors: this.postProcessors,
          contextData: {
            // template: this.template,
            inStrictMode: this.inStrictMode,
            tolerateEvalErrors: true,
            evalErrorsHandler: '',
            ...this.extraContextData,
            ...extraContextData,
          },
          ...options,
        });
      }
    });

    return builders;
  }

  private async generateExtraSlots(
    builders: Record<string, IModuleBuilder>,
    parseResult: IParseResult,
    buildResult: IModuleInfo[],
  ) {
    for (const slotName in this.template.slots) {
      if (!isBuiltinSlotName(slotName)) {
        const { files } = await builders[slotName].generateModule(parseResult);
        buildResult.push({
          path: this.template.slots[slotName].path,
          files,
        });
      }
    }
  }
}

export function createProjectBuilder(initOptions: ProjectBuilderInitOptions): IProjectBuilder {
  return new ProjectBuilder(initOptions);
}

function getDirFromRoot(root: ResultDir, path: string[]): ResultDir {
  let current: ResultDir = root;
  path.forEach((p) => {
    const exist = current.dirs.find((d) => d.name === p);
    if (exist) {
      current = exist;
    } else {
      const newDir = createResultDir(p);
      addDirectory(current, newDir);
      current = newDir;
    }
  });

  return current;
}
