import {
  IModuleBuilder,
  IParseResult,
  IProjectBuilder,
  IProjectPlugins,
  IProjectSchema,
  IProjectTemplate,
  IResultDir,
  IResultFile,
  ISchemaParser,
  PostProcessor,
} from '../types';

import ResultDir from '@/model/ResultDir';
import SchemaParser from '@/parser/SchemaParser';

import { createModuleBuilder } from '@/generator/ModuleBuilder';

interface IModuleInfo {
  moduleName?: string;
  path: string[];
  files: IResultFile[];
}

function getDirFromRoot(root: IResultDir, path: string[]): IResultDir {
  let current: IResultDir = root;
  path.forEach(p => {
    const exist = current.dirs.find(d => d.name === p);
    if (exist) {
      current = exist;
    } else {
      const newDir = new ResultDir(p);
      current.addDirectory(newDir);
      current = newDir;
    }
  });

  return current;
}

export class ProjectBuilder implements IProjectBuilder {
  private template: IProjectTemplate;
  private plugins: IProjectPlugins;
  private postProcessors: PostProcessor[];

  constructor({
    template,
    plugins,
    postProcessors,
  }: {
    template: IProjectTemplate;
    plugins: IProjectPlugins;
    postProcessors: PostProcessor[];
  }) {
    this.template = template;
    this.plugins = plugins;
    this.postProcessors = postProcessors;
  }

  public async generateProject(schema: IProjectSchema): Promise<IResultDir> {
    // Init working parts
    const schemaParser: ISchemaParser = new SchemaParser();
    const builders = this.createModuleBuilders();
    const projectRoot = this.template.generateTemplate();

    // Validate
    // Parse / Format

    // Preprocess
    // Colllect Deps
    // Parse JSExpression
    const parseResult: IParseResult = schemaParser.parse(schema);
    let buildResult: IModuleInfo[] = [];

    // Generator Code module
    // components
    // pages
    const containerBuildResult: IModuleInfo[] = await Promise.all<IModuleInfo>(
      parseResult.containers.map(async containerInfo => {
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
          moduleName: containerInfo.fileName,
          path,
          files,
        };
      }),
    );
    buildResult = buildResult.concat(containerBuildResult);

    // router
    if (parseResult.globalRouter && builders.router) {
      const { files } = await builders.router.generateModule(
        parseResult.globalRouter,
      );

      buildResult.push({
        path: this.template.slots.router.path,
        files,
      });
    }

    // entry
    if (parseResult.project && builders.entry) {
      const { files } = await builders.entry.generateModule(
        parseResult.project,
      );

      buildResult.push({
        path: this.template.slots.entry.path,
        files,
      });
    }
    // constants?
    if (
      parseResult.project &&
      builders.constants &&
      this.template.slots.constants
    ) {
      const { files } = await builders.constants.generateModule(
        parseResult.project,
      );

      buildResult.push({
        path: this.template.slots.constants.path,
        files,
      });
    }
    // utils?
    if (
      parseResult.globalUtils &&
      builders.utils &&
      this.template.slots.utils
    ) {
      const { files } = await builders.utils.generateModule(
        parseResult.globalUtils,
      );

      buildResult.push({
        path: this.template.slots.utils.path,
        files,
      });
    }
    // i18n?
    if (parseResult.globalI18n && builders.i18n && this.template.slots.i18n) {
      const { files } = await builders.i18n.generateModule(
        parseResult.globalI18n,
      );

      buildResult.push({
        path: this.template.slots.i18n.path,
        files,
      });
    }
    // globalStyle
    if (parseResult.project && builders.globalStyle) {
      const { files } = await builders.globalStyle.generateModule(
        parseResult.project,
      );

      buildResult.push({
        path: this.template.slots.globalStyle.path,
        files,
      });
    }
    // htmlEntry
    if (parseResult.project && builders.htmlEntry) {
      const { files } = await builders.htmlEntry.generateModule(
        parseResult.project,
      );

      buildResult.push({
        path: this.template.slots.htmlEntry.path,
        files,
      });
    }
    // packageJSON
    if (parseResult.project && builders.packageJSON) {
      const { files } = await builders.packageJSON.generateModule(
        parseResult.project,
      );

      buildResult.push({
        path: this.template.slots.packageJSON.path,
        files,
      });
    }

    // Post Process

    // Combine Modules
    buildResult.forEach(moduleInfo => {
      let targetDir = getDirFromRoot(projectRoot, moduleInfo.path);
      if (moduleInfo.moduleName) {
        const dir = new ResultDir(moduleInfo.moduleName);
        targetDir.addDirectory(dir);
        targetDir = dir;
      }
      moduleInfo.files.forEach(file => targetDir.addFile(file));
    });

    return projectRoot;
  }

  private createModuleBuilders(): Record<string, IModuleBuilder> {
    const builders: Record<string, IModuleBuilder> = {};

    builders.components = createModuleBuilder({
      plugins: this.plugins.components,
      postProcessors: this.postProcessors,
    });
    builders.pages = createModuleBuilder({
      plugins: this.plugins.pages,
      postProcessors: this.postProcessors,
    });
    builders.router = createModuleBuilder({
      plugins: this.plugins.router,
      mainFileName: this.template.slots.router.fileName,
      postProcessors: this.postProcessors,
    });
    builders.entry = createModuleBuilder({
      plugins: this.plugins.entry,
      mainFileName: this.template.slots.entry.fileName,
      postProcessors: this.postProcessors,
    });
    builders.globalStyle = createModuleBuilder({
      plugins: this.plugins.globalStyle,
      mainFileName: this.template.slots.globalStyle.fileName,
      postProcessors: this.postProcessors,
    });
    builders.htmlEntry = createModuleBuilder({
      plugins: this.plugins.htmlEntry,
      mainFileName: this.template.slots.htmlEntry.fileName,
      postProcessors: this.postProcessors,
    });
    builders.packageJSON = createModuleBuilder({
      plugins: this.plugins.packageJSON,
      mainFileName: this.template.slots.packageJSON.fileName,
      postProcessors: this.postProcessors,
    });

    if (this.template.slots.constants && this.plugins.constants) {
      builders.constants = createModuleBuilder({
        plugins: this.plugins.constants,
        mainFileName: this.template.slots.constants.fileName,
        postProcessors: this.postProcessors,
      });
    }
    if (this.template.slots.utils && this.plugins.utils) {
      builders.utils = createModuleBuilder({
        plugins: this.plugins.utils,
        mainFileName: this.template.slots.utils.fileName,
        postProcessors: this.postProcessors,
      });
    }
    if (this.template.slots.i18n && this.plugins.i18n) {
      builders.i18n = createModuleBuilder({
        plugins: this.plugins.i18n,
        mainFileName: this.template.slots.i18n.fileName,
        postProcessors: this.postProcessors,
      });
    }

    return builders;
  }
}

export function createProjectBuilder({
  template,
  plugins,
  postProcessors,
}: {
  template: IProjectTemplate;
  plugins: IProjectPlugins;
  postProcessors: PostProcessor[];
}): IProjectBuilder {
  return new ProjectBuilder({
    template,
    plugins,
    postProcessors,
  });
}
