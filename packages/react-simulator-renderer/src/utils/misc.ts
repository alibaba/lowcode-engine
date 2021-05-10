interface UtilsMetadata {
  name: string;
  npm: {
    package: string;
    version?: string;
    exportName: string;
    subName?: string;
    destructuring?: boolean;
    main?: string;
  }
}

interface LibrayMap {
  [key: string]: string;
}

export function getProjectUtils(librayMap: LibrayMap, utilsMetadata: UtilsMetadata[]) {
  const projectUtils: { [packageName: string]: any } = {};
  if (utilsMetadata) {
    utilsMetadata.forEach(meta => {
      if (librayMap[meta?.npm.package]) {
        const lib = window[librayMap[meta?.npm.package]];
      }
    });
  }
}