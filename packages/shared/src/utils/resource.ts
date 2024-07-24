import { Package, Reference } from '../types';

export function mapPackageToUniqueId(schema: Package | Reference): string {
  return `${schema.id ?? schema.package}@${schema.version}`;
}

export function exportByReference<T = any>(target: any, reference: Reference): T | undefined {
  let result = target;

  // export { exportName } from xxx exportName === global.libraryName.exportName
  // export exportName from xxx exportName === global.libraryName.default || global.libraryName
  // const module = exportName.subName, if exportName empty subName do not use
  if (reference.exportName) {
    const paths = reference.subName ? reference.subName.split('.') : [];
    paths.unshift(reference.exportName);

    for (const path of paths) {
      result = result[path];
      if (!result) return undefined;
    }
  }

  return result;
}
