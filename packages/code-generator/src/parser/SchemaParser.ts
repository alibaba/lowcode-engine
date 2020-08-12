/**
 * 解析器是对输入的固定格式数据做拆解，使其符合引擎后续步骤预期，完成统一处理逻辑的步骤。
 * 本解析器面向的是标准 schema 协议。
 */
import changeCase from 'change-case';
import { SUPPORT_SCHEMA_VERSION_LIST } from '../const';

import { handleChildren } from '../utils/nodeToJSX';

import {
  NodeData,
  CodeGeneratorError,
  CompatibilityError,
  DependencyType,
  IBasicSchema,
  NodeSchema,
  IContainerInfo,
  IContainerNodeItem,
  IDependency,
  IExternalDependency,
  IInternalDependency,
  InternalDependencyType,
  IPageMeta,
  IParseResult,
  IProjectSchema,
  ISchemaParser,
  UtilItem,
} from '../types';

const defaultContainer: IContainerInfo = {
  containerType: 'Component',
  componentName: 'Component',
  moduleName: 'Index',
  fileName: 'Index',
  css: '',
  props: {},
};

class SchemaParser implements ISchemaParser {
  public validate(schema: IBasicSchema): boolean {
    if (SUPPORT_SCHEMA_VERSION_LIST.indexOf(schema.version) < 0) {
      throw new CompatibilityError(`Not support schema with version [${schema.version}]`);
    }

    return true;
  }

  public parse(schemaSrc: IProjectSchema | string): IParseResult {
    // TODO: collect utils depends in JSExpression
    const compDeps: Record<string, IExternalDependency> = {};
    const internalDeps: Record<string, IInternalDependency> = {};
    let utilsDeps: IExternalDependency[] = [];

    let schema: IProjectSchema;
    if (typeof schemaSrc === 'string') {
      try {
        schema = JSON.parse(schemaSrc);
      } catch (error) {
        throw new CodeGeneratorError(`Parse schema failed: ${error.message || 'unknown reason'}`);
      }
    } else {
      schema = schemaSrc;
    }

    // 解析三方组件依赖
    schema.componentsMap.forEach((info) => {
      if (info.componentName) {
        compDeps[info.componentName] = {
          ...info,
          dependencyType: DependencyType.External,
          importName: info.componentName,
          exportName: info.exportName ?? info.componentName,
          version: info.version || '*',
          destructuring: info.destructuring ?? false,
        };
      }
    });

    let containers: IContainerInfo[];
    // Test if this is a lowcode component without container
    if (schema.componentsTree.length > 0) {
      const firstRoot: IContainerNodeItem = schema.componentsTree[0] as IContainerNodeItem;

      if (!('fileName' in firstRoot) || !firstRoot.fileName) {
        // 整个 schema 描述一个容器，且无根节点定义
        const container: IContainerInfo = {
          ...defaultContainer,
          children: schema.componentsTree as NodeSchema[],
        };
        containers = [container];
      } else {
        // 普通带 1 到多个容器的 schema
        containers = schema.componentsTree.map((n) => {
          const subRoot = n;
          const container: IContainerInfo = {
            ...subRoot,
            containerType: subRoot.componentName,
            moduleName: changeCase.pascalCase(subRoot.fileName),
          };
          return container;
        });
      }
    } else {
      throw new CodeGeneratorError(`Can't find anything to generate.`);
    }

    // 建立所有容器的内部依赖索引
    containers.forEach((container) => {
      let type;
      switch (container.containerType) {
        case 'Page':
          type = InternalDependencyType.PAGE;
          break;
        case 'Block':
          type = InternalDependencyType.BLOCK;
          break;
        default:
          type = InternalDependencyType.COMPONENT;
          break;
      }

      const dep: IInternalDependency = {
        type,
        moduleName: container.moduleName,
        destructuring: false,
        exportName: container.moduleName,
        dependencyType: DependencyType.Internal,
      };

      internalDeps[dep.moduleName] = dep;
    });

    // 分析容器内部组件依赖
    containers.forEach((container) => {
      if (container.children) {
        // const depNames = this.getComponentNames(container.children);
        // container.deps = uniqueArray<string>(depNames)
        //   .map(depName => internalDeps[depName] || compDeps[depName])
        //   .filter(dep => !!dep);
        container.deps = Object.keys(compDeps).map((depName) => compDeps[depName]);
      }
    });

    const containersDeps = ([] as IDependency[]).concat(...containers.map((c) => c.deps || []));

    // 分析路由配置
    // TODO: 低代码规范里面的路由是咋弄的？
    const routes = containers
      .filter((container) => container.containerType === 'Page')
      .map((page) => {
        const meta = (page as { meta?: IPageMeta }).meta as IPageMeta;
        if (meta) {
          return {
            path: meta.router,
            componentName: page.moduleName,
          };
        }

        return {
          path: '',
          componentName: page.moduleName,
        };
      });

    const routerDeps = routes
      .map((r) => internalDeps[r.componentName] || compDeps[r.componentName])
      .filter((dep) => !!dep);

    // 分析 Utils 依赖
    let utils: UtilItem[];
    if (schema.utils) {
      utils = schema.utils;
      utilsDeps = schema.utils.filter((u) => u.type !== 'function').map((u) => u.content as IExternalDependency);
    } else {
      utils = [];
    }

    return {
      containers,
      globalUtils: {
        utils,
        deps: utilsDeps,
      },
      globalI18n: schema.i18n,
      globalRouter: {
        routes,
        deps: routerDeps,
      },
      project: {
        meta: schema.meta,
        config: schema.config,
        css: schema.css,
        constants: schema.constants,
        i18n: schema.i18n,
        containersDeps,
        utilsDeps,
      },
    };
  }

  public getComponentNames(children: NodeData | NodeData[]): string[] {
    return handleChildren(children, {
      node: (i: NodeSchema) => [i.componentName],
    });
  }
}

export default SchemaParser;
