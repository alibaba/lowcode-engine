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

function groupDepsByPack(deps: IDependency[]): Record<string, IDependency[]> {
  const depMap: Record<string, IDependency[]> = {};

  const addDep = (pkg: string, dep: IDependency) => {
    if (!depMap[pkg]) {
      depMap[pkg] = [];
    }
    depMap[pkg].push(dep);
  };

  // TODO: main 这个信息到底怎么用，是不是外部包不需要使用？
  // deps.forEach(dep => {
  //   if (dep.dependencyType === DependencyType.Internal) {
  //     addDep(
  //       `${(dep as IInternalDependency).moduleName}${`/${dep.main}` || ''}`,
  //       dep,
  //     );
  //   } else {
  //     addDep(`${(dep as IExternalDependency).package}${`/${dep.main}` || ''}`, dep);
  //   }
  // });

  deps.forEach((dep) => {
    if (dep.dependencyType === DependencyType.Internal) {
      addDep(`${(dep as IInternalDependency).moduleName}`, dep);
    } else {
      addDep(`${(dep as IExternalDependency).package}`, dep);
    }
  });

  return depMap;
}

function buildPackageImport(
  pkg: string,
  deps: IDependency[],
  targetFileType: string,
  useAliasName: boolean,
): ICodeChunk[] {
  const chunks: ICodeChunk[] = [];
  let defaultImport = '';
  let defaultImportAs = '';
  const imports: Record<string, string> = {};

  deps.forEach((dep) => {
    const srcName = dep.exportName;
    let targetName = dep.componentName || dep.exportName;

    // 如果是自组件，则导出父组件，并且根据自组件命名规则，判断是否需要定义标识符
    if (dep.subName) {
      if (targetName !== `${srcName}.${dep.subName}`) {
        if (!isValidIdentifier(targetName)) {
          throw new CodeGeneratorError(`Invalid Identifier [${targetName}]`);
        }

        chunks.push({
          type: ChunkType.STRING,
          fileType: targetFileType,
          name: COMMON_CHUNK_NAME.ImportAliasDefine,
          content: `const ${targetName} = ${srcName}.${dep.subName};`,
          linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport, COMMON_CHUNK_NAME.InternalDepsImport],
          ext: {
            originalName: `${srcName}.${dep.subName}`,
            aliasName: targetName,
            dependency: dep,
          },
        });
      }

      targetName = srcName;
    }

    if (dep.destructuring) {
      imports[srcName] = targetName;
    } else if (defaultImport) {
      throw new CodeGeneratorError(`[${pkg}] has more than one default export.`);
    } else {
      defaultImport = srcName;
      defaultImportAs = targetName;
    }

    if (targetName !== srcName) {
      chunks.push({
        type: ChunkType.STRING,
        fileType: targetFileType,
        name: COMMON_CHUNK_NAME.ImportAliasDefine,
        content: '',
        linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport, COMMON_CHUNK_NAME.InternalDepsImport],
        ext: {
          originalName: srcName,
          aliasName: targetName,
          dependency: dep,
        },
      });
    }
  });

  const items = Object.keys(imports).map((src) => { return src === imports[src] || !useAliasName ? src : `${src} as ${imports[src]}`; });

  const statementL = ['import'];
  if (defaultImport) {
    statementL.push(useAliasName ? defaultImportAs : defaultImport);
    if (items.length > 0) {
      statementL.push(',');
    }
  }
  if (items.length > 0) {
    statementL.push(`{ ${items.join(', ')} }`);
  }
  statementL.push('from');

  if (deps[0].dependencyType === DependencyType.Internal) {
    // TODO: Internal Deps path use project slot setting
    statementL.push(`'@/${(deps[0] as IInternalDependency).type}/${pkg}';`);
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

  return chunks;
}

type PluginConfig = {
  fileType?: string; // 导出的文件类型
  useAliasName?: boolean; // 是否使用 componentName 重命名组件 identifier
};

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
      const packs = groupDepsByPack(ir.deps);

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
