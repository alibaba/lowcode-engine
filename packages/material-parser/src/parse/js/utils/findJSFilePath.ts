import fs from 'fs';

const suffixes = ['js', 'jsx'];
export default function findJSFilePath(fileBasePath: string): string {
  let filePath;
  for (const suffix of suffixes) {
    const fp = `${fileBasePath}.${suffix}`;
    if (fs.existsSync(fp)) {
      filePath = fp;
      break;
    }
  }

  return filePath;
}