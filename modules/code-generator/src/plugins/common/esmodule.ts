import { flatMap, camelCase, get } from 'lodash';
import { COMMON_CHUNK_NAME } from '../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  CodeGeneratorError,
  DependencyType,
  FileType,
  ICodeChunk,
  ICodeStruct,
  IDependency,
  IExternalDependency,
  IInternalDependency,
  IWithDependency,
} from '../../types';

import { isValidIdentifier } from '../../utils/validate';

// TODO: main 这个信息到底怎么用，是不是外部包不需要使用？
const DEP_MAIN_BLOCKLIST = ['lib', 'lib/index', 'es', 'es/index', 'main'];
const DEFAULT_EXPORT_NAME = '__default__';

function groupDepsByPack(deps: IDependency[]): Record<string, IDependency[]> {
  const depMap: Record<string, IDependency[]> = {};

  const addDep = (pkg: string, dep: IDependency) => {
    if (!depMap[pkg]) {
      depMap[pkg] = [];
    }
    depMap[pkg].push(dep);
  };

  deps.forEach((dep) => {
    if (dep.dependencyType === DependencyType.Internal) {
      addDep(`${(dep as IInternalDependency).moduleName}${dep.main ? `/${dep.main}` : ''}`, dep);
    } else {
      let depMain = '';
      // TODO: 部分类型的 main 暂时认为没用
      if (dep.main && DEP_MAIN_BLOCKLIST.indexOf(dep.main) < 0) {
        depMain = dep.main;
      }
      if (depMain.substring(0, 1) === '/') {
        depMain = depMain.substring(1);
      }
      addDep(`${(dep as IExternalDependency).package}${depMain ? `/${depMain}` : ''}`, dep);
    }
  });

  return depMap;
}

interface IDependencyItem {
  exportName: string;
  aliasName?: string;
  isDefault?: boolean;
  subName?: string;
  nodeIdentifier?: string; // 与使用处的映射关系，理论上是不可变更的，如需变更需要提供额外信息
  source: IDependency;
}

interface IExportItem {
  exportName: string;
  aliasNames: string[];
  isDefault?: boolean;
  needOriginExport: boolean;
}

function getDependencyIdentifier(info: IDependencyItem): string {
  return info.aliasName || info.exportName;
}

function getExportNameOfDep(dep: IDependency): string {
  if (dep.destructuring) {
    return (
      dep.exportName ||
      dep.componentName ||
      throwNewError('destructuring dependency must have exportName or componentName')
    );
  }

  if (!dep.subName) {
    return (
      dep.componentName ||
      dep.exportName ||
      throwNewError('dependency item must have componentName or exportName')
    );
  }

  return (
    dep.exportName ||
    `__$${camelCase(
      get(dep, 'moduleName') ||
        get(dep, 'package') ||
        throwNewError('dep.moduleName or dep.package is undefined'),
    )}_default`
  );
}

function throwNewError(msg: string): never {
  throw new Error(msg);
}

