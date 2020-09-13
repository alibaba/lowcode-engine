const fs = require('fs');
const path = require('path');

console.log(process.argv);
let root = '';
const pathArgIndex = process.argv.indexOf('--path');
if (pathArgIndex >= 0) {
  root = process.argv[pathArgIndex + 1];
}

if (!root) {
  throw new Error('Can\'t find path argument');
}

function cloneStr(str, times) {
  let count = times;
  const arr = [];
  while (count > 0) {
    arr.push(str);
    count -= 1;
  }
  return arr.join('');
}

function createTemplateFile(root, internalPath, fileName) {
  // 不是文件夹,则添加type属性为文件后缀名
  const fileTypeSrc = path.extname(fileName);
  const fileType = fileTypeSrc.substring(1);
  const baseName = path.basename(fileName, fileTypeSrc);

  const filePath = path.join(root, internalPath);
  const pieces = filePath.split(path.sep);
  const depPrefix = cloneStr('../', pieces.length - 1);
  const content = fs.readFileSync(path.join(filePath, fileName), {
    encoding: 'utf8',
  });
  const pathList = (internalPath.split(path.sep) || []).filter(p => !!p);
  const modulePathStr = JSON.stringify(pathList).replace(/\"/g, '\'');

  const templateContent = `
import ResultFile from '${depPrefix}model/ResultFile';
import { IResultFile } from '${depPrefix}types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    '${baseName}',
    '${fileType || ''}',
    \`
${content}
    \`,
  );

  return [${modulePathStr}, file];
}
  `;

  const targetFile = path.join(filePath, `${fileName}.ts`);
  console.log(`=== Create File: ${targetFile}`);
  fs.writeFileSync(targetFile, templateContent);
}

function fileDisplay(root, internalPath) {
  const dirPath = path.join(root, internalPath);
  const filesList = fs.readdirSync(dirPath);
  for (let i = 0; i < filesList.length; i++) {
    // 描述此文件/文件夹的对象
    const fileName = filesList[i];
    // 拼接当前文件的路径(上一层路径+当前file的名字)
    const filePath = path.join(dirPath, fileName);
    // 根据文件路径获取文件信息，返回一个fs.Stats对象
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // 递归调用
      fileDisplay(root, path.join(internalPath, fileName));
    } else {
      createTemplateFile(root, internalPath, fileName);
    }
  }
}

// 调用函数遍历根目录，同时传递 文件夹路径和对应的数组
// 请使用同步读取
fileDisplay(root, '');
// 读取完毕则写入到txt文件中
// fs.writeFileSync('./data.txt', JSON.stringify(arr));
