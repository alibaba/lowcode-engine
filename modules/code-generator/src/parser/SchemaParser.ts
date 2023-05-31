/**
 * 解析器是对输入的固定格式数据做拆解，使其符合引擎后续步骤预期，完成统一处理逻辑的步骤。
 * 本解析器面向的是标准 schema 协议。
 */
import changeCase from 'change-case';
import {
  IPublicTypeUtilItem,
  IPublicTypeNodeDataType,
  IPublicTypeNodeSchema,
  IPublicTypeContainerSchema,
  IPublicTypeProjectSchema,
  IPublicTypePropsMap,
  IPublicTypeNodeData,
  IPublicTypeNpmInfo,
} from '@alilc/lowcode-types';
import {
  IPageMeta,
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
  IRouterInfo,
} from '../types';

import { SUPPORT_SCHEMA_VERSION_LIST } from '../const';

import { getErrorMessage } from '../utils/errors';
import { handleSubNodes, isValidContainerType, ContainerType } from '../utils/schema';
import { uniqueArray } from '../utils/common';
import { componentAnalyzer } from '../analyzer/componentAnalyzer';
import { ensureValidClassName } from '../utils/validate';
import type { ProjectRemark } from '../types/intermediate';

const defaultContainer: IContainerInfo = {
  containerType: 'Component',
  componentName: 'Component',
  moduleName: 'Index',
  fileName: 'Index',
  css: '',
  props: {},
};

function getRootComponentName(typeName: string, maps: Record<string, IExternalDependency>): string {
  if (maps[typeName]) {
    const rec = maps[typeName];
    if (rec.destructuring) {
      return rec.componentName || typeName;
    }

    const peerName = Object.keys(maps).find((depName: string) => {
      const depInfo = maps[depName];
      return (
        depName !== typeName &&
        !depInfo.destructuring &&
        depInfo.package === rec.package &&
        depInfo.version === rec.version &&
        depInfo.main === rec.main &&
        depInfo.exportName === rec.exportName &&
        depInfo.subName === rec.subName
      );
    });

    return peerName || typeName;
  }
  return typeName;
}

function processChildren(schema: IPublicTypeNodeSchema): void {
  if (schema.props) {
    if (Array.isArray(schema.props)) {
      // FIXME: is array type props description
    } else {
      const nodeProps = schema.props as IPublicTypePropsMap;
      if (nodeProps.children) {
        if (!schema.children) {
          // eslint-disable-next-line no-param-reassign
          schema.children = nodeProps.children as IPublicTypeNodeDataType;
        } else {
          let _children: IPublicTypeNodeData[] = [];

          if (Array.isArray(schema.children)) {
            _children = _children.concat(schema.children);
          } else {
            _children.push(schema.children);
          }

          if (Array.isArray(nodeProps.children)) {
            _children = _children.concat(nodeProps.children as IPublicTypeNodeData[]);
          } else {
            _children.push(nodeProps.children as IPublicTypeNodeData);
          }

          // eslint-disable-next-line no-param-reassign
          schema.children = _children;
        }
        delete nodeProps.children;
      }
    }
  }
}

function getInternalDep(internalDeps: Record<string, IInternalDependency>, depName: string) {
  const dep = internalDeps[depName];
  return (dep && dep.type !== InternalDependencyType.PAGE) ? dep : null;
}

export class SchemaParser implements ISchemaParser {
  validate(schema: IPublicTypeProjectSchema): boolean {
    if (SUPPORT_SCHEMA_VERSION_LIST.indexOf(schema.version) < 0) {
      throw new CompatibilityError(`Not support schema with version [${schema.version}]`);
    }

    return true;
  }