function buildPackageImport(
  pkg: string,
  deps: IDependency[],
  targetFileType: string,
  useAliasName: boolean,
): ICodeChunk[] {
  // 如果压根没有包，则不生成对应的 import 语句（生成了没有任何意义）
  if (!pkg || pkg === 'undefined' || pkg === 'null') {
    // TODO: 要不要加个 warning？
    return [];
  }

  const chunks: ICodeChunk[] = [];

  const exportItems: Record<string, IExportItem> = {};
  const defaultExportNames: string[] = [];

  const depsInfo: IDependencyItem[] = deps.map((dep) => {
    const info: IDependencyItem = {
      exportName: getExportNameOfDep(dep),
      isDefault: !dep.destructuring,
      subName: dep.subName || undefined,
      nodeIdentifier: dep.componentName || undefined,
      source: dep,
    };

    // 下面 5 个逻辑是清理不必要的冗余信息，做到数据结构归一化
    if (info.isDefault) {
      if (defaultExportNames.indexOf(info.exportName) < 0) {
        defaultExportNames.push(info.exportName);
      }
    }

    if (!info.subName) {
      if (info.nodeIdentifier === info.exportName) {
        info.nodeIdentifier = undefined;
      }

      if (info.isDefault) {
        info.aliasName = info.nodeIdentifier || info.exportName;
        info.exportName = DEFAULT_EXPORT_NAME;
      }

      if (info.nodeIdentifier) {
        info.aliasName = info.nodeIdentifier;
        info.nodeIdentifier = undefined;
      }
    } else {
      if (info.isDefault) {
        info.aliasName = info.exportName;
        info.exportName = DEFAULT_EXPORT_NAME;
      }

      if (info.nodeIdentifier === `${info.exportName}.${info.subName}`) {
        info.nodeIdentifier = undefined;
      }
    }

    return info;
  });

  // 建立 export 项目的列表
  depsInfo.forEach((info) => {
    if (!exportItems[info.exportName]) {
      exportItems[info.exportName] = {
        exportName: info.exportName,
        isDefault: info.isDefault,
        aliasNames: [],
        needOriginExport: false,
      };
    }

    if (!info.nodeIdentifier && !info.aliasName) {
      exportItems[info.exportName].needOriginExport = true;
    }
  });

  // 建立别名字典
  depsInfo.forEach((info) => {
    if (info.aliasName) {
      const { aliasNames } = exportItems[info.exportName];
      if (aliasNames.indexOf(info.aliasName) < 0) {
        aliasNames.push(info.aliasName);
      }
    }
  });

  // fix: 父组件ImportAliasDefine, 与子组件import的父组件冲突情况
  depsInfo.forEach((info) => {
    if (info.nodeIdentifier) {
      const exportItem = exportItems[info.exportName];
      if (!exportItem.needOriginExport && exportItem.aliasNames.length > 0) {
        // eslint-disable-next-line no-param-reassign
        info.aliasName = exportItem.aliasNames[0];
      }
    }
  });

  // 发现 nodeIdentifier 与 exportName 或者 aliasName 冲突的场景
  const nodeIdentifiers = depsInfo.map((info) => info.nodeIdentifier).filter(Boolean);
  const conflictInfos = flatMap(Object.keys(exportItems), (exportName) => {
    const exportItem = exportItems[exportName];
    const usedNames = [
      ...exportItem.aliasNames,
      ...(exportItem.needOriginExport || exportItem.aliasNames.length <= 0 ? [exportName] : []),
    ];
    const conflictNames = usedNames.filter((n) => nodeIdentifiers.indexOf(n) >= 0);
    if (conflictNames.length > 0) {
      return [
        ...(conflictNames.indexOf(exportName) >= 0 ? [[exportName, true, exportItem]] : []),
        ...conflictNames.filter((n) => n !== exportName).map((n) => [n, false, exportItem]),
      ];
    }
    return [];
  });

  const conflictExports = conflictInfos.filter((c) => c[1]).map((c) => c[0] as string);
  const conflictAlias = conflictInfos.filter((c) => !c[1]).map((c) => c[0] as string);

  const solutions: Record<string, string> = {};

  depsInfo.forEach((info) => {
    if (info.aliasName && conflictAlias.indexOf(info.aliasName) >= 0) {
      // find solution
      let solution = solutions[info.aliasName];
      if (!solution) {
        solution = `${info.aliasName}Alias`;
        const conflictItem = (conflictInfos.find((c) => c[0] === info.aliasName) ||
          [])[2] as IExportItem;
        conflictItem.aliasNames = conflictItem.aliasNames.filter((a) => a !== info.aliasName);
        conflictItem.aliasNames.push(solution);
        solutions[info.aliasName] = solution;
      }
      // eslint-disable-next-line no-param-reassign
      info.aliasName = solution;
    }

    if (conflictExports.indexOf(info.exportName) >= 0) {
      // find solution
      let solution = solutions[info.exportName];
      if (!solution) {
        solution = `${info.exportName}Export`;
        const conflictItem = (conflictInfos.find((c) => c[0] === info.exportName) ||
          [])[2] as IExportItem;
        conflictItem.aliasNames.push(solution);
        conflictItem.needOriginExport = false;
        solutions[info.exportName] = solution;
      }
      // eslint-disable-next-line no-param-reassign
      info.aliasName = solution;
    }
  });

  // 判断是否所有依赖都有合法的 Identifier
  depsInfo.forEach((info) => {
    const name = info.aliasName || info.exportName;
    if (!isValidIdentifier(name)) {
      throw new CodeGeneratorError(`Invalid Identifier [${name}]`);
    }
    if (info.nodeIdentifier && !isValidIdentifier(info.nodeIdentifier)) {
      throw new CodeGeneratorError(`Invalid Identifier [${info.nodeIdentifier}]`);
    }
  });

  const aliasDefineStatements: Record<string, string> = {};
  if (useAliasName) {
    Object.keys(exportItems).forEach((exportName) => {
      const aliasList = exportItems[exportName]?.aliasNames || [];
      if (aliasList.length > 0) {
        const srcName = exportItems[exportName].needOriginExport ? exportName : aliasList[0];
        const aliasNameList = exportItems[exportName].needOriginExport
          ? aliasList
          : aliasList.slice(1);
        aliasNameList.forEach((a) => {
          if (!aliasDefineStatements[a]) {
            aliasDefineStatements[a] = `const ${a} = ${srcName};`;
          }
        });
      }
    });
  }

  function getDefaultExportName(info: IDependencyItem): string {
    if (info.isDefault) {
      return defaultExportNames[0];
    }
    return info.exportName;
  }

  depsInfo.forEach((info) => {
    // 如果是子组件，则导出父组件，并且根据自组件命名规则，判断是否需要定义标识符
    if (info.nodeIdentifier) {
      // 前提，存在 nodeIdentifier 一定是有 subName 的，不然前面会优化掉
      const ownerName = getDependencyIdentifier(info);

      chunks.push({
        type: ChunkType.STRING,
        fileType: targetFileType,
        name: COMMON_CHUNK_NAME.ImportAliasDefine,
        content: useAliasName ? `const ${info.nodeIdentifier} = ${ownerName}.${info.subName};` : '',
        linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport, COMMON_CHUNK_NAME.InternalDepsImport],
        ext: {
          originalName: `${getDefaultExportName(info)}.${info.subName}`,
          aliasName: info.nodeIdentifier,
          dependency: info.source,
        },
      });
    } else if (info.aliasName) {
      // default 方式的导入会生成单独de import 语句，无需生成赋值语句
      if (info.isDefault && defaultExportNames.find((n) => n === info.aliasName)) {
        delete aliasDefineStatements[info.aliasName];
        return;
      }

      let contentStatement = '';
      if (aliasDefineStatements[info.aliasName]) {
        contentStatement = aliasDefineStatements[info.aliasName];
        delete aliasDefineStatements[info.aliasName];
      }

      chunks.push({
        type: ChunkType.STRING,
        fileType: targetFileType,
        name: COMMON_CHUNK_NAME.ImportAliasDefine,
        content: contentStatement,
        linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport, COMMON_CHUNK_NAME.InternalDepsImport],
        ext: {
          originalName: getDefaultExportName(info),
          aliasName: info.aliasName,
          dependency: info.source,
        },
      });
    }
  });

  // 可能会剩余一些存在二次转换的定义
  Object.keys(aliasDefineStatements).forEach((a) => {
    chunks.push({
      type: ChunkType.STRING,
      fileType: targetFileType,
      name: COMMON_CHUNK_NAME.ImportAliasDefine,
      content: aliasDefineStatements[a],
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport, COMMON_CHUNK_NAME.InternalDepsImport],
    });
  });

  const exportItemList = Object.keys(exportItems).map((k) => exportItems[k]);
  const defaultExport = exportItemList.filter((item) => item.isDefault);
  const otherExports = exportItemList.filter((item) => !item.isDefault);

  const statementL = ['import'];
  if (defaultExport.length > 0) {
    if (useAliasName) {
      statementL.push(defaultExportNames[0]);
    } else {
      statementL.push(defaultExport[0].aliasNames[0]);
    }
    if (otherExports.length > 0) {
      statementL.push(', ');
    }
  }
  if (otherExports.length > 0) {
    const items = otherExports.map((item) => {
      return !useAliasName || item.needOriginExport || item.aliasNames.length <= 0
        ? item.exportName
        : `${item.exportName} as ${item.aliasNames[0]}`;
    });
    statementL.push(`{ ${items.join(', ')} }`);
  }
  statementL.push('from');

  const getInternalDependencyModuleId = () => `@/${(deps[0] as IInternalDependency).type}/${pkg}`;

  if (deps[0].dependencyType === DependencyType.Internal) {
    // TODO: Internal Deps path use project slot setting
    statementL.push(`'${getInternalDependencyModuleId()}';`);
    chunks.push({
      type: ChunkType.STRING,
      fileType: targetFileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: statementL.join(' '),
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
    });
  } else {
    statementL.push(`'${pkg}';`);
    chunks.push({
      type: ChunkType.STRING,
      fileType: targetFileType,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: statementL.join(' '),
      linkAfter: [],
    });
  }

  // 处理下一些额外的 default 方式的导入
  if (defaultExportNames.length > 1) {
    if (deps[0].dependencyType === DependencyType.Internal) {
      defaultExportNames.slice(1).forEach((exportName) => {
        chunks.push({
          type: ChunkType.STRING,
          fileType: targetFileType,
          name: COMMON_CHUNK_NAME.InternalDepsImport,
          content: `import ${exportName} from '${getInternalDependencyModuleId()}';`,
          linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
        });
      });
    } else {
      defaultExportNames.slice(1).forEach((exportName) => {
        chunks.push({
          type: ChunkType.STRING,
          fileType: targetFileType,
          name: COMMON_CHUNK_NAME.ExternalDepsImport,
          content: `import ${exportName} from '${pkg}';`,
          linkAfter: [],
        });

        chunks.push({
          type: ChunkType.STRING,
          fileType: targetFileType,
          name: COMMON_CHUNK_NAME.ImportAliasDefine,
          content: '',
          linkAfter: [],
          ext: {
            aliasName: exportName,
            originalName: exportName,
            dependency: {
              package: pkg,
              componentName: exportName,
            },
          },
        });
      });
    }
  }

  return chunks;
}

export interface PluginConfig {
  fileType?: string; // 导出的文件类型
  useAliasName?: boolean; // 是否使用 componentName 重命名组件 identifier
  filter?: (deps: IDependency[]) => IDependency[]; // 支持过滤能力
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?: PluginConfig) => {
  const cfg = {
    fileType: FileType.JS,
    useAliasName: true,
    ...(config || {}),
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IWithDependency;

    if (ir && ir.deps && ir.deps.length > 0) {
      const deps = cfg.filter ? cfg.filter(ir.deps) : ir.deps;
      const packs = groupDepsByPack(deps);

      Object.keys(packs).forEach((pkg) => {
        const chunks = buildPackageImport(pkg, packs[pkg], cfg.fileType, cfg.useAliasName);
        next.chunks.push(...chunks);
      });
    }

    return next;
  };

  return plugin;
};

export default pluginFactory;
