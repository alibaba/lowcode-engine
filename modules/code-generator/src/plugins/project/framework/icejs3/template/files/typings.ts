import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'typings.d',
    'ts',
    `/// <reference types="@ice/app/types" />

export {};
declare global {
  interface Window {
    g_config: Record<string, any>;
  }
}
    `,
  );

  return [['src'], file];
}