  parse(schemaSrc: IPublicTypeProjectSchema | string): IParseResult {
    // TODO: collect utils depends in JSExpression
    const compDeps: Record<string, IExternalDependency> = {};
    const internalDeps: Record<string, IInternalDependency> = {};
    let utilsDeps: IExternalDependency[] = [];

    const schema = this.decodeSchema(schemaSrc);

    // 解析三方组件依赖
    schema.componentsMap.forEach((info: any) => {
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
      const firstRoot: IPublicTypeContainerSchema = schema.componentsTree[0] as IPublicTypeContainerSchema;

      if (!firstRoot.fileName && !isValidContainerType(firstRoot)) {
        // 整个 schema 描述一个容器，且无根节点定义
        const container: IContainerInfo = {
          ...firstRoot,
          ...defaultContainer,
          props: firstRoot.props || defaultContainer.props,
          css: firstRoot.css || defaultContainer.css,
          moduleName: (firstRoot as IContainerInfo).moduleName || defaultContainer.moduleName,
          children: schema.componentsTree as IPublicTypeNodeSchema[],
        };
        containers = [container];
      } else {
        // 普通带 1 到多个容器的 schema
        containers = schema.componentsTree.map((n) => {
          const subRoot = n as IPublicTypeContainerSchema;
          const container: IContainerInfo = {
            ...subRoot,
            componentName: getRootComponentName(subRoot.componentName, compDeps),
            containerType: subRoot.componentName,
            moduleName: ensureValidClassName(subRoot.componentName === ContainerType.Component ?
              subRoot.fileName : changeCase.pascalCase(subRoot.fileName)),
          };
          return container;
        });
      }
    } else {
      throw new CodeGeneratorError("Can't find anything to generate.");
    }

    // 分析引用能力的依赖
    containers = containers.map((con) => ({
      ...con,
      analyzeResult: componentAnalyzer(con as IPublicTypeContainerSchema),
    }));

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
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        handleSubNodes<void>(
          container.children,
          {
            node: (i: IPublicTypeNodeSchema) => processChildren(i),
          },
          {
            rerun: true,
          },
        );
      }
    });

    containers.forEach((container) => {
      const depNames = this.getComponentNames(container);
      // eslint-disable-next-line no-param-reassign
      container.deps = uniqueArray<string>(depNames, (i: string) => i)
        .map((depName) => getInternalDep(internalDeps, depName) || compDeps[depName])
        .filter(Boolean);
      // container.deps = Object.keys(compDeps).map((depName) => compDeps[depName]);
    });

    // 分析路由配置
    const routes: IRouterInfo['routes'] = containers
      .filter((container) => container.containerType === 'Page')
      .map((page) => {
        const { meta } = page;
        if (meta) {
          return {
            path: (meta as IPageMeta).router || `/${page.fileName}`, // 如果无法找到页面路由信息，则用 fileName 做兜底
            fileName: page.fileName,
            componentName: page.moduleName,
          };
        }

        return {
          path: '',
          fileName: page.fileName,
          componentName: page.moduleName,
        };
      });

    const routerDeps = routes
      .map((r) => internalDeps[r.componentName] || compDeps[r.componentName])
      .filter((dep) => !!dep);

    // 分析 Utils 依赖
    let utils: IPublicTypeUtilItem[];
    if (schema.utils) {
      utils = schema.utils;
      utilsDeps = schema.utils
        .filter(
          (u): u is { name: string; type: 'npm' | 'tnpm'; content: IPublicTypeNpmInfo } => u.type !== 'function',
        )
        .map(
          (u): IExternalDependency => ({
            ...u.content,
            componentName: u.name,
            version: u.content.version || '*',
            destructuring: u.content.destructuring ?? false,
            exportName: u.content.exportName ?? u.name,
          }),
        );
    } else {
      utils = [];
    }

    // 分析项目 npm 依赖
    let npms: INpmPackage[] = [];
    containers.forEach((con) => {
      const p = (con.deps || [])
        .map((dep) => {
          return dep.dependencyType === DependencyType.External ? dep : null;
        })
        .filter((dep) => dep !== null);
      const npmInfos: INpmPackage[] = p.filter(Boolean).map((i) => ({
        package: (i as IExternalDependency).package,
        version: (i as IExternalDependency).version,
      }));
      npms.push(...npmInfos);
    });

    npms.push(
      ...utilsDeps.map((utilsDep) => ({
        package: utilsDep.package,
        version: utilsDep.version,
      })),
    );

    npms = uniqueArray<INpmPackage>(npms, (i) => i.package).filter(Boolean);

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
        config: schema.config || {},
        meta: schema.meta || {},
        i18n: schema.i18n,
        containersDeps,
        utilsDeps,
        packages: npms || [],
        dataSourcesTypes: this.collectDataSourcesTypes(schema),
        projectRemark: this.getProjectRemark(containers),
      },
    };
  }

  getProjectRemark(containers: IContainerInfo[]): ProjectRemark {
    return {
      isSingleComponent: containers.length === 1 && containers[0].containerType === 'Component',
    };
  }

  getComponentNames(children: IPublicTypeNodeDataType): string[] {
    return handleSubNodes<string>(
      children,
      {
        node: (i: IPublicTypeNodeSchema) => i.componentName,
      },
      {
        rerun: true,
      },
    );
  }

  decodeSchema(schemaSrc: string | IPublicTypeProjectSchema): IPublicTypeProjectSchema {
    let schema: IPublicTypeProjectSchema;
    if (typeof schemaSrc === 'string') {
      try {
        schema = JSON.parse(schemaSrc);
      } catch (error) {
        throw new CodeGeneratorError(
          `Parse schema failed: ${getErrorMessage(error) || 'unknown reason'}`,
        );
      }
    } else {
      schema = schemaSrc;
    }
    return schema;
  }

  private collectDataSourcesTypes(schema: IPublicTypeProjectSchema): string[] {
    const dataSourcesTypes = new Set<string>();

    // 数据源的默认类型为 fetch
    const defaultDataSourceType = 'fetch';

    // 收集应用级别的数据源
    schema.dataSource?.list?.forEach((ds) => {
      dataSourcesTypes.add(ds.type || defaultDataSourceType);
    });

    // 收集容器级别的数据源（页面/组件/区块）
    schema.componentsTree.forEach((rootNode) => {
      rootNode.dataSource?.list?.forEach((ds) => {
        dataSourcesTypes.add(ds.type || defaultDataSourceType);
      });
    });

    return Array.from(dataSourcesTypes.values());
  }
}

export default SchemaParser;
