// interface UtilsMetadata {
//   name: string;
//   npm: {
//     package: string;
//     version?: string;
//     exportName: string;
//     subName?: string;
//     destructuring?: boolean;
//     main?: string;
//   };
// }

// invalid code

// interface LibrayMap {
//   [key: string]: string;
// }

// export function getProjectUtils(librayMap: LibrayMap, utilsMetadata: UtilsMetadata[]) {

//   const projectUtils: { [packageName: string]: any } = {};
//   if (utilsMetadata) {
//     utilsMetadata.forEach(meta => {
//       if (librayMap[meta?.npm.package]) {
//         const lib = window[librayMap[meta?.npm.package] as any];
//       }
//     });
//   }
// }

/**
 * judges if current simulator renderer deteched or not
 * @returns detached or not
 */
export function isRendererDetached() {
  // if current iframe detached from host document, the `window.parent` will be undefined.
  return !window.parent;
}