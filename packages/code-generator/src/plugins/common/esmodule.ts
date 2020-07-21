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

function groupDepsByPack(deps: IDependency[]): Record<string, IDependency[]> {
  const depMap: Record<string, IDependency[]> = {};

  const addDep = (pkg: string, dep: IDependency) => {
    if (!depMap[pkg]) {
      depMap[pkg] = [];
    }
    depMap[pkg].push(dep);
  };

  deps.forEach(dep => {
    if (dep.dependencyType === DependencyType.Internal) {
      addDep(
        `${(dep as IInternalDependency).moduleName}${`/${dep.main}` || ''}`,
        dep,
      );
    } else {
      addDep(`${(dep as IExternalDependency).package}${`/${dep.main}` || ''}`, dep);
    }
  });

  return depMap;
}

function buildPackageImport(
  pkg: string,
  deps: IDependency[],
  targetFileType: string,
): ICodeChunk[] {
  const chunks: ICodeChunk[] = [];
  let defaultImport: string = '';
  let defaultImportAs: string = '';
  const imports: Record<string, string> = {};

  deps.forEach(dep => {
    const srcName = dep.exportName;
    let targetName = dep.importName || dep.exportName;
    if (dep.subName) {
      return;
    }

    if (dep.subName) {
      chunks.push({
        type: ChunkType.STRING,
        fileType: targetFileType,
        name: COMMON_CHUNK_NAME.FileVarDefine,
        content: `const ${targetName} = ${srcName}.${dep.subName};`,
        linkAfter: [
          COMMON_CHUNK_NAME.ExternalDepsImport,
          COMMON_CHUNK_NAME.InternalDepsImport,
        ],
      });

      targetName = srcName;
    }

    if (dep.destructuring) {
      imports[srcName] = targetName;
    } else if (defaultImport) {
      throw new CodeGeneratorError(
        `[${pkg}] has more than one default export.`,
      );
    } else {
      defaultImport = srcName;
      defaultImportAs = targetName;
    }
  });

  const items = Object.keys(imports).map(src =>
    src === imports[src] ? src : `${src} as ${imports[src]}`,
  );

  const statementL = ['import'];
  if (defaultImport) {
    statementL.push(defaultImportAs);
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
  fileType: string;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?: PluginConfig) => {
  const cfg: PluginConfig = {
    fileType: FileType.JS,
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IWithDependency;

    if (ir && ir.deps && ir.deps.length > 0) {
      const packs = groupDepsByPack(ir.deps);

      Object.keys(packs).forEach(pkg => {
        const chunks = buildPackageImport(pkg, packs[pkg], cfg.fileType);
        next.chunks.push.apply(next.chunks, chunks);
      });
    }

    return next;
  };

  return plugin;
};

export default pluginFactory;
