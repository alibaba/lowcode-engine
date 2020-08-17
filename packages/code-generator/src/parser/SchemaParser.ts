/**
 * 解析器是对输入的固定格式数据做拆解，使其符合引擎后续步骤预期，完成统一处理逻辑的步骤。
 * 本解析器面向的是标准 schema 协议。
 */
import changeCase from 'change-case';
import { UtilItem, NodeDataType, NodeSchema, ContainerSchema, ProjectSchema, PropsMap } from '@ali/lowcode-types';

import { SUPPORT_SCHEMA_VERSION_LIST } from '../const';

import { handleSubNodes } from '../utils/nodeToJSX';
import { uniqueArray } from '../utils/common';

import {
  CodeGeneratorError,
  CompatibilityError,
  DependencyType,
  IContainerInfo,
  IDependency,
  IExternalDependency,
  IInternalDependency,
  InternalDependencyType,
  IParseResult,
  ISchemaParser,
  INpmPackage,
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
  validate(schema: ProjectSchema): boolean {
    if (SUPPORT_SCHEMA_VERSION_LIST.indexOf(schema.version) < 0) {
      throw new CompatibilityError(`Not support schema with version [${schema.version}]`);
    }

    return true;
  }

  parse(schemaSrc: ProjectSchema | string): IParseResult {
    // TODO: collect utils depends in JSExpression
    const compDeps: Record<string, IExternalDependency> = {};
    const internalDeps: Record<string, IInternalDependency> = {};
    let utilsDeps: IExternalDependency[] = [];

    let schema: ProjectSchema;
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
          componentName: info.componentName,
          exportName: info.exportName ?? info.componentName,
          version: info.version || '*',
          destructuring: info.destructuring ?? false,
        };
      }
    });

    let containers: IContainerInfo[];
    // Test if this is a lowcode component without container
    if (schema.componentsTree.length > 0) {
      const firstRoot: ContainerSchema = schema.componentsTree[0] as ContainerSchema;

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
          const subRoot = n as ContainerSchema;
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

    const containersDeps = ([] as IDependency[]).concat(...containers.map((c) => c.deps || []));
    // TODO: 不应该在出码部分解决？
    // 处理 children 写在了 props 里的情况
    containers.forEach((container) => {
      if (container.children) {
        handleSubNodes<string>(
          container.children,
          {
            node: (i: NodeSchema) => {
              if (i.props) {
                if (Array.isArray(i.props)) {
                  // FIXME: is array type props description
                } else {
                  const nodeProps = i.props as PropsMap;
                  if (nodeProps.children && !i.children) {
                    i.children = nodeProps.children as NodeDataType;
                  }
                }
              }
              return '';
            },
          },
          {
            rerun: true,
          },
        );
      }
    });

    // 分析容器内部组件依赖
    containers.forEach((container) => {
      if (container.children) {
        const depNames = this.getComponentNames(container.children);
        container.deps = uniqueArray<string>(depNames, (i: string) => i)
          .map((depName) => internalDeps[depName] || compDeps[depName])
          .filter((dep) => !!dep);
        // container.deps = Object.keys(compDeps).map((depName) => compDeps[depName]);
      }
    });

    // 分析路由配置
    // TODO: 低代码规范里面的路由是咋弄的？
    const routes = containers
      .filter((container) => container.containerType === 'Page')
      .map((page) => {
        let router = '';
        if (page.meta) {
          router = (page.meta as any)?.router || '';
        }

        if (!router) {
          router = `/${page.fileName}`;
        }

        return {
          path: router,
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

    // 分析项目 npm 依赖
    let npms: INpmPackage[] = [];
    containers.forEach((con) => {
      const p = (con.deps || [])
        .map((dep) => (dep.dependencyType === DependencyType.External ? dep : null))
        .filter((dep) => dep !== null);
      npms.push(...((p as unknown) as INpmPackage[]));
    });
    npms = uniqueArray<INpmPackage>(npms, (i) => i.package);

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
        css: schema.css,
        constants: schema.constants,
        i18n: schema.i18n,
        containersDeps,
        utilsDeps,
        packages: npms,
      },
    };
  }

  getComponentNames(children: NodeDataType): string[] {
    return handleSubNodes<string>(
      children,
      {
        node: (i: NodeSchema) => i.componentName,
      },
      {
        rerun: true,
      },
    );
  }
}

export default SchemaParser;
