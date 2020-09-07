import * as JSZip from 'jszip';
import { IResultFile, IResultDir } from '@ali/lowcode-code-generator';

export const isNodeProcess = (): boolean => {
  return (
    typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined'
  )
}

export const writeZipToDisk = (
  zipFolderPath: string,
  content: Buffer | Blob,
  zipName: string
): void => {
  const fs = require('fs')
  const path = require('path')

  if (!fs.existsSync(zipFolderPath)) {
    fs.mkdirSync(zipFolderPath, { recursive: true })
  }

  const zipPath = path.join(zipFolderPath, `${zipName}.zip`)

  const writeStream = fs.createWriteStream(zipPath)
  writeStream.write(content)
  writeStream.end()
}

export const generateProjectZip = async (project: IResultDir): Promise<Buffer | Blob> => {
  let zip = new JSZip()
  zip = writeFolderToZip(project, zip, true)
  const zipType = isNodeProcess() ? 'nodebuffer' : 'blob'
  return zip.generateAsync({ type: zipType })
}

const writeFolderToZip = (
  folder: IResultDir,
  parentFolder: JSZip,
  ignoreFolder = false
) => {
  const zipFolder = ignoreFolder ? parentFolder : parentFolder.folder(folder.name)

  folder.files.forEach((file: IResultFile) => {
    // const options = file.contentEncoding === 'base64' ? { base64: true } : {}
    const options = {};
    const fileName = file.ext ? `${file.name}.${file.ext}` : file.name
    zipFolder.file(fileName, file.content, options)
  })

  folder.dirs.forEach((subFolder: IResultDir) => {
    writeFolderToZip(subFolder, zipFolder)
  })

  return parentFolder
}
